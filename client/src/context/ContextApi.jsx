import React, { createContext, useState, useRef, useContext } from "react";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // 🎙️ Start mic listening
  const startVoiceInput = () => {
    if (isRecording) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported on this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    let userSpeech = "";

    recognition.onstart = () => {
      console.log("🎙️ Mic started...");
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      userSpeech = transcript.trim();

      // Live update to input display
      if (userSpeech) {
        setMessages((prev) => [
          ...prev.filter((m) => !m.temp),
          { sender: "user", text: userSpeech, temp: true },
        ]);
      }
    };

    recognition.onend = async () => {
      console.log("🎤 Mic stopped.");
      setIsRecording(false);

      if (userSpeech) {
        // Remove temporary message
        setMessages((prev) => prev.filter((m) => !m.temp));

        // Add final user message
        setMessages((prev) => [...prev, { sender: "user", text: userSpeech }]);

        // Send to backend
        await sendMessage(userSpeech);
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 🛑 Stop mic manually
  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // 🚀 Send user question to backend
 const sendMessage = async (question) => {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    console.log("✅ Backend response:", data);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question },
      { sender: "ai", text: data.answer_text },
    ]);

    playAudio(); // Play fixed file
  } catch (err) {
    console.error("❌ Error contacting backend:", err);
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Server error. Please try again." },
    ]);
  }
};


  // 🎧 Play audio from backend
const playAudio = () => {
  try {
    // Pause if audio is already playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // The audio file path inside public folder
    const audioURL = "/output.mp3"; // public folder files are served relative to root

    const audio = new Audio(audioURL);
    audioRef.current = audio;
    setIsSpeaking(true);

    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
      setIsSpeaking(false);
    });

    audio.onended = () => {
      setIsSpeaking(false);
    };

    audio.onerror = (err) => {
      console.error("Audio playback error:", err);
      setIsSpeaking(false);
    };
  } catch (e) {
    console.error("Audio playback error:", e);
    setIsSpeaking(false);
  }
};






  // 🧠 Stop AI speech instantly
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  // 🎙️ If AI is talking and user speaks → stop AI, listen again
  const interruptAI = () => {
    if (isSpeaking) {
      stopAudio();
      startVoiceInput();
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
        interruptAI,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
