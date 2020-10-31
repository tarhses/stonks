import { h } from "preact";
import PlayerInformation from "./PlayerInformation.jsx";

export default function PlayerTable({ players, status }) {
    return (
        <div className="card col">
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
                        <PlayerInformation key={id} player={player} status={status} />
                    )}
                </tbody>
            </table>
        </div>
    );
}
