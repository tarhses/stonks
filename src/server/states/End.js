const State = require('../State.js')
const { END_GAME, END_STATE, NONEXISTENT_ERROR } = require('../../common/signals')

module.exports = class End extends State {
  constructor (room) {
    super(room)
    room.emit(END_GAME)
  }

  onEnter () {
    return NONEXISTENT_ERROR
  }

  serialize () {
    return {
      type: END_STATE
    }
  }

  static deserialize (room) {
    return new End(room)
  }
}
