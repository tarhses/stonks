import rules from "../common/rules.json";
import animals from "../common/animals.json";
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

function players(state, action) {
    switch (action.type) {
        case ADD_PLAYER:
            return [
                ...state,
                {
                    name: action.playerName,
                    animals: animals.map(() => 0),
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

function status(state, action) {
    switch (action.type) {
        case START_TURN:
            return {
                type: "turn",
                playerId: action.playerId,
                animalsLeft: action.animalsLeft
            };

        case START_AUCTION:
            return {
                type: "auction",
                playerId: state.playerId,
                bidderId: state.playerId,
                animalId: action.animalId,
                amount: 0,
                timeout: action.timeout
            };

        case RESTART_AUCTION:
            return {
                type: "auction",
                playerId: state.playerId,
                bidderId: state.playerId,
                animalId: state.animalId,
                amount: 0,
                timeout: action.timeout
            };

        case MAKE_BID:
            return {
                ...state,
                bidderId: action.bidderId,
                amount: action.amount,
                timeout: action.timeout
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
                change: action.change
            };

        case END_GAME:
            return {
                type: "end"
            };

        default:
            return state;
    }
}

export default (state, action) => {
    switch (action.type) {
        case ENTER_ROOM:
            return action.data;

        case REMOVE_PLAYER:
            return {
                ...state,
                players: players(state.players, action),
                selfId: state.selfId < action.playerId
                    ? state.selfId
                    : state.selfId - 1
            };

        default:
            return {
                ...state,
                players: players(state.players, action),
                capital: capital(state.capital, action),
                status: status(state.status, action)
            };
    }
};
