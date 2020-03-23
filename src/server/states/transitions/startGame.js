const { TURN_STATE, START_TURN } = require('../../../common/signals')

module.exports = function startGame (status) {
  const { room } = status
  const playerId = Math.floor(Math.random() * room.playerCount)

  room.emit(START_TURN, playerId)
  room.setState(TURN_STATE, playerId)
}
