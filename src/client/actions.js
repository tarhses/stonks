import {
    ADD_PLAYER,
    CANCEL_OFFER,
    EARN_CAPITAL,
    END_AUCTION,
    END_GAME,
    JOIN_ROOM,
    MAKE_BID,
    MAKE_OFFER,
    PAY_CAPITAL,
    RECREATE_ROOM,
    REMOVE_PLAYER,
    RESTART_AUCTION,
    RESTART_OFFER,
    SELL_ANIMAL,
    START_AUCTION,
    START_OFFER,
    START_TURN,
    STOP_BID
} from "../common/signals.js";

export function joinRoom(data) {
    return { type: JOIN_ROOM, data };
}

export function recreateRoom() {
    return { type: RECREATE_ROOM };
}

export function addPlayer(playerName) {
    return { type: ADD_PLAYER, playerName };
}

export function removePlayer(playerId) {
    return { type: REMOVE_PLAYER, playerId };
}

export function startTurn(playerId) {
    return { type: START_TURN, playerId };
}

export function startAuction(animalId, timeout) {
    return { type: START_AUCTION, animalId, timeout };
}

export function restartAuction(capital, timeout) {
    return { type: RESTART_AUCTION, capital, timeout };
}

export function makeBid(bidderId, amount, timeout) {
    return { type: MAKE_BID, bidderId, amount, timeout };
}

export function stopBid() {
    return { type: STOP_BID };
}

export function endAuction() {
    return { type: END_AUCTION };
}

export function startOffer(targetId, animalId, count) {
    return { type: START_OFFER, targetId, animalId, count };
}

export function cancelOffer() {
    return { type: CANCEL_OFFER };
}

export function restartOffer() {
    return { type: RESTART_OFFER };
}

export function makeOffer(offer) {
    return { type: MAKE_OFFER, offer };
}

export function sellAnimal(sellerId, buyerId, animalId, count, change) {
    return { type: SELL_ANIMAL, sellerId, buyerId, animalId, count, change };
}

export function earnCapital(capital) {
    return { type: EARN_CAPITAL, capital };
}

export function payCapital(capital) {
    return { type: PAY_CAPITAL, capital };
}

export function endGame() {
    return { type: END_GAME };
}
