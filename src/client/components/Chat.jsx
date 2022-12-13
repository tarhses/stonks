import { useState } from "preact/hooks"
import { useSocket } from "../hooks.js"
import { SEND_MESSAGE } from "../../common/signals.js"

export default function Chat({ messages }) {
	const socket = useSocket()
	const [text, setText] = useState("")

	function handleSubmit(event) {
		event.preventDefault() // don't refresh the page
		socket.emit(SEND_MESSAGE, text)
		setText("")
	}

	return (
		<div className="card col 5">
			<ul style={{ height: "24em", overflowY: "auto" }}>
				{messages.length === 0 ? (
					<li>
						<i>No messages yet.</i>
					</li>
				) : (
					messages.map((item, id) => <li key={messages.length - id}>{item}</li>)
				)}
			</ul>

			<form onSubmit={handleSubmit}>
				<input
					value={text}
					onChange={(event) => setText(event.target.value)}
					placeholder="Message"
				/>
				<button type="submit" disabled={/^\s*$/.test(text)}>
					Send
				</button>
			</form>
		</div>
	)
}
