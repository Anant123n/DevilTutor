// server/controllers/sttController.js

export const handleSTT = async (req, res) => {
  // For now, just return a dummy text
  res.json({ text: "This is a dummy STT response." });
};
