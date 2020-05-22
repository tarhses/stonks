import Room from "./Room.js";
import { AUCTION_STATE, OFFER_STATE, RECREATE_ROOM, SET_TIMER } from "../common/signals.js";

export default class RecoveryRoom {
    roomId;
    players;
    animals;
    status;
    playerCount = 0;

    constructor(socket, state) {
        const { roomId, players, animals, status } = state;
        this.roomId = roomId;
        this.players = players;
        this.animals = animals;
        this.status = status;

        if (status && status.type === AUCTION_STATE) {
            status.bidders = [];
        }

        this.connect(socket, state);
    }

    connect(socket, { capital, status, selfId }) {
        const player = this.players[selfId];
        player.socket = socket;
        player.capital = capital;

        if (status) {
            if (status.type === AUCTION_STATE) {
                if (status.bidding) {
                    this.status.bidders.push(selfId);
                }
            } else if (status.type === OFFER_STATE) {
                if (status.playerId === selfId) {
                    this.status.offer = status.offer;
                }
            }
        }

        this.playerCount++;
    }

    get complete() {
        return this.playerCount === this.players.length;
    }

    recreate(io) {
        const room = Room.deserialize(io, this);

        room.emit(RECREATE_ROOM);
        if (this.status.type === AUCTION_STATE) {
            room.emit(SET_TIMER, room.status.timeout);
        }

        return room;
    }
}
