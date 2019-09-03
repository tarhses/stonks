import crypto from "crypto";
import Player from "./Player.js";
import Lobby from "./states/Lobby.js";
import rules from "../common/rules.json";
import animals from "../common/animals.json";
import {
    MAKE_BID,
    MAKE_COUNTEROFFER,
    MAKE_OFFER,
    SELL_ANIMAL,
    START_AUCTION,
    START_OFFER,
    START_TURN,
    STOP_BID
} from "../common/signals.js";

function generateId() {
    // Use 18 bytes (multiple of 3) to avoid base64 padding, also use a url-friendly variant
    // We could make this function async but we don't really care about performances right now
    return crypto.randomBytes(18).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
}

export default class Room {
    id;
    players = [];
    animals = animals.map(() => rules.animalCount);
    status;
    io;

    constructor(io) {
        this.id = generateId();
        this.status = new Lobby(this);
        this.io = io;
    }

    get playerCount() {
        return this.players.length;
    }

    get animalCount() {
        return this.animals.reduce((a, b) => a + b, 0);
    }

    addPlayer(name) {
        const player = new Player(this, this.playerCount, name);
        this.players.push(player);
        return player;
    }

    findPlayer(name) {
        const lowerCaseName = name.toLowerCase();
        return this.players.find(p => p.name.toLowerCase() === lowerCaseName);
    }

    removePlayer(id) {
        this.players.splice(id, 1);
        for (; id < this.playerCount; id++) {
            this.players[id].id--;
        }
    }

    pickPlayer() {
        return Math.floor(Math.random() * this.playerCount);
    }

    pickAnimal() {
        let choice = Math.floor(Math.random() * this.animalCount);

        let id = -1;
        while (choice >= 0) {
            choice -= this.animals[++id];
        }

        if (id === rules.incomeAnimalId) {
            // To know how many times players got income, we count how many income animals are left
            const incomeCount = rules.animalCount - this.animals[rules.incomeAnimalId];
            const income = rules.income[incomeCount];
            for (const player of this.players) {
                player.earn([income]);
            }
        }

        this.animals[id]--;
        return id;
    }

    get empty() {
        for (const player of this.players) {
            if (player.connected) {
                return false;
            }
        }

        return true;
    }

    join(socket, playerName) {
        return this.status.onEnter(socket, playerName);
    }

    leave(player) {
        this.status.onLeave(player);
    }

    do(signal, args) {
        let action;
        switch (signal) {
            case START_TURN: action = this.status.onStart; break;
            case START_AUCTION: action = this.status.onSell; break;
            case START_OFFER: action = this.status.onBuy; break;
            case MAKE_BID: action = this.status.onBid; break;
            case STOP_BID: action = this.status.onStop; break;
            case SELL_ANIMAL: action = this.status.onDeal; break;
            case MAKE_OFFER: action = this.status.onOffer; break;
            case MAKE_COUNTEROFFER: action = this.status.onCounter; break;
            default: return;
        }

        action.apply(this.status, args);
    }

    emit(...args) {
        console.log(`[${this.id}] ${JSON.stringify(args).slice(1, -1)}`);
        this.io.to(this.id).emit(...args);
    }

    serialize(selfId) {
        return {
            players: this.players.map(p => p.serialize()),
            capital: this.players[selfId].capital,
            animals: this.animals,
            status: this.status.serialize(selfId),
            roomId: this.id,
            selfId
        };
    }
}
