import React, { useEffect, useState, useRef } from 'react';
import { db } from '../firebase-config';
import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";

function ChatScreen({ username }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const messagesEndRef = useRef(null);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        // Simple query: Order by time only. No 'where' clause = No complex index needed!
        const queryMessages = query(
            messagesRef,
            orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessageList(messages);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async () => {
        if (currentMessage === "") return;

        const msgToSend = currentMessage;
        setCurrentMessage(""); // Clear input IMMEDIATELY for better UX

        try {
            await addDoc(messagesRef, {
                message: msgToSend,
                author: username,
                createdAt: serverTimestamp(),
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Error sending message: " + error.message);
            setCurrentMessage(msgToSend); // Restore message if failed
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="header-info">
                    <div className="live-indicator"></div>
                    <p>Global Chat</p>
                </div>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent) => {
                    const isSystem = messageContent.author === "System";
                    const isMyMessage = username === messageContent.author;

                    if (isSystem) {
                        return (
                            <div className="system-message" key={messageContent.id}>
                                <p>{messageContent.message}</p>
                            </div>
                        );
                    }

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
