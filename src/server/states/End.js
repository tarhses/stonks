import Status from "../Status.js";
import { END_GAME, END_STATE, NONEXISTENT_ERROR } from "../../common/signals.js";

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
            type: END_STATE
        };
    }

    static deserialize(room) {
        return new End(room);
    }
}
