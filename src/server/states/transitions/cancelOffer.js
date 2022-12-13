import Turn from "../Turn.js"
import { CANCEL_OFFER } from "../../../common/signals.js"

export default function cancelOffer(status) {
	const { room, playerId } = status

	room.emit(CANCEL_OFFER)
	return new Turn(room, playerId)
}
