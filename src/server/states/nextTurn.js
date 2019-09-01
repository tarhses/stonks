import Turn from "./Turn.js";
import End from "./End.js";
import rules from "../../rules.json";

export default room => {
    let id = (room.status.playerId + 1) % room.playerCount;

    if (room.animalCount === 0) {
        while (room.players[id].animals.every(count => count === 0 || count === rules.animalCount)) {
            id = (id + 1) % room.playerCount;
            if (id === room.status.playerId) {
                return new End(room);
            }
        }
    }

    return new Turn(room, id);
};
