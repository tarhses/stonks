import React from "react";
import Turn from "./Turn.js";
import Auction from "./Auction.js";
import AuctionEnd from "./AuctionEnd.js";
import Offer from "./Offer.js";
import End from "./End.js";
import Capital from "./Capital.js";
import PlayerTable from "./PlayerTable.js";
import Chat from "./Chat.js";
import RoomInformation from "./RoomInformation.js";

export default function Game({ state, messages, dispatch }) {
    let content;
    switch (state.status.type) {
        case "turn":       content = <Turn {...state} />;       break;
        case "auction":    content = <Auction {...state} dispatch={dispatch} />;    break;
        case "auctionEnd": content = <AuctionEnd {...state} />; break;
        case "offer":      content = <Offer {...state} />;      break;
        case "end":        content = <End {...state} />;        break;
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
                <div className="card col">
                    <PlayerTable players={state.players} />
                </div>
                <div className="card col 5">
                    <Chat messages={messages} />
                </div>
            </div>
            <RoomInformation name={state.players[state.selfId].name} id={state.roomId} />
        </div>
    );
}
