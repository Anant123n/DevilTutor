// src/utils/speechUtils.js
let mediaRecorder;
let audioChunks = [];

export const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  mediaRecorder.start();
};

export const stopRecording = () => {
  return new Promise((resolve) => {
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: "audio/wav" });
      audioChunks = [];

      const formData = new FormData();
      formData.append("file", blob);

      const res = await fetch("http://localhost:5000/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      resolve(data.text);
    };
    mediaRecorder.stop();
  });
};


// src/utils/speechUtils.js

export const speechToText = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob);

  const res = await fetch("http://localhost:5000/api/speech-to-text", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.text;
};
