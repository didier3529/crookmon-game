declare const require: any

type AudioManager = {
  playSound(name: string): Promise<void>
  pauseAll(): void
  setVolume(level: number): void
  mute(): void
  unmute(): void
}

const soundModules: Record<string, string> = {}

;(function importAllSounds() {
  if (typeof require === 'function' && require.context) {
    try {
      const req = require.context('../assets/sounds', false, /\.mp3$/)
      req.keys().forEach((key: string) => {
        const name = key.replace('./', '').replace('.mp3', '')
        const module = req(key) as { default: string }
        soundModules[name] = module.default || module
      })
    } catch (e) {
      console.warn('useAudioManager: require.context failed to load sounds', e)
    }
  }
})()

export function useAudioManager(): AudioManager {
  const audioMap = useRef<Map<string, HTMLAudioElement>>(new Map())
  const loadingPromises = useRef<Map<string, Promise<HTMLAudioElement>>>(new Map())
  const volumeRef = useRef<number>(1)
  const prevVolumeRef = useRef<number>(1)
  const isMutedRef = useRef<boolean>(false)

  const loadAudio = useCallback(async (name: string): Promise<HTMLAudioElement> => {
    const existingAudio = audioMap.current.get(name)
    if (existingAudio) return existingAudio
    const existingPromise = loadingPromises.current.get(name)
    if (existingPromise) return existingPromise
    const promise = (async (): Promise<HTMLAudioElement> => {
      let src = soundModules[name]
      if (!src) {
        const module = await import(`../assets/sounds/${name}.mp3`)
        src = (module as any).default || module
      }
      const audio = new Audio(src)
      audio.preload = 'auto'
      audio.volume = isMutedRef.current ? 0 : volumeRef.current
      audio.muted = isMutedRef.current
      audioMap.current.set(name, audio)
      return audio
    })()
    loadingPromises.current.set(name, promise)
    try {
      return await promise
    } finally {
      loadingPromises.current.delete(name)
    }
  }, [])

  const playSound = useCallback(async (name: string) => {
    let audio: HTMLAudioElement
    try {
      audio = await loadAudio(name)
    } catch (error) {
      console.error(`useAudioManager: Failed to load sound '${name}':`, error)
      return
    }
    audio.currentTime = 0
    try {
      await audio.play()
    } catch (error) {
      console.warn(`useAudioManager: Failed to play sound '${name}':`, error)
    }
  }, [loadAudio])

  const pauseAll = useCallback(() => {
    audioMap.current.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }, [])

  const setVolume = useCallback((level: number) => {
    const clamped = Math.min(Math.max(level, 0), 1)
    volumeRef.current = clamped
    if (!isMutedRef.current) {
      audioMap.current.forEach(audio => {
        audio.volume = clamped
      })
    }
  }, [])

  const mute = useCallback(() => {
    if (isMutedRef.current) return
    prevVolumeRef.current = volumeRef.current
    isMutedRef.current = true
    audioMap.current.forEach(audio => {
      audio.muted = true
    })
  }, [])

  const unmute = useCallback(() => {
    if (!isMutedRef.current) return
    isMutedRef.current = false
    volumeRef.current = prevVolumeRef.current
    audioMap.current.forEach(audio => {
      audio.muted = false
      audio.volume = volumeRef.current
    })
  }, [])

  useEffect(() => {
    return () => {
      audioMap.current.forEach(audio => {
        try {
          audio.pause()
          audio.src = ''
          audio.removeAttribute('src')
          audio.load()
        } catch {}
      })
      audioMap.current.clear()
      loadingPromises.current.clear()
    }
  }, [])

  return { playSound, pauseAll, setVolume, mute, unmute }
}