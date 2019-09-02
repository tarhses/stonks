import path from "path";
import http from "http";
import Express from "express";
import SocketServer from "socket.io";
import Player from "./Player.js";
import Room from "./Room.js";
import { withResponse, withSession } from "./decorators.js";

const app = new Express();
const server = http.createServer(app);
const io = new SocketServer(server, { serveClient: false }); // don't serve the client, webpack will
const rooms = new Map();

io.on("connection", socket => {

    // Create, join or leave a room
    socket.on("create", withResponse(playerName => {
        if (Player.connected(socket)) {
            return "An error occurred, please refresh the page.";
        }

        const room = new Room(io);
        rooms.set(room.id, room);
        console.log(`[${room.id}] room created`);

        return room.status.onEnter(socket, playerName);
    }));

    socket.on("enter", withResponse((playerName, roomId) => {
        if (Player.connected(socket)) {
            return "An error occurred, please refresh the page.";
        }

        const room = rooms.get(roomId);
        if (!room) {
            return "This room doesn't exist.";
        }

        return room.status.onEnter(socket, playerName);
    }));

    socket.on("disconnect", withSession(socket, (room, player) => {
        room.status.onLeave(player);
        if (room.empty) {
            rooms.delete(room.id);
            console.log(`[${room.id}] room deleted`);

            // Maybe delete after a timeout ? in case a player reconnects
            // clearTimeout(id);
            // id = setTimeout(() => {
            //     if (room.empty) {
            //         rooms.delete(room.id);
            //     }
            // }, 5 * 60 * 1000); // 5 minutes
        }
    }));

    // Start the game
    socket.on("start", withSession(socket, room => room.status.onStart()));

    // Turn state
    socket.on("sell", withSession(socket, (room, player) => room.status.onSell(player)));
    socket.on("buy", withSession(socket, (room, player, ...args) => room.status.onBuy(player, ...args)));

    // Auction state
    socket.on("bid", withSession(socket, (room, player, ...args) => room.status.onBid(player, ...args)));
    socket.on("stop", withSession(socket, (room, player) => room.status.onStop(player)));

    // AuctionEnd state
    socket.on("deal", withSession(socket, (room, player) => room.status.onDeal(player)));
    socket.on("buyback", withSession(socket, (room, player) => room.status.onBuyback(player)));

    // Offer state
    socket.on("counter", withSession(socket, (room, player, ...args) => room.status.onCounter(player, ...args)));
});

// Start the http server
// Whatever the request, we'll respond with "index.html"
app.use(Express.static("./dist"));
app.use((req, res) => res.sendFile(path.resolve("./dist/index.html")));
server.listen(process.env.PORT || 8080);
