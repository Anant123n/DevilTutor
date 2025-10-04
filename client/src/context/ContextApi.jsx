// src/context/ContextApi.jsx
import React, { createContext, useState, useRef } from "react";

export const AppContext = createContext();

export const ContextApiProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const interimTranscriptRef = useRef("");

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const stopAudio = () => {
    setIsSpeaking(false);
  };

  const playAudio = (base64Audio) => {
    stopAudio();
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    setIsSpeaking(true);
    audio.play();
    audio.onended = () => {
      setIsSpeaking(false);
    };
  };

  const startVoiceInput = () => {
    if (isRecording) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    interimTranscriptRef.current = "";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      interimTranscriptRef.current = transcript;
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
    recognition.onend = () => {
      setIsRecording(false);
      // When stopped, process the transcript
      const text = interimTranscriptRef.current.trim();
      if (text) {
        addMessage({ sender: "user", text });
        sendMessage(text);
      }
    };
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    addMessage({ sender: "user", text });
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      addMessage({ sender: "teacher", text: data.reply });
      if (data.audio) playAudio(data.audio);
    } catch (err) {
      console.error("Chat API error:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        isRecording,
        isSpeaking,
        startVoiceInput,
        stopVoiceInput,
        sendMessage,
        stopAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
