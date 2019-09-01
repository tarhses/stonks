import React, { useState } from "react";
import { useSocket } from "../hooks.js";

function getRoomIdFromUrl() {
    const id = location.pathname.replace("/", ""); // remove the leading slash
    if (id) {
        history.replaceState("", "", "/"); // replace the browser's url
    }
    return id;
}

const Login = ({ onLogin }) => {
    const socket = useSocket();
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState(getRoomIdFromUrl);

    const handleResponse = data => {
        if (typeof data === "string") {
            setError(data);
        } else {
            onLogin(data);
        }
    };

    const handleSubmit = e => {
        e.preventDefault(); // don't refresh the page
        if (roomId) {
            socket.emit("enter", name, roomId, handleResponse);
        } else {
            socket.emit("create", name, handleResponse);
        }
    };

    return (
        <div>
            {error === null
                ? <p>Welcome to Stonks Online!</p>
                : <p><b>Error:</b> {error}</p>
            }

            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    className="card w-100"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <label>Room ID</label>
                <input
                    className="card w-100"
                    value={roomId}
                    onChange={e => setRoomId(e.target.value)}
                />
                <small>Leave this field empty to create a new room.</small>

                <hr/>
                <button
                    className="btn primary w-100"
                    type="submit"
                    disabled={/\s/.test(name)}
                >
                    {roomId ? "Join" : "Create"} room
                </button>
            </form>
        </div>
    );
};

export default Login;
