import Auction from "../Auction.js"
import { START_AUCTION } from "../../../common/signals.js"

export default function startAuction(status) {
	const { room, playerId } = status
	const animalId = room.pickAnimal()

	const auction = new Auction(room, playerId, animalId)
	room.emit(START_AUCTION, animalId, auction.timeout)

	return auction
}
