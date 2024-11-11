import React, { useEffect, useRef, useState } from "react";
import { useServer } from "../Context/ServerContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Message from "./Message";
import { toast } from "react-toastify";

let socket;

const Home = () => {
  const { user } = useServer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user]);

  const [msg, Setmsg] = useState("");
  const [id, Setid] = useState("");
  const [msgs, Setmsgs] = useState([]);
  const [isTrue, SetisTrue] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (socket?.connected) SetisTrue(true);
  }, [socket]);

  useEffect(() => {
    if (!user) navigate("/");

    socket = io("https://wassupbackend.onrender.com/", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected dude");
    });

    socket.emit("Joined", { user });

    socket.on("welcome", ({ user, msg, id }) => {
      Setid(id);
      Setmsgs((msgs) => [...msgs, { u: user, m: msg, i: null }]);
    });

    socket.on("userJoined", ({ user, msg }) => {
      Setmsgs((msgs) => [...msgs, { u: user, m: msg, i: null }]);
    });

    socket.on("userLeft", ({ user, msg }) => {
      Setmsgs((msgs) => [...msgs, { u: user, m: msg, i: null }]);
    });

    socket.on("receive-msg", ({ user, msg, id }) => {
      Setmsgs((msgs) => [...msgs, { u: user, m: msg, i: id }]);
    });

    // Listen for file uploads
    socket.on("fileUploaded", ({ fileUrl, user, id }) => {
      Setmsgs((msgs) => [
        ...msgs,
        {
          img: `https://wassupbackend.onrender.com${fileUrl}`,
          u: user,
          i: id,
          m: "",
        },
      ]);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [navigate, user]);

  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };
  useEffect(() => {
    requestAnimationFrame(scrollToBottom);
  }, [msgs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg === "") return console.log("Empty");
    socket.emit("msg", { user, msg, id });
    Setmsg("");
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.files[0];
    if (!fileInput) return;

    if (!fileInput.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput);
    formData.append("user", user);
    formData.append("id", id);

    try {
      const response = await fetch(
        "https://wassupbackend.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      // File URL is handled by the socket event
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    // Detect when the keyboard is open by monitoring window resize
    const handleResize = () => {
      const isKeyboardOpen = window.innerHeight < 500; // You can adjust this threshold based on your UI
      setKeyboardOpen(isKeyboardOpen);
      if (isKeyboardOpen) {
        setTimeout(scrollToBottom, 300); // Wait a bit for layout to stabilize
      }
    };

    // Listen to resize events (for keyboard opening/closing)
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isTrue ? (
        <h1 className="loading">...is Loading</h1>
      ) : (
        <div className="chat_page">
          <div className="chat_header">
            <h3>@{user}</h3>
            <a href="/">X</a>
          </div>
          <div className="chat_box">
            {msgs.map((m, i) => (
              <Message msg={m} id={id} key={i} />
            ))}
            <div ref={endOfMessagesRef} className="lastmsg"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="chat_send">
              <label htmlFor="imgId">+</label>
              <input
                id="imgId"
                type="file"
                onChange={handleFileUpload}
                className="img"
              />
              <input
                type="text"
                value={msg}
                onChange={(e) => Setmsg(e.target.value)}
                autoFocus
                onFocus={() => setKeyboardOpen(true)}
                onBlur={() => setKeyboardOpen(false)}
                placeholder="Type Here..."
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Home;
