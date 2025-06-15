import { Routes, Route } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";
import SingleConversation from "./pages/SingleConversation";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/conversations" element={<Conversation />} />
      <Route path="/conversations/:id" element={<SingleConversation />} />
    </Routes>
  );
};

export default App;
