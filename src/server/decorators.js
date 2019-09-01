import Player from "./Player.js";

export const withResponse = f => (...args) => {
    const respond = args.pop();
    respond(f(...args));
};

export const withSession = (socket, f) => (...args) => {
    const player = Player.connected(socket);
    if (player) {
        f(player.room, player, ...args);
    }
};
