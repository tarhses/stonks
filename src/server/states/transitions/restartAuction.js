const { AUCTION_STATE, RESTART_AUCTION } = require('../../../common/signals')

module.exports = function restartAuction (status) {
  const { room, playerId, bidderId, animalId } = status
  const capital = room.players[bidderId].capital

  room.setState(AUCTION_STATE, playerId, animalId)
  room.emit(RESTART_AUCTION, capital, room.state.timeout)
}
