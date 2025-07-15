export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue
      }
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`useLocalStorage: Error reading key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue(prev => {
          const valueToStore =
            typeof value === 'function'
              ? (value as (prev: T) => T)(prev)
              : value
          if (typeof window !== 'undefined') {
            try {
              window.localStorage.setItem(key, JSON.stringify(valueToStore))
            } catch (error) {
              console.error(`useLocalStorage: Error setting key "${key}":`, error)
            }
          }
          return valueToStore
        })
      } catch (error) {
        console.error(`useLocalStorage: Error updating state for key "${key}":`, error)
      }
    },
    [key]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue
        setStoredValue(newValue)
      } catch (error) {
        console.error(`useLocalStorage: Error parsing storage event for key "${key}":`, error)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [key])

  return [storedValue, setValue]
}