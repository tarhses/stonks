import Status from "../Status.js";
import { END_GAME, NONEXISTENT_ERROR } from "../../common/signals.js";

export default class End extends Status {
    constructor(room) {
        super(room);
        room.emit(END_GAME);
    }

    onEnter() {
        return NONEXISTENT_ERROR;
    }

    serialize() {
        return {
            type: "end"
        };
    }
}
