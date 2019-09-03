import React, { useState } from "react";
import { useSocket } from "../hooks.js";
import { CREATE_ROOM, FULL_ERROR, JOIN_ROOM, NAME_ERROR, NONEXISTENT_ERROR } from "../../common/signals.js";

function getRoomIdFromUrl() {
    const id = location.pathname.replace("/", ""); // remove the leading slash
    if (id) {
        // Replace the browser's url
        history.replaceState("", "", "/");
    }

    return id;
}

export default function Login({ onLogin }) {
    const socket = useSocket();
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState(getRoomIdFromUrl);

    function handleResponse(data) {
        if (typeof data === "object") {
            onLogin(data);
        } else if (data === NONEXISTENT_ERROR) {
            setError(`The room "${roomId}" doesn't exist`);
        } else if (data === NAME_ERROR) {
            setError("Please choose another name");
        } else if (data === FULL_ERROR) {
            setError("This room is already full");
        } else {
            setError("An error occurred, please try to refresh the page");
        }
    }

   function handleSubmit(event) {
        event.preventDefault(); // don't refresh the page
        if (roomId) {
            socket.emit(JOIN_ROOM, name, roomId, handleResponse);
        } else {
            socket.emit(CREATE_ROOM, name, handleResponse);
        }
    }

    return (
        <div>
            {error
                ? <p><b>Error:</b> {error}.</p>
                : <p>Welcome to Stonks Online!</p>
            }

            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    className="card w-100"
                    value={name}
                    onChange={event => setName(event.target.value)}
                />

                <label>Room ID</label>
                <input
                    className="card w-100"
                    value={roomId}
                    onChange={event => setRoomId(event.target.value)}
                />
                <small>Leave this field empty to create a new room.</small>

                <hr/>
                <button
                    className="btn primary w-100"
                    type="submit"
                    disabled={/\s|^$/.test(name)}
                >
                    {roomId ? "Join" : "Create"} room
                </button>
            </form>

            <div style={{ "float": "right" }}>
                <p><small><code>Version 1.1.1 - (c) 2019, tarhses</code></small></p>
            </div>
        </div>
    );
}
