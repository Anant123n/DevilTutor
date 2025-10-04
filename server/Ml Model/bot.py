from chatmodel import get_physics_answer

if __name__ == "__main__":
    print("🤖 Physics Assistant (type 'exit' to quit)\n")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "exit":
            break
        
        answer = get_physics_answer(user_input)
        print("👨‍🏫:", answer, "\n")
