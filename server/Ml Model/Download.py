from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import os

model_dir = os.path.expanduser("~/phi4")  

print("⏳ Loading model...")
tokenizer = AutoTokenizer.from_pretrained(model_dir)
model = AutoModelForCausalLM.from_pretrained(model_dir)

generator = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="cpu",     
    torch_dtype="float32"  
)

prompt = "Write a short story about a robot learning emotions."

print("⏳ Generating response...\n")
output = generator(
    prompt,
    max_new_tokens=200,
    temperature=0.7,
    top_p=0.9,
    do_sample=True
)
print("✅ Generated Text:\n")
print(output[0]["generated_text"])


