import { useEffect, useReducer, useState } from "preact/hooks"
import { useSocket } from "./hooks.js"
import reducer from "./reducer.js"
import announcement from "./announcement.js"
import Login from "./components/Login.jsx"
import Lobby from "./components/Lobby.jsx"
import Game from "./components/Game.jsx"
import {
	ADD_PLAYER,
	CANCEL_OFFER,
	EARN_CAPITAL,
	END_AUCTION,
	END_GAME,
	JOIN_ROOM,
	MAKE_BID,
	MAKE_OFFER,
	NONEXISTENT_ERROR,
	PAY_CAPITAL,
	RECREATE_ROOM,
	REMOVE_PLAYER,
	RESTART_AUCTION,
	RESTART_OFFER,
	SELL_ANIMAL,
	SEND_MESSAGE,
	SET_TIMER,
	START_AUCTION,
	START_OFFER,
	START_TURN,
} from "../common/signals.js"
import {
	addPlayer,
	cancelOffer,
	earnCapital,
	endAuction,
	endGame,
	joinRoom,
	makeBid,
	makeOffer,
	payCapital,
	recreateRoom,
	removePlayer,
	restartAuction,
	restartOffer,
	sellAnimal,
	setTimer,
	startAuction,
	startOffer,
	startTurn,
} from "./actions.js"

export default function App() {
	const socket = useSocket()
	const [state, dispatch] = useReducer(reducer, null)
	const [messages, setMessages] = useState([])

	function on(action) {
		return (...args) => {
			const payload = action(...args)
			console.log(payload)

			const message = announcement(state, payload)
			if (message) {
				setMessages([message, ...messages])
			}

			dispatch(payload)
		}
	}

	useEffect(() => {
		if (state) {
			socket.on(ADD_PLAYER, on(addPlayer))
			socket.on(REMOVE_PLAYER, on(removePlayer))
			socket.on(START_TURN, on(startTurn))
			socket.on(START_AUCTION, on(startAuction))
			socket.on(RESTART_AUCTION, on(restartAuction))
			socket.on(SET_TIMER, on(setTimer))
			socket.on(MAKE_BID, on(makeBid))
			socket.on(END_AUCTION, on(endAuction))
			socket.on(START_OFFER, on(startOffer))
			socket.on(CANCEL_OFFER, on(cancelOffer))
			socket.on(RESTART_OFFER, on(restartOffer))
			socket.on(MAKE_OFFER, on(makeOffer))
			socket.on(SELL_ANIMAL, on(sellAnimal))
			socket.on(EARN_CAPITAL, on(earnCapital))
			socket.on(PAY_CAPITAL, on(payCapital))
			socket.on(END_GAME, on(endGame))
			socket.on(RECREATE_ROOM, on(recreateRoom))
			socket.on(SEND_MESSAGE, (playerId, text) =>
				setMessages([`${state.players[playerId].name}: ${text}`, ...messages]),
			)

			socket.on("disconnect", () => {
				setMessages(["Disconnected from the room.", ...messages])
			})

			socket.io.on("reconnect", () => {
				setMessages(["Attempting to reconnect...", ...messages])
				socket.emit(
					JOIN_ROOM,
					state.players[state.selfId].name,
					state.roomId,
					(data) => {
						if (typeof data === "object") {
							dispatch(joinRoom(data))
						} else if (data === NONEXISTENT_ERROR) {
							socket.emit(RECREATE_ROOM, state)
						}
					},
				)
			})

			return () => socket.off()
		}
	})

	useEffect(() => {
		if (state) {
			history.pushState("", "", `/${state.roomId}`)
		}
	}, [state])

	let content
	if (!state) {
		content = <Login onLogin={on(joinRoom)} />
	} else if (!state.status) {
		content = (
			<Lobby
				players={state.players}
				roomId={state.roomId}
				selfId={state.selfId}
				messages={messages}
			/>
		)
	} else {
		content = <Game state={state} messages={messages} dispatch={dispatch} />
	}

	return (
		<div class="c">
			<h1>Stonks</h1>
			{content}
		</div>
	)
}
