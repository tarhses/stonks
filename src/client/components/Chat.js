import React from "react";

const Chat = ({ messages }) =>
    <ul style={{ height: "20em", overflowY: "auto" }}>
        {messages.length === 0
            ? <li><i>No messages yet.</i></li>
            : messages.map((item, id) => <li key={messages.length - id}>{item}</li>)
        }
    </ul>;

export default Chat;
