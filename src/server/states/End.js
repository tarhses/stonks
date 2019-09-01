import Status from "../Status.js";

export default class End extends Status {
    constructor(room) {
        super(room);
        room.emit("end");
    }

    onEnter() {
        return "This room doesn't exist.";
    }

    serialize() {
        return {
            type: "end"
        };
    }
}
