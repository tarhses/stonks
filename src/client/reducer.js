import rules from "../common/rules.json";
import {
    ADD_PLAYER,
    AUCTION_END_STATE,
    AUCTION_STATE,
    CANCEL_OFFER,
    EARN_CAPITAL,
    END_AUCTION,
    END_GAME,
    END_STATE,
    JOIN_ROOM,
    MAKE_BID,
    MAKE_OFFER,
    OFFER_STATE,
    PAY_CAPITAL,
    REMOVE_PLAYER,
    RESTART_AUCTION,
    RESTART_OFFER,
    SELL_ANIMAL,
    SET_TIMER,
    START_AUCTION,
    START_OFFER,
    START_TURN,
    STOP_BID,
    TURN_STATE
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
                type: TURN_STATE,
                playerId: action.playerId
            };

        case START_AUCTION:
        case RESTART_AUCTION:
            return {
                type: AUCTION_STATE,
                playerId: state.playerId,
                bidderId: state.playerId,
                animalId: action.type === START_AUCTION ? action.animalId : state.animalId,
                amount: 0,
                bidding: selfId !== state.playerId,
                timeout: action.timeout
            };

        case SET_TIMER:
            return {
                ...state,
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
                type: AUCTION_END_STATE,
                playerId: state.playerId,
                bidderId: state.bidderId,
                animalId: state.animalId,
                amount: state.amount
            };

        case START_OFFER:
            return {
                type: OFFER_STATE,
                playerId: state.playerId,
                targetId: action.targetId,
                animalId: action.animalId,
                count: action.count,
                offer: null,
                twice: false
            };

        case CANCEL_OFFER:
            return {
                type: TURN_STATE,
                playerId: state.playerId
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
                type: END_STATE
            };

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
            roomId: state.roomId,
            selfId: action.type === REMOVE_PLAYER && state.selfId > action.playerId ? state.selfId - 1 : state.selfId
        };
    }
};
