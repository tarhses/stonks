import { h } from 'preact'
import rules from '../../common/rules.json'

export default function End ({ players }) {
  const results = players.map((player, playerId) => {
    const scores = player.animals
      .map((count, animalId) => count === rules.animalCount ? rules.animals[animalId].score : 0)
      .filter(score => score > 0)
    return [playerId, scores.reduce((a, b) => a + b, 0) * scores.length]
  }).sort(([, a], [, b]) => b - a)

  return (
    <div>
      <p>The game is over. <b>{players[results[0][0]].name}</b> won!</p>
      <ol>
        {results.map(([id, score]) =>
          <li key={id}>
            <b>{players[id].name} :</b> {score}
          </li>
        )}
      </ol>
    </div>
  )
}
