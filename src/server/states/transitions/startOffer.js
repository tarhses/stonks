import Offer from "../Offer.js";
import { START_OFFER } from "../../../common/signals.js";

export default function startOffer(status, targetId, animalId) {
    const { room, playerId } = status;

    const offer = new Offer(room, playerId, targetId, animalId);
    room.emit(START_OFFER, targetId, animalId, offer.count);

    return offer;
}
