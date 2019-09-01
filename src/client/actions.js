export const login = data =>
    ({ type: "LOGIN", data });

export const addPlayer = playerName =>
    ({ type: "ADD_PLAYER", playerName });

export const removePlayer = playerId =>
    ({ type: "REMOVE_PLAYER", playerId });

export const startTurn = (playerId, animalsLeft) =>
    ({ type: "START_TURN", playerId, animalsLeft });

export const startAuction = (animalId, timeout) =>
    ({ type: "START_AUCTION", animalId, timeout });

export const restartAuction = (capital, timeout) =>
    ({ type: "RESTART_AUCTION", capital, timeout });

export const auctionBid = (bidderId, amount, timeout) =>
    ({ type: "AUCTION_BID", bidderId, amount, timeout });

export const auctionEnd = () =>
    ({ type: "AUCTION_END" });

export const startOffer = (targetId, animalId, count, change) =>
    ({ type: "START_OFFER", targetId, animalId, count, change });

export const sellAnimal = (sellerId, buyerId, animalId, count, change) =>
    ({ type: "SELL_ANIMAL", sellerId, buyerId, animalId, count, change });

export const earnCapital = capital =>
    ({ type: "EARN_CAPITAL", capital });

export const loseCapital = capital =>
    ({ type: "LOSE_CAPITAL", capital });

export const endGame = () =>
    ({ type: "END_GAME" });
