import os
from typing import TypedDict, List, Dict, Annotated
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver

# -----------------------------
# Load Environment & Initialize Model
# -----------------------------
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

# -----------------------------
# Global Persistent Memory
# -----------------------------
checkpointer = InMemorySaver()
GLOBAL_THREAD_ID = "global_session"

# -----------------------------
# Free-form Chat State
# -----------------------------
class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

chat_state = {"messages": []}

def stream_chat_response(user_message: str):
    chat_state["messages"].append(HumanMessage(content=user_message))
    buffer = ""
    line_count = 0

    # Stream directly from LLM
    for chunk in llm.stream(chat_state["messages"]):
        text_chunk = getattr(chunk, "content", None) or str(chunk)
        buffer += text_chunk
        line_count += text_chunk.count("\n")

        if line_count >= 4:
            yield buffer
            buffer = ""
            line_count = 0
    if buffer:
        yield buffer

# -----------------------------
# Physics Q&A Streaming
# -----------------------------
def stream_physics_answer_chunks(question: str, history: List[Dict[str,str]] = None):
    if history is None:
        history = []
    conversation_context = "\n".join([f"Q: {h['question']}\nA: {h['answer']}" for h in history])
    prompt = (conversation_context + "\n\n" if conversation_context else "") + \
             f"You are a friendly teacher.\nAnswer step by step, keeping it simple and short (max 50 words).\nQuestion: {question}\nAnswer:"

    buffer = ""
    line_count = 0
    streamed_content = ""

    for chunk in llm.stream(prompt):
        text_chunk = getattr(chunk, "content", None) or str(chunk)
        buffer += text_chunk
        streamed_content += text_chunk
        line_count += text_chunk.count("\n")

        if line_count >= 4:
            yield buffer
            buffer = ""
            line_count = 0
    if buffer:
        yield buffer

    # Save to history for persistent memory
    history.append({"question": question, "answer": streamed_content})

# -----------------------------
# CLI Loop for Testing
# -----------------------------
if __name__ == "__main__":
    print("=== Gemini Chatbot (Streaming & Physics Q&A) ===")
    print("Type 'chat:' for general conversation or 'physics:' for physics questions.")
    print("Type 'exit' or 'quit' to stop.\n")

    physics_history = []

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting chat. Global memory saved.")
            break

        if user_input.lower().startswith("physics:"):
            question = user_input[len("physics:"):].strip()
            print("AI (Physics):")
            for chunk in stream_physics_answer_chunks(question, physics_history):
                print(chunk, end="", flush=True)
            print("\n")
        else:
            print("AI (Chat):")
            for chunk in stream_chat_response(user_input):
                print(chunk, end="", flush=True)
            print("\n")
