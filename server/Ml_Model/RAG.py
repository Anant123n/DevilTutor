import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# === SET YOUR GOOGLE API KEY HERE ===
GOOGLE_API_KEY = "AIzaSyAgfpE7sReEMS8YP51dTjVSnuO00Sstx1Y"
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# === 1. Load PDF document ===
loader = PyPDFLoader("/Users/anantagrawal140gmail.com/Desktop/DevilTutor/Web Product/server/Ml Model/Attention.pdf")
documents = loader.load()

# === 2. Split text into chunks ===
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
text_chunks = text_splitter.split_documents(documents)

# === 3. Embed documents using HuggingFace embeddings ===
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# === 4. Create FAISS vector store ===
vectorstore = FAISS.from_documents(text_chunks, embedding)
retriever = vectorstore.as_retriever()

# === 5. Define custom RAG prompt ===
template = """
You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know.
Use ten sentences maximum and keep the answer concise.

Question: {question}
Context: {context}
Answer:
"""

prompt = ChatPromptTemplate.from_template(template)

# === 6. Set up the LLM ===
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY,
)

output_parser = StrOutputParser()

# === 7. Build RAG pipeline ===
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | output_parser
)

# === 8. Ask a question ===
response = rag_chain.invoke("How is the United States supporting Ukraine economically and militarily?")
print("\n🧠 Answer:\n", response)
