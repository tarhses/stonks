const { OFFER_STATE, START_OFFER } = require('../../../common/signals')

module.exports = function startOffer (status, targetId, animalId) {
  const { room, playerId } = status

  room.setState(OFFER_STATE, playerId, targetId, animalId)
  room.emit(START_OFFER, targetId, animalId, room.state.count)
}
