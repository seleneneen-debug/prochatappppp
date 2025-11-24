import { useState } from 'react';
import './App.css';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (user, roomID) => {
    if (user !== "" && roomID !== "") {
      setUsername(user);
      setRoom(roomID);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <JoinScreen joinRoom={joinRoom} />
      ) : (
        <ChatScreen username={username} room={room} />
      )}
    </div>
  );
}

export default App;
