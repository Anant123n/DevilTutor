// src/context/ContextApi.jsx
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // chat history
  const [isRecording, setIsRecording] = useState(false);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <AppContext.Provider value={{ messages, addMessage, isRecording, setIsRecording }}>
      {children}
    </AppContext.Provider>
  );
};
