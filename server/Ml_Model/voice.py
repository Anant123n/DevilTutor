import pyttsx3
from pathlib import Path
from pydub import AudioSegment
import io
import tempfile
import os

def speak_text(text):
    """
    Generate AI speech directly saved as .mp3 (no .aiff file kept).
    Works on macOS.
    """
    output_dir = Path("/Users/anantagrawal140gmail.com/Desktop/DevilTutor/Web Product/server/Ml_Model/audio")
    output_dir.mkdir(parents=True, exist_ok=True)
    mp3_path = output_dir / "output.mp3"

    # Initialize pyttsx3
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')

    # Try to select a female voice (macOS voices)
    selected_voice = None
    for voice in voices:
        if any(name in voice.name for name in ["Samantha", "Victoria", "Karen"]):
            selected_voice = voice
            break

    if selected_voice:
        engine.setProperty('voice', selected_voice.id)
        print(f"✅ Female voice selected: {selected_voice.name}")
    else:
        print("⚠️ Female voice not found, using default voice.")

    engine.setProperty('rate', 180)
    engine.setProperty('volume', 1.0)

    # Use a temporary AIFF file internally
    with tempfile.NamedTemporaryFile(suffix=".aiff", delete=False) as tmp_file:
        temp_path = tmp_file.name

    print(f"🎙️ Generating temporary speech file...")
    engine.save_to_file(text, temp_path)
    engine.runAndWait()

    # Convert directly to MP3
    print(f"🔄 Converting speech to MP3...")
    sound = AudioSegment.from_file(temp_path, format="aiff")
    sound.export(mp3_path, format="mp3")

    # Remove temporary AIFF
    os.remove(temp_path)

    print(f"✅ MP3 saved successfully at: {mp3_path}")
    return str(mp3_path)


if __name__ == "__main__":
    user_text = input("Enter something for me to say: ")
    output_file = speak_text(user_text)
    print(f"\n🎉 Done! Audio saved at:\n{output_file}")
