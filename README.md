# OpenAI Chatbot

A simple command-line chatbot powered by OpenAI's GPT-3.5 Turbo model.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the project root and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

You can get an API key by signing up at [OpenAI's website](https://platform.openai.com/).

## Usage

Run the chatbot:
```bash
python chatbot.py
```

- Type your messages and press Enter to chat with the bot
- Type 'quit' to exit the conversation
- The bot will maintain conversation history during the session

## Features

- Interactive command-line interface
- Conversation history tracking
- Error handling for API issues
- Simple and easy to use 