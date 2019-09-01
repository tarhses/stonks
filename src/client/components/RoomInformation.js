import React from "react";

const RoomInformation = ({ name, id }) =>
    <div>
        <p>Logged in as : <b>{name}</b></p>
        <p>Room ID : <a href={id} target="_blank" rel="noopener noreferrer"><code>{id}</code></a></p>
    </div>;

export default RoomInformation;
