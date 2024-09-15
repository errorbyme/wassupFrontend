import React from "react";

const Message = ({ msg, id }) => {
  return (
    <div className={`msg ${msg.i === id ? "right" : "left"}`}>
      <strong className={`${msg.u === "Bot" && "bot"}`}>
        {id !== msg.i && "@" + msg.u}{" "}
      </strong>
      {msg.img ? (
        <img src={msg.img} width="100%" alt="" srcset="" />
      ) : (
        <span>{msg.m}</span>
      )}
    </div>
  );
};

export default Message;
