# MiniMax-M2.1 Exploration Project

An exploratory research project for testing and evaluating the early-access MiniMax-M2.1 model via the OpenAI-compatible API.

## Features

- **OpenAI-compatible SDK**: Uses the familiar OpenAI Python SDK
- **Reusable client wrapper**: Simple interface for common operations
- **Interactive notebooks**: Jupyter notebooks for hands-on exploration
- **Parameter experiments**: Test different settings for optimal results

## Quick Start

### 1. Clone and Setup

```bash
cd MiniMax-M2.1

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure API Key

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your MiniMax API key
# MINIMAX_API_KEY=your_api_key_here
```

Get your API key from: https://platform.minimaxi.com/user-center/basic-information/interface-key

### 3. Run Notebooks

```bash
# Start Jupyter
jupyter notebook

# Navigate to notebooks/ and open 01_quickstart.ipynb
```

## Project Structure

```
MiniMax-M2.1/
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── src/
│   ├── __init__.py
│   └── minimax_client.py     # MiniMax API client wrapper
└── notebooks/
    ├── 01_quickstart.ipynb           # Basic usage and setup
    ├── 02_capabilities_test.ipynb    # Test model capabilities
    └── 03_parameters_tuning.ipynb    # Parameter experiments
```

## Usage Examples

### Quick Chat

```python
from src.minimax_client import MiniMaxClient

client = MiniMaxClient()
response = client.simple_chat("What is quantum computing?")
print(response)
```

### With System Prompt

```python
response = client.simple_chat(
    "Explain recursion",
    system_prompt="You are a patient teacher. Use simple analogies."
)
```

### Streaming Response

```python
messages = [
    {"role": "user", "content": "Write a short poem about AI"}
]
client.print_stream(messages)
```

### Full Control

```python
response = client.chat(
    messages=[{"role": "user", "content": "Hello!"}],
    temperature=0.7,
    max_tokens=500,
    top_p=0.95
)
print(response.choices[0].message.content)
```

## Notebooks Overview

| Notebook | Description |
|----------|-------------|
| **01_quickstart** | Setup verification, basic chat, streaming, multi-turn |
| **02_capabilities_test** | Reasoning, code gen, creative writing, math |
| **03_parameters_tuning** | Temperature, top_p, max_tokens, system prompts |

## API Reference

### MiniMaxClient

| Method | Description |
|--------|-------------|
| `chat(messages, ...)` | Full chat completion with all parameters |
| `simple_chat(prompt, system_prompt, ...)` | Quick single-turn chat |
| `stream_chat(messages, ...)` | Generator yielding response chunks |
| `print_stream(messages, ...)` | Stream and print in real-time |
| `test_connection()` | Verify API connectivity |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `temperature` | 0.7 | Randomness (0-1, higher = more creative) |
| `max_tokens` | 4096 | Maximum response length |
| `top_p` | 0.95 | Nucleus sampling threshold |

## Model Information

- **Model**: MiniMax-M2.1 (Early Access)
- **API Base URL**: https://api.minimaxi.com/v1
- **Compatibility**: OpenAI SDK compatible

## Resources

- [MiniMax Platform](https://platform.minimaxi.com/)
- [API Documentation](https://platform.minimaxi.com/document/Guides)
- [Discord Community](https://discord.com/invite/hvvt8hAye6)

## License

This is an exploratory research project for testing MiniMax models.
