const listeners = this.events.get(event);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.events.set(event, new Set([listener]));
    }
    return this;
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) {
      return this;
    }
    if (listener) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.events.delete(event);
      }
    } else {
      this.events.delete(event);
    }
    return this;
  }

  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    const wrapper = (payload) => {
      this.off(event, wrapper);
      listener(payload);
    };
    this.on(event, wrapper);
    return this;
  }

  emit(event, payload) {
    const listeners = this.events.get(event);
    if (!listeners) {
      return this;
    }
    for (const listener of Array.from(listeners)) {
      listener(payload);
    }
    return this;
  }
}

export default EventEmitter;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventEmitter;
}