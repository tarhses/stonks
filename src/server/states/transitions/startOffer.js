import Offer from "../Offer.js";
import { START_OFFER } from "../../../common/signals.js";

export default function startOffer(status, targetId, animalId) {
    const { room } = status;

    const offer = new Offer(room, targetId, animalId);
    room.emit(START_OFFER, targetId, animalId, offer.count);

    return offer;
}
