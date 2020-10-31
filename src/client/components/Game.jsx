import { h } from "preact";
import Turn from "./Turn.jsx";
import Auction from "./Auction.jsx";
import AuctionEnd from "./AuctionEnd.jsx";
import Offer from "./Offer.jsx";
import End from "./End.jsx";
import Capital from "./Capital.jsx";
import PlayerTable from "./PlayerTable.jsx";
import Chat from "./Chat.jsx";
import RoomInformation from "./RoomInformation.jsx";
import { AUCTION_END_STATE, AUCTION_STATE, END_STATE, OFFER_STATE, TURN_STATE } from "../../common/signals.js";

export default function Game({ state, messages, dispatch }) {
    let content;
    switch (state.status.type) {
        case TURN_STATE:        content = <Turn {...state} />; break;
        case AUCTION_STATE:     content = <Auction {...state} dispatch={dispatch} />; break;
        case AUCTION_END_STATE: content = <AuctionEnd {...state} />; break;
        case OFFER_STATE:       content = <Offer {...state} />; break;
        case END_STATE:         content = <End {...state} />; break;
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
    );
}
