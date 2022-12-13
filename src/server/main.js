import path from "path"
import http from "http"
import Express from "express"
import { Server } from "socket.io"
import Player from "./Player.js"
import Room from "./Room.js"
import RecoveryRoom from "./RecoveryRoom.js"
import { withResponse, withSession } from "./decorators.js"
import {
	CANCEL_OFFER,
	CREATE_ROOM,
	JOIN_ROOM,
	MAKE_BID,
	MAKE_COUNTEROFFER,
	MAKE_OFFER,
	NONEXISTENT_ERROR,
	RECREATE_ROOM,
	SELL_ANIMAL,
	SEND_MESSAGE,
	START_AUCTION,
	START_OFFER,
	START_TURN,
	STOP_BID,
	UNKNOWN_ERROR,
} from "../common/signals.js"

const app = new Express()
const server = http.createServer(app)
const io = new Server(server, { serveClient: false })

const rooms = new Map()
const recoveries = new Map()

io.on("connect", (socket) => {
	// Connection and disconnection
	socket.on(
		CREATE_ROOM,
		withResponse((playerName) => {
			if (Player.connected(socket)) {
				return UNKNOWN_ERROR
			}

			const room = new Room(io)
			rooms.set(room.id, room)
			console.log(`[${room.id}] room created`)

			return room.enter(socket, playerName)
		}),
	)

	socket.on(
		JOIN_ROOM,
		withResponse((playerName, roomId) => {
			if (Player.connected(socket)) {
				return UNKNOWN_ERROR
			}

			const room = rooms.get(roomId)
			if (!room) {
				return NONEXISTENT_ERROR
			}

			return room.enter(socket, playerName)
		}),
	)

	socket.on(
		"disconnect",
		withSession(socket, (room, player) => {
			room.leave(player, () => {
				rooms.delete(room.id)
				console.log(`[${room.id}] room deleted`)
			})
		}),
	)

	socket.on(RECREATE_ROOM, (state) => {
		const id = state.roomId
		let recovery = recoveries.get(id)
		if (recovery) {
			recovery.connect(socket, state)
		} else {
			recovery = new RecoveryRoom(socket, state)
			recoveries.set(id, recovery)
			setTimeout(() => recoveries.delete(id), 60000)
		}

		if (recovery.complete) {
			const room = recovery.recreate(io)
			rooms.set(id, room)
			recoveries.delete(id)
		}
	})

	socket.on(
		START_TURN,
		withSession(socket, (room, player) => room.status.onStart(player)),
	)
	socket.on(
		START_AUCTION,
		withSession(socket, (room, player) => room.status.onSell(player)),
	)
	socket.on(
		MAKE_BID,
		withSession(socket, (room, player, ...args) =>
			room.status.onBid(player, ...args),
		),
	)
	socket.on(
		STOP_BID,
		withSession(socket, (room, player) => room.status.onStop(player)),
	)
	socket.on(
		SELL_ANIMAL,
		withSession(socket, (room, player, ...args) =>
			room.status.onDeal(player, ...args),
		),
	)
	socket.on(
		START_OFFER,
		withSession(socket, (room, player, ...args) =>
			room.status.onBuy(player, ...args),
		),
	)
	socket.on(
		CANCEL_OFFER,
		withSession(socket, (room, player) => room.status.onCancel(player)),
	)
	socket.on(
		MAKE_OFFER,
		withSession(socket, (room, player, ...args) =>
			room.status.onOffer(player, ...args),
		),
	)
	socket.on(
		MAKE_COUNTEROFFER,
		withSession(socket, (room, player, ...args) =>
			room.status.onCounter(player, ...args),
		),
	)
	socket.on(
		SEND_MESSAGE,
		withSession(socket, (room, player, text) =>
			room.emit(SEND_MESSAGE, player.id, text),
		),
	)
})

// Start the http server
// Whatever the request, we'll respond with "index.html"
app.use(Express.static("./dist"))
app.use((req, res) => res.sendFile(path.resolve("./dist/index.html")))
server.listen(process.env.PORT || 8000)
