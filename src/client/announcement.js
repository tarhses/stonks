import animals from "../common/animals.json";
import { EARN_CAPITAL, PAY_CAPITAL, RESTART_AUCTION, SELL_ANIMAL } from "../common/signals.js";

export default function announcement(state, action) {
    switch (action.type) {
        case RESTART_AUCTION: {
            const bidder = state.players[state.status.bidderId].name;
            return `${bidder} can't afford ${state.status.amount}$, his capital is: ${action.capital.join("$, ")}$.`;
        }

        case SELL_ANIMAL: {
            const seller = state.players[action.sellerId].name;
            const buyer = state.players[action.buyerId].name;
            const animal = animals[action.animalId];
            if (action.count > 0) {
                return `${buyer} bought ${action.count} ${action.count === 1 ? animal.name : animal.namePlural} from ${seller}.`;
            } else if (action.sellerId === action.buyerId) {
                return `${seller} earned a ${animal.name}.`;
            } else if (state.status.playerId === action.sellerId) {
                return `${seller} sold a ${animal.name} to ${buyer} for ${state.status.amount}$.`;
            } else {
                return `${buyer} bought a ${animal.name} back from ${seller} for ${state.status.amount}$.`;
            }
        }

        case EARN_CAPITAL:
        case PAY_CAPITAL: {
            const sum = action.capital.reduce((a, b) => a + b, 0);
            return `You ${action.type === "EARN_CAPITAL" ? "earned" : "paid"} ${sum}$`;
        }
    }
}
