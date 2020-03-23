const rules = require('../../../common/rules')
const { TURN_STATE, END_STATE, END_GAME, START_TURN } = require('../../../common/signals')

module.exports = function nextTurn (status) {
  const { room } = status
  let playerId = (room.state.playerId + 1) % room.playerCount

  if (room.animalCount > 0) {
    room.emit(START_TURN, playerId)
    room.setState(TURN_STATE, playerId)
  } else {
    while (room.players[playerId].animals.every(count => count === 0 || count === rules.animalCount)) {
      playerId = (playerId + 1) % room.playerCount

      if (playerId === status.playerId) {
        room.emit(END_GAME)
        room.setState(END_STATE)
      }
    }
  }
}
