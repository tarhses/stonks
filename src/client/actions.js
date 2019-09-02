import {
    ADD_PLAYER,
    EARN_CAPITAL,
    END_AUCTION,
    END_GAME,
    ENTER_ROOM,
    MAKE_BID,
    PAY_CAPITAL,
    REMOVE_PLAYER,
    RESTART_AUCTION,
    SELL_ANIMAL,
    START_AUCTION,
    START_OFFER,
    START_TURN
} from "../common/signals.js";

export function enterRoom(data) {
    return { type: ENTER_ROOM, data };
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

export function endAuction() {
    return { type: END_AUCTION };
}

export function startOffer(targetId, animalId, count, change) {
    return { type: START_OFFER, targetId, animalId, count, change };
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
