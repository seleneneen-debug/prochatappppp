import { useState } from 'react';
import './App.css';
import JoinScreen from './components/JoinScreen';
import ChatScreen from './components/ChatScreen';

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinChat = (user) => {
    if (user !== "") {
      setUsername(user);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <JoinScreen joinChat={joinChat} />
      ) : (
        <ChatScreen username={username} />
      )}
    </div>
  );
}

export default App;
