import path from "path";
import http from "http";
import Express from "express";
import SocketServer from "socket.io";
import Player from "./Player.js";
import Room from "./Room.js";
import { withResponse, withSession } from "./decorators.js";
import {
    CREATE_ROOM,
    JOIN_ROOM,
    MAKE_BID,
    MAKE_COUNTEROFFER,
    MAKE_OFFER,
    NONEXISTENT_ERROR,
    RECREATE_ROOM,
    SELL_ANIMAL,
    START_AUCTION,
    START_OFFER,
    START_TURN,
    STOP_BID,
    UNKNOWN_ERROR
} from "../common/signals.js";

const app = new Express();
const server = http.createServer(app);
const io = new SocketServer(server, { serveClient: false }); // don't serve the client, webpack will
const rooms = new Map();

io.on("connect", socket => {
    // Connection and disconnection
    socket.on(CREATE_ROOM, withResponse(playerName => {
        if (Player.connected(socket)) {
            return UNKNOWN_ERROR;
        }

        const room = new Room(io);
        rooms.set(room.id, room);
        console.log(`[${room.id}] room created`);

        return room.join(socket, playerName);
    }));

    socket.on(RECREATE_ROOM, state => {
        console.log(state);
    });

    socket.on(JOIN_ROOM, withResponse((playerName, roomId) => {
        if (Player.connected(socket)) {
            return UNKNOWN_ERROR;
        }

        const room = rooms.get(roomId);
        if (!room) {
            return NONEXISTENT_ERROR;
        }

        return room.join(socket, playerName);
    }));

    socket.on("disconnect", withSession(socket, (room, player) => {
        room.leave(player);
        if (room.empty) {
            rooms.delete(room.id);
            console.log(`[${room.id}] room deleted`);
        }
    }));

    for (const signal of [START_TURN, START_AUCTION, START_OFFER, MAKE_BID, STOP_BID, SELL_ANIMAL, MAKE_OFFER, MAKE_COUNTEROFFER]) {
        socket.on(signal, withSession(socket, (room, ...args) => room.do(signal, args)));
    }
});

// Start the http server
// Whatever the request, we'll respond with "index.html"
app.use(Express.static("./dist"));
app.use((req, res) => res.sendFile(path.resolve("./dist/index.html")));
server.listen(process.env.PORT || 8080);
