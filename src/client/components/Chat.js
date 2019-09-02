import React from "react";

export default function Chat({ messages }) {
    return (
        <ul style={{ height: "20em", overflowY: "auto" }}>
            {messages.length === 0
                ? <li><i>No messages yet.</i></li>
                : messages.map((item, id) => <li key={messages.length - id}>{item}</li>)
            }
        </ul>
    );
}
