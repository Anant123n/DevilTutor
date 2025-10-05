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
        "Generate at max 60 words in output. Be clear and simple.\n\n"
        "Question: {question}\n\n"
        "Answer:"
    )
)

physics_chain = LLMChain(
    llm=llm,
    prompt=physics_prompt
)

def get_physics_answer(question: str) -> str:
    question = question.strip()
    if not question:
        return "Please provide a valid question."
    
    result = physics_chain.invoke({"question": question})

    if isinstance(result, dict) and "text" in result:
        return result["text"]
    return str(result)
