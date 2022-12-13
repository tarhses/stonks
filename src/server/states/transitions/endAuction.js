import AuctionEnd from "../AuctionEnd.js"
import { END_AUCTION } from "../../../common/signals.js"

export default function endAuction(status) {
	const { room, playerId, bidderId, animalId, amount } = status

	room.emit(END_AUCTION)
	return new AuctionEnd(room, playerId, bidderId, animalId, amount)
}
