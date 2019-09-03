import Turn from "../Turn.js";
import End from "../End.js";
import rules from "../../../common/rules.json";
import { END_GAME, START_TURN } from "../../../common/signals.js";

export default function nextTurn(status) {
    const { room } = status;
    let playerId = (room.status.playerId + 1) % room.playerCount;

    if (room.animalCount === 0) {
        while (room.players[playerId].animals.every(count => count === 0 || count === rules.animalCount)) {
            playerId = (playerId + 1) % room.playerCount;

            if (playerId === status.playerId) {
                room.emit(END_GAME);
                return new End(room);
            }
        }
    }

    room.emit(START_TURN, playerId);
    return new Turn(room, playerId);
}
