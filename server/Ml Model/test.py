import os
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain

os.environ["GOOGLE_API_KEY"] = "AIzaSyBqd6j98w-frhNGNHRwWaMJ745GxqZUWKY"


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7
)


physics_prompt = PromptTemplate(
    input_variables=["question"],
    template=(
        "You are a knowledgeable and friendly PHYSICS teacher. "
        "Explain the following question step by step like you are teaching a student. "
        "generate at max 100 words  in output"
        "Be clear and simple.\n\n"
        "Question: {question}\n\n"
        "Answer:"
    )
)


physics_chain = LLMChain(
    llm=llm,
    prompt=physics_prompt
)


if __name__ == "__main__":
    print("🤖 Physics Assistant (type 'exit' to quit)\n")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "exit":
            break

        result = physics_chain.invoke({"question": user_input})

        if isinstance(result, dict) and "text" in result:
            print("👨‍🏫:", result["text"], "\n")
        else:
            print("👨‍🏫:", result, "\n")
