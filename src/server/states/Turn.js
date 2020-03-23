const State = require('../State.js')
const { startAuction, startOffer } = require('./transitions')
const { TURN_STATE } = require('../../common/signals')

module.exports = class Turn extends State {
  playerId

  constructor (room, playerId) {
    super(room)
    this.playerId = playerId
  }

  onSell (player) {
    if (player.id === this.playerId && this.room.animalCount > 0) {
      startAuction(this)
    }
  }

  onBuy (player, targetId, animalId) {
    const target = this.room.players[targetId]
    if (player.id === this.playerId && player.id !== targetId && player.animals[animalId] > 0 && target.animals[animalId] > 0) {
      startOffer(this, targetId, animalId)
    }
  }

  serialize () {
    return {
      type: TURN_STATE,
      playerId: this.playerId
    }
  }

  static deserialize (room, { playerId }) {
    return new Turn(room, playerId)
  }
}
