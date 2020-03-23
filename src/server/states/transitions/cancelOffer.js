const { TURN_STATE, CANCEL_OFFER } = require('../../../common/signals')

module.exports = function cancelOffer (status) {
  const { room, playerId } = status

  room.emit(CANCEL_OFFER)
  room.setState(TURN_STATE, playerId)
}
