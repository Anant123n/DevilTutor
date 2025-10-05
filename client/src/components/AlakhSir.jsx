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

  // === CAMERA INIT ===
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

  // === HANDLE AUTO MIC STOP ON SILENCE ===
  useEffect(() => {
    let silenceTimer;
    if (isRecording) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const finalText = transcript.trim();
            if (finalText) {
              sendMessage(finalText); // send immediately to backend
              setInputText("");
            }
          } else {
            interimTranscript += transcript;
            setInputText(interimTranscript);
          }
        }
      };

      recognition.onspeechend = () => {
        stopVoiceInput();
      };

      recognition.start();
      silenceTimer = setTimeout(() => stopVoiceInput(), 10000);

      return () => {
        recognition.stop();
        clearTimeout(silenceTimer);
      };
    }
  }, [isRecording]);

  // === USER INTERRUPTS AI SPEECH ===
  useEffect(() => {
    if (isSpeaking && isRecording) {
      // if both active → user talking → stop AI voice instantly
      stopAudio();
    }
  }, [isRecording, isSpeaking, stopAudio]);

  // === UI ===
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-blue-100 to-purple-200 font-sans">
      {/* Alakh Sir video */}
      <div className="md:w-7/10 w-full relative bg-black flex items-center justify-center">
        <video
          ref={alakhVideoRef}
          src="/alakhsir.mp4"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          autoPlay
          loop
          muted
        />
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded-lg text-lg font-semibold shadow-md">
          Alakh Sir
        </div>
      </div>

      {/* Chat + user */}
      <div className="md:w-3/10 w-full flex flex-col p-4 space-y-4">
        <div className="h-48 bg-black rounded-lg overflow-hidden relative flex items-center justify-center shadow-md">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded shadow">
            You
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-xl p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-3 text-gray-700">Chat</h2>

          <div
            className="flex-1 overflow-y-auto space-y-3 border p-3 rounded-xl bg-gray-50 transition-all"
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
                  className={`max-w-[70%] p-3 rounded-2xl shadow-md text-base break-words transition-all
                    ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Mic + Input + Send */}
          <div className="mt-4 flex items-center space-x-3">
            <button
              className={`w-20 h-12 flex items-center justify-center rounded-full shadow-lg transition-all duration-200
                ${
                  isRecording
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-500 hover:bg-green-600"
                }
                text-white text-2xl focus:outline-none`}
              onClick={() => {
                if (!isRecording) startVoiceInput();
                else stopVoiceInput();
              }}
              title={isRecording ? "🎙️ Stop" : "🎤 Start"}
            >
              {isRecording ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            <input
              type="text"
              className="border p-3 rounded-xl flex-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Speak or type..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputText.trim()) {
                  sendMessage(inputText);
                  setInputText("");
                }
              }}
            />

            <button
              className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow font-semibold text-base transition-all"
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
    </div>
  );
}
