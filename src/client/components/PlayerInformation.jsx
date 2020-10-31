import { h } from "preact";
import rules from "../../common/rules.json";
import { AUCTION_STATE } from "../../common/signals.js";

export default function PlayerInformation({ player, status }) {
    const ownedAnimals = Array
        .from(player.animals.entries()) // transform each item to [id, count]
        .filter(([, count]) => count > 0); // remove any item if count < 1

    return (
        <tr>
            <th>
                {player.name}
            </th>
            <td>
                {ownedAnimals.length === 0
                    ? <div><i>None</i></div>
                    : ownedAnimals.map(([id, count]) => {
                        const animal = rules.animals[id];
                        const content = `${count} ${count === 1 ? animal.name : animal.namePlural}`;
                        return (
                            <div key={id}>
                                {status.type === AUCTION_STATE && id === status.animalId
                                    ? <b>{content}</b>
                                    : content
                                } [{animal.score}]
                            </div>
                        );
                })}
            </td>
            <td>
                {player.change}
            </td>
        </tr>
    );
}
