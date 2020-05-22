import Turn from "../Turn.js";
import { START_TURN } from "../../../common/signals.js";

export default function startGame(status) {
    const { room } = status;
    const playerId = Math.floor(Math.random() * room.playerCount);

    room.emit(START_TURN, playerId);
    return new Turn(room, playerId);
}
