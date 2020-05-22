import React from "react";
import { useSocket } from "../hooks.js";
import Chat from "./Chat.js";
import RoomInformation from "./RoomInformation.js";
import { START_TURN } from "../../common/signals.js";

export default function Lobby({ players, roomId, selfId, messages }) {
    const socket = useSocket();

    const remaining = 3 - players.length;

    return (
        <div>
            <RoomInformation name={players[selfId].name} id={roomId} />
            <div className="row">
                <div className="card col">
                    {remaining > 0
                        ? <p>Waiting for {remaining} more player{remaining > 1 && "s"}.</p>
                        : <p>Ready to start!</p>
                    }

                    <ul>
                        {players.map((player, id) =>
                            <li key={id}><b>{player.name}</b> {id === selfId && <i>(you)</i>}</li>
                        )}
                    </ul>
                </div>
                <Chat messages={messages} />
            </div>

            <hr/>
            <button
                className="btn primary w-100"
                onClick={() => socket.emit(START_TURN)}
                disabled={selfId !== 0 || remaining > 0}
            >
                Start
            </button>
        </div>
    );
}
