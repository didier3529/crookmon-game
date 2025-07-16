const event: AnalyticsEvent = {
      eventName,
      data,
      timestamp: Date.now(),
      userId: this.userId,
    }
    this.queue.push(event)
    if (this.queue.length > this.maxQueueSize) {
      // drop oldest events
      while (this.queue.length > this.maxQueueSize) {
        this.queue.shift()
      }
      console.warn('AnalyticsService: queue size exceeded maxQueueSize, oldest events dropped')
    }
    if (this.queue.length >= this.batchSize) {
      this.flush().catch(err => {
        console.error('AnalyticsService flush failed', err)
      })
    }
  }

  public async flush(): Promise<void> {
    if (!this.endpoint || this.queue.length === 0) {
      return
    }
    if (this.flushing) {
      return
    }
    this.flushing = true
    const batch = this.queue.splice(0, this.batchSize)
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
        },
        body: JSON.stringify({ events: batch }),
      })
      if (!response.ok) {
        throw new Error(`AnalyticsService request failed with status ${response.status}`)
      }
    } catch (error) {
      // re-queue failed batch
      this.queue = [...batch, ...this.queue]
      throw error
    } finally {
      this.flushing = false
    }
  }
}

const analyticsService = new AnalyticsService()

export const initAnalytics = analyticsService.initAnalytics.bind(analyticsService)
export const logEvent = analyticsService.logEvent.bind(analyticsService)
export const setUserId = analyticsService.setUserId.bind(analyticsService)
export const flush = analyticsService.flush.bind(analyticsService)