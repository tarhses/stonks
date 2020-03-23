const State = require('../State.js')
const { nextTurn, restartAuction } = require('./transitions')
const { AUCTION_END_STATE, SELL_ANIMAL } = require('../../common/signals')

module.exports = class AuctionEnd extends State {
  playerId
  bidderId
  animalId
  amount

  constructor (room, playerId, bidderId, animalId, amount) {
    super(room)
    this.playerId = playerId
    this.bidderId = bidderId
    this.animalId = animalId
    this.amount = amount
  }

  sell (seller, buyer) {
    const payment = buyer.findMinimalPayment(this.amount)
    if (payment) {
      buyer.animals[this.animalId]++
      this.room.emit(SELL_ANIMAL, seller.id, buyer.id, this.animalId, 0, payment.length)

      buyer.pay(payment)
      seller.earn(payment)

      nextTurn(this)
    } else {
      // Not enough money, restart the auction
      restartAuction(this)
    }
  }

  onDeal (player, buyback) {
    if (player.id === this.playerId) {
      const bidder = this.room.players[this.bidderId]
      if (buyback) {
        this.sell(bidder, player)
      } else {
        this.sell(player, bidder)
      }
    }
  }

  serialize () {
    return {
      type: AUCTION_END_STATE,
      playerId: this.playerId,
      bidderId: this.bidderId,
      animalId: this.animalId,
      amount: this.amount
    }
  }

  static deserialize (room, { playerId, bidderId, animalId, amount }) {
    return new AuctionEnd(room, playerId, bidderId, animalId, amount)
  }
}
