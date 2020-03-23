const State = require('../State.js')
const { startGame } = require('./transitions')
const { ADD_PLAYER, FULL_ERROR, NAME_ERROR, REMOVE_PLAYER } = require('../../common/signals')

module.exports = class Lobby extends State {
  onEnter (socket, playerName) {
    if (this.room.playerCount === 5) {
      return FULL_ERROR
    } else if (this.room.findPlayer(playerName) || /\s|^$/.test(playerName)) {
      return NAME_ERROR
    }

    const player = this.room.addPlayer(playerName)
    player.connect(socket)

    this.room.emit(ADD_PLAYER, playerName)
    return this.room.serialize(player.id)
  }

  onLeave (player) {
    // Completely remove the player from the room
    this.room.emit(REMOVE_PLAYER, player.id)
    this.room.removePlayer(player.id)
  }

  onStart (player) {
    if (player.id === 0 && this.room.playerCount >= 3) {
      startGame(this)
    }
  }

  serialize () {
    return null
  }

  static deserialize (room) {
    return new Lobby(room)
  }
}
