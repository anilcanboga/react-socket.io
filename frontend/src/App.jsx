import { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";
import "./App.css";

const PORT = 3001;
const socket = io(`http://localhost:${PORT}`);

function App() {
  const [isConntected, setIsConnected] = useState(socket.connected);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [chatIsVisible, setChatIsVisible] = useState("");
  const [message, setMessage] = useState([]);
  console.log("message: ", message);

  useEffect(() => {
    console.log("connected:", socket.connected);
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [isConntected]);

  useEffect(() => {
    socket.on("receive_msg", ({ user, message }) => {
      const msg = `${user} send: ${message}`;
      setMessage((prevState) => [msg, ...prevState]);
    });
  }, [socket]);

  const handleEnterChatRoom = () => {
    if (user !== "" && room !== "") {
      setChatIsVisible(true);
      socket.emit("join_room", { user, room });
    }
  };

  const handleSendMessge = () => {
    const newMsgData = {
      room: room,
      user: user,
      message: newMessage,
    };
    socket.emit("send_msg", newMsgData);
    const msg = `${user} send: ${newMessage}`;
    setMessage((prevState) => [msg, ...prevState]);
    setNewMessage("");
  };

  return (
    <>
      <div style={{ padding: 20 }}>
        {!chatIsVisible ? (
          <>
            <input
              type="text"
              placeholder="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <br />
            <input
              type="text"
              placeholder="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
            <br />
            <button onClick={handleEnterChatRoom}>enter</button>
          </>
        ) : (
          <>
            <h5>
              Room: {room} | User: {user}
            </h5>
            <div
              style={{
                height: 200,
                width: 250,
                border: "1px solid #000",
                overflow: "scroll",
                marginBottom: 10,
                padding: 10,
              }}
            >
              {message.map((el) => (
                <div key={v4()}>{el}</div>
              ))}
            </div>
            <input
              type="text"
              placeholder="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessge}>send message</button>
          </>
        )}
      </div>
    </>
  );
}

export default App;
