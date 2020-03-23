import { h } from 'preact'

export default function RoomInformation ({ name, id }) {
  return (
    <div>
      <p>Logged in as : <b>{name}</b></p>
      <p>Room ID : <a href={id} target="_blank" rel="noopener noreferrer"><code>{id}</code></a></p>
    </div>
  )
}
