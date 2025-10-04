// src/components/AlakhSir.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/ContextApi";
import { startRecording, stopRecording } from "../utils/speechUtils";

export default function AlakhSir() {
  const { messages, addMessage, isRecording, setIsRecording } = useContext(AppContext);
  const userVideoRef = useRef(null);
  const alakhVideoRef = useRef(null);
  const [inputText, setInputText] = useState("");
  const [responseAudio, setResponseAudio] = useState(null);

  useEffect(() => {
    // Start user's webcam
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    }
    startCamera();
  }, []);

  const handleVoiceInput = async () => {
    if (!isRecording) {
      setIsRecording(true);
      await startRecording();
    } else {
      setIsRecording(false);
      const text = await stopRecording();
      setInputText(text);
      sendMessage(text);
    }
  };

  const sendMessage = async (text) => {
    addMessage({ sender: "user", text });

    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    addMessage({ sender: "teacher", text: data.reply });

    // Play Alakh Sir video + TTS audio simultaneously
    if (alakhVideoRef.current) {
      alakhVideoRef.current.play();
    }
    const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
    setResponseAudio(audio);
    audio.play();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left column: Alakh Sir video */}
      <div className="w-7/10 relative bg-black">
        <video
          ref={alakhVideoRef}
          src="/alakhSirVideo.mp4"
          className="w-full h-full object-cover"
          controls={false}
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
          Alakh Sir
        </div>
      </div>

      {/* Right column: user video + chat */}
      <div className="w-3/10 flex flex-col p-2 space-y-2">
        {/* Top user video */}
        <div className="h-1/3 bg-black rounded-lg overflow-hidden relative">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
            You
          </div>
        </div>

        {/* Chat box */}
        <div className="h-2/3 bg-white rounded-lg shadow-lg p-2 flex flex-col">
          <h2 className="text-lg font-bold mb-2">Chat</h2>
          <div className="flex-1 overflow-y-auto space-y-2 border p-2 rounded bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <p
                  className={`inline-block p-2 rounded ${
                    msg.sender === "user" ? "bg-blue-400 text-white" : "bg-gray-300"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-2 flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                isRecording ? "bg-red-500" : "bg-green-500"
              } text-white`}
              onClick={handleVoiceInput}
            >
              {isRecording ? "Stop" : "Start"} Voice
            </button>
            <input
              type="text"
              className="border p-2 rounded flex-1"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => sendMessage(inputText)}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
