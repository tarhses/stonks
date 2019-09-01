import crypto from "crypto";
import Player from "./Player.js";
import Lobby from "./states/Lobby.js";
import rules from "../rules.json";
import animals from "../animals.json";

const generateId = () =>
    // Use 18 bytes (multiple of 3) to avoid base64 padding, also use a url-friendly variant
    // We could make this function async but we don't really care about performances right now
    crypto.randomBytes(18).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

export default class Room {
    id;
    players = [];
    animals = animals.map(() => rules.animalCount);
    status;
    incomeCount = 0;
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

        if (animals[id].giveIncome) {
            const income = rules.income[this.incomeCount++];
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

    emit(...args) {
        console.log(`[${this.id}] ${JSON.stringify(args).slice(1, -1)}`);
        this.io.to(this.id).emit(...args);
    }

    serialize(selfId) {
        return {
            players: this.players.map(p => p.serialize()),
            capital: this.players[selfId].capital,
            status: this.status.serialize(),
            roomId: this.id,
            selfId
        };
    }
}
