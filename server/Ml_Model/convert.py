from pydub import AudioSegment

# Input and output file paths
input_file = "/Users/anantagrawal140gmail.com/Desktop/DevilTutor/Web Product/server/Ml_Model/audio/output.wav"
output_file = "output.mp3"

# Load the WAV file
audio = AudioSegment.from_wav(input_file)

# Export as MP3
audio.export(output_file, format="mp3")

print("✅ Conversion complete! Saved as:", output_file)
