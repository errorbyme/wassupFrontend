import React from "react";
import { useNavigate } from "react-router-dom";
import { useServer } from "../Context/ServerContext.jsx";
import { toast } from "react-toastify";

const Join = () => {
  const { setUser, user } = useServer();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) toast.warning("Username cannot be empty.");
    else if (user.length < 3) toast.warning("Username shud be > then 2 char.");
    else navigate("/home");
  };

  return (
    <div className="join_page">
      <h1>HeYSup</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="username"
          value={user}
          autoFocus
          onChange={(e) => setUser(e.target.value)}
          type="text"
          placeholder="Enter username..."
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Join;
