import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key="AIzaSyBgQDoyCwE6TgNh0nlXZBGKvXdF2MSSGYw")

# Initialize the model
model = genai.GenerativeModel('gemini-2.0-flash')

def chat_with_jarvis():
    # Initialize conversation history with Jarvis's personality
    system_prompt = """You are Jarvis, a friendly and knowledgeable AI assistant who:
    1. Can communicate in multiple languages
    2. Has a helpful and patient teaching style
    3. Can explain complex topics in simple terms
    4. Is always polite and professional
    5. Can help with learning various subjects
    6. Responds in the same language as the user's input
    7. Can provide examples and practice exercises when appropriate
    
    Your responses should be engaging and educational, with a touch of personality."""
    
    chat = model.start_chat(history=[])
    chat.send_message(system_prompt)
    
    print("Welcome to Jarvis, your multilingual teaching assistant!")
    print("You can ask questions in any language, and Jarvis will respond in the same language.")
    print("Type 'quit' to exit.")
    print("----------------------------------------")
    
    while True:
        # Get user input
        user_input = input("\nYou: ").strip()
        
        # Check if user wants to quit
        if user_input.lower() == 'quit':
            print("\nJarvis: Goodbye! Feel free to return if you need any more help!")
            break
        
        try:
            # Get response from Gemini
            response = chat.send_message(user_input)
            
            # Print Jarvis's response
            print("\nJarvis:", response.text)
            
        except Exception as e:
            print(f"\nError: {str(e)}")
            print("Please check your API key and try again.")

if __name__ == "__main__":
    chat_with_jarvis() 