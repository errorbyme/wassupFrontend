import React from "react";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <div className="container">
        <ToastContainer autoClose={3000} closeOnClick theme="dark" />
        <Outlet />
      </div>
    </>
  );
};

export default App;
