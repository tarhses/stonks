const { AUCTION_STATE, START_AUCTION } = require('../../../common/signals')

module.exports = function startAuction (status) {
  const { room, playerId } = status
  const animalId = room.pickAnimal()

  room.setState(AUCTION_STATE, playerId, animalId)
  room.emit(START_AUCTION, animalId, room.state.timeout)
}
