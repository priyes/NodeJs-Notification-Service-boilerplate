const { EventEmitter, captureRejectionSymbol } = require('events')

module.exports = () => {
  class CustomEvent extends EventEmitter {
    constructor () {
      super({ captureRejections: true })
    }
    [captureRejectionSymbol] (err, event, ...args) {
      console.log('Rejection happened for', event, 'with', err, ...args)
      // this.destroy(err);
    }
    async publishEvent (eventName, message) {
      this.emit(eventName, message)
      return true
    }
    async subscribeEvent (eventName, fn) {
      this.on(eventName, fn)
      return true
    }
    async unSubscribeEvent (eventName, fn) {
      this.off(eventName, fn)
    }
  }
  return CustomEvent
}
