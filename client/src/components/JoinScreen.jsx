import React, { useState } from 'react';

function JoinScreen({ joinRoom }) {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");

    const handleJoin = () => {
        if (username !== "" && room !== "") {
            joinRoom(username, room);
        }
    };

    return (
        <div className="join-container">
            <div className="join-card">
                <h1>Welcome Back</h1>
                <p>Enter your details to join the chat</p>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Room ID"
                        onChange={(event) => setRoom(event.target.value)}
                        onKeyPress={(event) => {
                            event.key === "Enter" && handleJoin();
                        }}
                    />
                </div>
                <button onClick={handleJoin}>Join Room</button>
            </div>
        </div>
    );
}

export default JoinScreen;
