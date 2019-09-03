import rules from "../common/rules.json";
import {
    ADD_PLAYER,
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

function players(state, action) {
    switch (action.type) {
        case ADD_PLAYER:
            return [
                ...state,
                {
                    name: action.playerName,
                    animals: rules.animals.map(() => 0),
                    change: rules.initialCapital.length
                }
            ];

        case REMOVE_PLAYER:
            return state.filter((player, id) => id !== action.playerId);

        case START_AUCTION:
            return action.animalId === rules.incomeAnimalId
                ? state.map(player => ({ ...player, change: player.change + 1 }))
                : state;

        case SELL_ANIMAL: {
            return state.map((player, playerId) => {
                if (playerId === action.sellerId || playerId === action.buyerId) {
                    const factor = playerId === action.buyerId ? 1 : -1;
                    const count = action.count === 0 && playerId === action.buyerId ? 1 : action.count;
                    return {
                        ...player,
                        change: player.change - factor * action.change,
                        animals: player.animals.map((animalCount, animalId) =>
                            animalId === action.animalId
                                ? animalCount + factor * count
                                : animalCount)
                    };
                }

                return player;
            });
        }

        default:
            return state;
    }
}

function capital(state, action) {
    switch (action.type) {
        case EARN_CAPITAL:
            return [...state, ...action.capital].sort((a, b) => b - a);

        case PAY_CAPITAL:
            return action.capital.reduce((acc, value) => {
                acc.splice(acc.findIndex(item => item === value), 1);
                return acc;
            }, [...state]);

        default:
            return state;
    }
}

function animals(state, action) {
    switch (action.type) {
        case START_AUCTION:
            return state.map((count, id) => id === action.animalId ? count - 1 : count);

        default:
            return state;
    }
}

function status(state, action, selfId) {
    switch (action.type) {
        case START_TURN:
            return {
                type: "turn",
                playerId: action.playerId
            };

        case START_AUCTION:
        case RESTART_AUCTION:
            return {
                type: "auction",
                playerId: state.playerId,
                bidderId: state.playerId,
                animalId: action.type === START_AUCTION ? action.animalId : state.animalId,
                amount: 0,
                bidding: selfId !== state.playerId,
                timeout: action.timeout
            };

        case MAKE_BID:
            return {
                ...state,
                bidderId: action.bidderId,
                amount: action.amount,
                bidding: selfId === action.bidderId ? true : state.bidding,
                timeout: action.timeout
            };

        case STOP_BID:
            return {
                ...state,
                bidding: false
            };

        case END_AUCTION:
            return {
                type: "auctionEnd",
                playerId: state.playerId,
                bidderId: state.bidderId,
                animalId: state.animalId,
                amount: state.amount
            };

        case START_OFFER:
            return {
                type: "offer",
                playerId: state.playerId,
                targetId: action.targetId,
                animalId: action.animalId,
                count: action.count,
                offer: null,
                twice: false
            };

        case RESTART_OFFER:
            return {
                ...state,
                offer: null,
                twice: true
            };

        case MAKE_OFFER:
            return {
                ...state,
                offer: action.offer
            };

        case END_GAME:
            return {
                type: "end"
            };

        default:
            return state;
    }
}

function roomId(state, action) {
    switch (action.type) {
        case RECREATE_ROOM:
            return action.roomId;

        default:
            return state;
    }
}

function selfId(state, action) {
    switch (action.type) {
        case REMOVE_PLAYER:
            return state > action.playerId ? state - 1 : state;

        default:
            return state;
    }
}

export default (state, action) => {
    if (action.type === JOIN_ROOM) {
        return action.data;
    } else {
        return {
            players: players(state.players, action),
            capital: capital(state.capital, action),
            animals: animals(state.animals, action),
            status: status(state.status, action, state.selfId), // TODO: passing selfId here is kind of a hack :p
            roomId: roomId(state.roomId, action),
            selfId: selfId(state.selfId, action)
        };
    }
};
