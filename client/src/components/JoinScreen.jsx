import React, { useState } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function JoinScreen({ joinChat }) {
    const [username, setUsername] = useState("");

    const handleJoin = async () => {
        if (username !== "") {
            // Send "User Joined" system message
            try {
                await addDoc(collection(db, "messages"), {
                    message: `${username} joined the chat`,
                    author: "System",
                    createdAt: serverTimestamp(),
                    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
                });
            } catch (error) {
                console.error("Error sending join message:", error);
            }

            joinChat(username);
        }
    };

    return (
        <div className="join-container">
            <div className="join-card">
                <h1>Global Chat</h1>
                <p>Enter your name to join everyone</p>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(event) => setUsername(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && handleJoin();
                        }}
                    />
                </div>
                <button onClick={handleJoin}>Join Chat</button>
            </div>
        </div>
    );
}

export default JoinScreen;
