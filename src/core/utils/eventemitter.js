/**
 * Event Emitter - Simple event system for the battle engine
 * Provides pub/sub functionality for decoupled communication
 */
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} - For chaining
   */
  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }

    const listeners = this.events.get(event);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.events.set(event, new Set([listener]));
    }
    return this;
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} [listener] - Specific listener to remove, or all if omitted
   * @returns {EventEmitter} - For chaining
   */
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

  /**
   * Subscribe to an event that fires only once
   * @param {string} event - Event name
   * @param {Function} listener - Callback function
   * @returns {EventEmitter} - For chaining
   */
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    return this.on(event, onceWrapper);
  }

  /**
   * Emit an event to all subscribers
   * @param {string} event - Event name
   * @param {...any} args - Arguments to pass to listeners
   * @returns {boolean} - True if event had listeners
   */
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners || listeners.size === 0) {
      return false;
    }

    // Convert to array to avoid issues if listeners are modified during iteration
    const listenersArray = Array.from(listeners);

    for (const listener of listenersArray) {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error(`Error in event listener for '${event}':`, error);
      }
    }

    return true;
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    this.events.clear();
  }

  /**
   * Get all event names with listeners
   * @returns {string[]} - Array of event names
   */
  eventNames() {
    return Array.from(this.events.keys());
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number} - Number of listeners
   */
  listenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.size : 0;
  }
}

export default EventEmitter;
