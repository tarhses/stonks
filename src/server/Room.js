const crypto = require('crypto')
const Player = require('./Player')
const { Lobby, Turn, Auction, AuctionEnd, Offer, End } = require('./states')
const rules = require('../common/rules.json')
const { AUCTION_END_STATE, AUCTION_STATE, END_STATE, OFFER_STATE, TURN_STATE } = require('../common/signals')

const STATES = {
  [TURN_STATE]: Turn,
  [AUCTION_STATE]: Auction,
  [AUCTION_END_STATE]: AuctionEnd,
  [OFFER_STATE]: Offer,
  [END_STATE]: End
}

function generateId () {
  // Use 18 bytes (multiple of 3) to avoid base64 padding, also use a url-friendly variant
  // We could make this function async but we don't really care about performances right now
  return crypto.randomBytes(18).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')
}

function deserializeStatus (room, data) {
  const state = data == null
    ? Lobby
    : STATES[data.type]

  return state.deserialize(room, data)
}

module.exports = class Room {
  id
  players = []
  animals = rules.animals.map(() => rules.animalCount)
  state
  io
  #timeoutId

  constructor (io, id) {
    this.id = id || generateId()
    this.state = new Lobby(this)
    this.io = io
  }

  get playerCount () {
    return this.players.length
  }

  get animalCount () {
    return this.animals.reduce((a, b) => a + b, 0)
  }

  addPlayer (name) {
    const player = new Player(this, this.playerCount, name)
    this.players.push(player)
    return player
  }

  findPlayer (name) {
    const lowerCaseName = name.toLowerCase()
    return this.players.find(p => p.name.toLowerCase() === lowerCaseName)
  }

  removePlayer (id) {
    this.players.splice(id, 1)
    for (; id < this.playerCount; id++) {
      this.players[id].id--
    }
  }

  enter (socket, playerName) {
    clearTimeout(this.#timeoutId)
    return this.state.onEnter(socket, playerName)
  }

  leave (player, callback) {
    this.state.onLeave(player)
    if (this.players.every(p => !p.connected)) {
      // Every player disconnected, wait 5 minutes in case of reconnection
      this.#timeoutId = setTimeout(callback, 5 * 60 * 1000)
    }
  }

  pickAnimal () {
    let choice = Math.floor(Math.random() * this.animalCount)

    let id = -1
    while (choice >= 0) {
      choice -= this.animals[++id]
    }

    if (id === rules.incomeAnimalId) {
      // To know how many times players got income, we count how many income animals are left
      const incomeCount = rules.animalCount - this.animals[rules.incomeAnimalId]
      const income = rules.income[incomeCount]
      for (const player of this.players) {
        player.earn([income])
      }
    }

    this.animals[id]--
    return id
  }

  setState (type, ...args) {
    const StateType = STATES[type]
    this.state = new StateType(this, ...args)
  }

  emit (...args) {
    console.log(`[${this.id}] ${JSON.stringify(args).slice(1, -1)}`)
    this.io.to(this.id).emit(...args)
  }

  serialize (selfId) {
    return {
      players: this.players.map(p => p.serialize()),
      capital: this.players[selfId].capital,
      animals: this.animals,
      state: this.state.serialize(selfId),
      roomId: this.id,
      selfId
    }
  }

  static deserialize (io, { players, animals, status, roomId }) {
    const room = new Room(io, roomId)
    room.players = players.map((player, id) => Player.deserialize(room, id, player))
    room.animals = animals
    room.state = deserializeStatus(room, status)

    return room
  }
}
