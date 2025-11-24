import React, { useEffect, useState, useRef } from 'react';

function ChatScreen({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            // We don't add it manually here because we listen for our own message broadcast
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        const handler = (data) => {
            setMessageList((list) => [...list, data]);
        };
        socket.on("receive_message", handler);

        return () => {
            socket.off("receive_message", handler);
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="header-info">
                    <div className="live-indicator"></div>
                    <p>Live Chat: <strong>{room}</strong></p>
                </div>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent, index) => {
                    const isMyMessage = username === messageContent.author;
                    return (
                        <div
                            className={`message-container ${isMyMessage ? "you" : "other"}`}
                            key={index}
                        >
                            <div className="message-content">
                                <div className="message-meta">
                                    <p id="author">{messageContent.author}</p>
                                    <p id="time">{messageContent.time}</p>
                                </div>
                                <div className="message-bubble">
                                    <p>{messageContent.message}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-footer">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Type a message..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default ChatScreen;
