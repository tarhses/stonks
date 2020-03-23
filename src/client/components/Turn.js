import { h } from 'preact'
import { useSocket } from '../hooks.js'
import { START_AUCTION, START_OFFER } from '../../common/signals.json'
import rules from '../../common/rules.json'

export default function Turn ({ players, animals, status, selfId }) {
  const socket = useSocket()

  const { playerId } = status
  const player = players[playerId]
  const animalCount = animals.reduce((a, b) => a + b, 0)

  if (selfId === playerId) {
    const choices = []

    // Sell an animal
    if (animalCount > 0) {
      choices.push(<button onClick={() => socket.emit(START_AUCTION)}>
        Sell an animal ({animalCount} left)
      </button>)
    }

    // Buy an animal
    for (const [targetId, target] of players.entries()) {
      if (targetId !== selfId) {
        for (const [animalId, targetCount] of target.animals.entries()) {
          const selfCount = player.animals[animalId]
          const animal = rules.animals[animalId]

          if (selfCount >= 1 && targetCount >= 1) {
            choices.push(<button onClick={() => socket.emit(START_OFFER, targetId, animalId)}>
              Buy {selfCount === 2 && targetCount === 2
                ? `two ${animal.namePlural}`
                : `a ${animal.name}`
              } from <b>{target.name}</b>
            </button>)
          }
        }
      }
    }

    return (
      <div>
        <p>
          It&apos;s your turn, what will you do?
        </p>
        <ul>
          {choices.map((choice, id) =>
            <li key={id}>{choice}</li>
          )}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <p>It&apos;s <b>{player.name}</b>&apos;s turn.</p>
    </div>
  )
}
