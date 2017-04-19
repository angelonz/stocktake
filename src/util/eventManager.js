const events = require('events');

const emitter = new events.EventEmitter();

module.exports = {
    getEmitter: () => emitter
}