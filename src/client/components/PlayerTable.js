import React from "react";
import PlayerInformation from "./PlayerInformation.js";

export default function PlayerTable({ players }) {
    return (
        <table className="w-100">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Animals</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                {players.map((player, id) =>
                    <PlayerInformation key={id} player={player}/>
                )}
            </tbody>
        </table>
    );
}
