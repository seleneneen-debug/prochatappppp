import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';

const socket = io.connect(import.meta.env.VITE_SERVER_URL || "http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (user, roomID) => {
    if (user !== "" && roomID !== "") {
      setUsername(user);
      setRoom(roomID);
      socket.emit("join_room", roomID);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <JoinScreen joinRoom={joinRoom} />
      ) : (
        <ChatScreen socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
