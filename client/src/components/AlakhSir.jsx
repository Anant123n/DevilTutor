import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/ContextApi";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

export default function AlakhSir() {
  const {
    messages,
    isRecording,
    isSpeaking,
    startVoiceInput,
    stopVoiceInput,
    sendMessage,
    stopAudio,
  } = useContext(AppContext);

  const userVideoRef = useRef(null);
  const alakhVideoRef = useRef(null);
  const [inputText, setInputText] = useState("");

  // === User video drag state ===
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // === Handle dragging ===
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  // === Play/Pause Alakh Sir video ===
  useEffect(() => {
    if (alakhVideoRef.current) {
      if (isSpeaking) alakhVideoRef.current.play();
      else alakhVideoRef.current.pause();
    }
  }, [isSpeaking]);

  // === Start user camera ===
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    startCamera();
  }, []);

  // === Stop AI speech if user starts talking ===
  useEffect(() => {
    if (isSpeaking && isRecording) stopAudio();
  }, [isRecording, isSpeaking, stopAudio]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white font-inter overflow-hidden relative">
      {/* ==== LEFT: AI Tutor ==== */}
      <div className="md:w-[65%] w-full flex flex-col items-center justify-center border-r border-gray-800 p-8 relative">
        <div className="bg-gradient-to-br from-[#1b1b3a] to-[#2c2c5c] rounded-3xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col justify-center items-center p-8 relative overflow-hidden">
          {/* Alakh Sir Video */}
          <div className="rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300">
            <video
              ref={alakhVideoRef}
              src="/video.mp4"
              className="w-full h-full object-cover rounded-full"
              autoPlay
              loop
              muted
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold mt-6">
            AI Tutor — Alakh Sir
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 text-center max-w-md">
            Your personalized, interactive AI learning companion.
          </p>
        </div>
      </div>

      {/* ==== RIGHT: Chat Section ==== */}
      <div className="md:w-[35%] w-full flex flex-col items-center justify-between p-6 space-y-6 bg-[#0e0e0e]">
        <div className="bg-gradient-to-br from-[#111111] to-[#1b1b1b] rounded-3xl shadow-2xl p-6 w-full flex flex-col flex-1 overflow-hidden border border-gray-800 h-[90vh]">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 text-center">
            Chat with Alakh Sir
          </h3>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto space-y-3 p-3 rounded-lg bg-[#141414] border border-gray-700"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm md:text-base ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-gray-100 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Mic + Input */}
          <div className="mt-5 flex items-center space-x-3">
            <button
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
                isRecording
                  ? "bg-red-500 animate-pulse"
                  : "bg-green-600 hover:bg-green-700"
              } text-white text-xl focus:outline-none`}
              onClick={() => {
                if (!isRecording) startVoiceInput();
                else stopVoiceInput();
              }}
              title={isRecording ? "Stop Recording" : "Start Speaking"}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            <input
              type="text"
              className="flex-1 bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or speak..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputText.trim()) {
                  sendMessage(inputText);
                  setInputText("");
                }
              }}
            />

            <button
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow font-semibold text-sm transition-all"
              onClick={() => {
                if (inputText.trim()) {
                  sendMessage(inputText);
                  setInputText("");
                }
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* ==== Floating Draggable User Video ==== */}
      <div
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          cursor: dragging ? "grabbing" : "grab",
          zIndex: 50,
        }}
        onMouseDown={handleMouseDown}
        className="transition-transform duration-200"
      >
        <div className="rounded-full  border-4 border-gray-700 shadow-lg w-40 h-40 md:w-50 md:h-50 bg-black">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            className="w-full h-full rounded-2xl object-cover "
          />
        </div>
      </div>
    </div>
  );
}
