import { h } from 'preact'
import Turn from './Turn.js'
import Auction from './Auction.js'
import AuctionEnd from './AuctionEnd.js'
import Offer from './Offer.js'
import End from './End.js'
import Capital from './Capital.js'
import PlayerTable from './PlayerTable.js'
import Chat from './Chat.js'
import RoomInformation from './RoomInformation.js'
import { AUCTION_END_STATE, AUCTION_STATE, END_STATE, OFFER_STATE, TURN_STATE } from '../../common/signals.json'

export default function Game ({ state, messages, dispatch }) {
  let content
  switch (state.status.type) {
    case TURN_STATE: content = <Turn {...state} />; break
    case AUCTION_STATE: content = <Auction {...state} dispatch={dispatch} />; break
    case AUCTION_END_STATE: content = <AuctionEnd {...state} />; break
    case OFFER_STATE: content = <Offer {...state} />; break
    case END_STATE: content = <End {...state} />; break
  }

  return (
    <div>
      {content}
      <div className="row">
        <div className="card col">
          <Capital capital={state.capital} />
        </div>
      </div>
      <div className="row">
        <PlayerTable players={state.players} status={state.status} />
        <Chat messages={messages} />
      </div>
      <RoomInformation name={state.players[state.selfId].name} id={state.roomId} />
    </div>
  )
}
