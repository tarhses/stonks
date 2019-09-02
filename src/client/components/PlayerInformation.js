import React from "react";
import animals from "../../common/animals.json";

const PlayerInformation = ({ player }) => {
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
                        const animal = animals[id];
                        return (
                            <div key={id}>
                                {count} {count === 1
                                    ? animal.name
                                    : animal.namePlural
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
};

export default PlayerInformation;
