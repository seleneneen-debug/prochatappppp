import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase-config';
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";

function ChatScreen({ room, username }) { // Removed socket prop
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(
            messagesRef,
            where("room", "==", room),
            orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessageList(messages);
            <div className="chat-window">
                <div className="chat-header">
                    <div className="header-info">
                        <div className="live-indicator"></div>
                        <p>Live Chat: <strong>{room}</strong></p>
                    </div>
                </div>
                <div className="chat-body">
                    {messageList.map((messageContent) => {
                        const isMyMessage = username === messageContent.author;
                        return (
                            <div
                                className={`message-container ${isMyMessage ? "you" : "other"}`}
                                key={messageContent.id}
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
