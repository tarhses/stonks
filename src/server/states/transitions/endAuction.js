const { AUCTION_END_STATE, END_AUCTION } = require('../../../common/signals')

module.exports = function endAuction (status) {
  const { room, playerId, bidderId, animalId, amount } = status

  room.emit(END_AUCTION)
  room.setState(AUCTION_END_STATE, playerId, bidderId, animalId, amount)
}
