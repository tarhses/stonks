import rules from "../common/rules.json";
import animalTypes from "../common/animals.json";
import { EARN_CAPITAL, PAY_CAPITAL } from "../common/signals.js";

const SessionSymbol = Symbol("session");

export default class Player {
    room;
    id;
    name;
    animals = animalTypes.map(() => 0);
    capital = [...rules.initialCapital];
    socket = null;

    constructor(room, id, name) {
        this.room = room;
        this.id = id;
        this.name = name;
    }

    earn(capital) {
        if (capital.length > 0) {
            let i = 0;
            for (const value of capital) {
                while (this.capital[i] >= value) {
                    i++;
                }

                this.capital.splice(i, 0, value);
            }

            this.emit(EARN_CAPITAL, capital);
        }
    }

    pay(capital) {
        if (capital.length > 0) {
            let i = 0;
            for (const value of capital) {
                while (this.capital[i] > value) {
                    i++;
                }

                this.capital.splice(i, 1);
            }

            this.emit(PAY_CAPITAL, capital);
        }
    }

    has(capital) {
        let i = 0;
        for (const value of capital) {
            while (this.capital[i] !== value) {
                i++;
                if (i > this.capital.length) {
                    return false;
                }
            }

            i++;
        }

        return true;
    }

    findMinimalPayment(amount) {
        const list = [];
        let sum = 0;
        let min = null;

        let i = 0;
        while (this.capital[i]) { // while not 0 or undefined
            const value = this.capital[i];

            list.push(value);
            sum += value;

            if (sum === amount) {
                return list;
            } else if (sum < amount) {
                i++;
            } else { // sum > amount
                min = [...list]; // save a copy of the list as the minimal way to pay
                sum -= list.pop(); // pop the current value from the list
                do { // find the next smaller value
                    i++;
                } while (this.capital[i] >= value);
            }
        }

        return min;
    }

    connect(socket) {
        this.socket = socket;
        socket.join(this.room.id);
        socket[SessionSymbol] = this; // bind the socket
    }

    disconnect() {
        this.socket = null;
    }

    get connected() {
        return this.socket !== null;
    }

    static connected(socket) {
        return socket[SessionSymbol];
    }

    emit(...args) {
        if (this.socket) {
            console.log(`[${this.name}@${this.room.id}] ${JSON.stringify(args).slice(1, -1)}`);
            this.socket.emit(...args);
        }
    }

    broadcast(...args) {
        if (this.socket) {
            console.log(`[${this.room.id}] ${JSON.stringify(args).slice(1, -1)}`);
            this.socket.broadcast.emit(...args);
        }
    }

    serialize() {
        return {
            name: this.name,
            animals: this.animals,
            change: this.capital.length
        };
    }

    static deserialize(room, id, { name, animals, capital, socket }) {
        const player = new Player(room, id, name);
        player.animals = animals;
        player.capital = capital;

        if (socket) {
            player.connect(socket);
        }

        return player;
    }
}
