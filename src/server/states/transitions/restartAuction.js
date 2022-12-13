import Auction from "../Auction.js"
import { RESTART_AUCTION } from "../../../common/signals.js"

export default function restartAuction(status) {
	const { room, playerId, bidderId, animalId } = status
	const capital = room.players[bidderId].capital

	const auction = new Auction(room, playerId, animalId)
	room.emit(RESTART_AUCTION, capital, auction.timeout)

	return auction
}
