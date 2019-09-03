import Room from "./Room.js";

export default class RecoveryRoom {
    players;
    animals;
    status;
    playerCount = 0;

    constructor(socket, state) {
        const { players, animals, status } = state;
        this.players = players;
        this.animals = animals;
        this.status = status;

        if (status && status.type === "auction") {
            status.bidders = [];
        }

        this.connect(socket, state);
    }

    connect(socket, { capital, status, selfId }) {
        const player = this.players[selfId];
        player.socket = socket;
        player.capital = capital;

        if (status) {
            if (status.type === "auction") {
                if (status.bidding) {
                    this.status.bidders.push(selfId);
                }
            } else if (status.type === "offer") {
                if (status.playerId === selfId) {
                    this.status.offer = status.offer;
                }
            }
        }

        this.playerCount++;
        return this.playerCount === this.players.length;
    }

    recreate(io) {
        return Room.deserialize(io, this);
    }
}
