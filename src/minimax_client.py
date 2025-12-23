"""
MiniMax Client Wrapper

A thin wrapper around the OpenAI SDK for interacting with MiniMax models.
"""

import os
from typing import Generator, Optional

from dotenv import load_dotenv
from openai import OpenAI


class MiniMaxClient:
    """Client for interacting with MiniMax API using OpenAI-compatible interface."""

    DEFAULT_BASE_URL = "https://api.minimax.io/v1"
    DEFAULT_MODEL = "MiniMax-M2.1"

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ):
        """
        Initialize the MiniMax client.

        Args:
            api_key: MiniMax API key. If not provided, reads from MINIMAX_API_KEY env var.
            base_url: API base URL. Defaults to https://api.minimaxi.com/v1
            model: Default model to use. Defaults to MiniMax-M2.1
        """
        # Load environment variables from .env file
        load_dotenv()

        self.api_key = api_key or os.getenv("MINIMAX_API_KEY")
        if not self.api_key:
            raise ValueError(
                "API key is required. Set MINIMAX_API_KEY environment variable "
                "or pass api_key parameter."
            )

        self.base_url = base_url or os.getenv("MINIMAX_BASE_URL", self.DEFAULT_BASE_URL)
        self.model = model or os.getenv("MINIMAX_MODEL", self.DEFAULT_MODEL)

        # Initialize OpenAI client with MiniMax configuration
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

    def chat(
        self,
        messages: list[dict],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        top_p: float = 0.95,
        stream: bool = False,
        **kwargs,
    ):
        """
        Send a chat completion request.

        Args:
            messages: List of message dicts with 'role' and 'content' keys.
            model: Model to use. Defaults to instance model.
            temperature: Sampling temperature (0-1). Higher = more random.
            max_tokens: Maximum tokens to generate.
            top_p: Nucleus sampling parameter.
            stream: Whether to stream the response.
            **kwargs: Additional parameters to pass to the API.

        Returns:
            Chat completion response or stream iterator.
        """
        return self.client.chat.completions.create(
            model=model or self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            stream=stream,
            **kwargs,
        )

    def simple_chat(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        **kwargs,
    ) -> str:
        """
        Simple single-turn chat helper.

        Args:
            prompt: User prompt/question.
            system_prompt: Optional system prompt.
            **kwargs: Additional parameters for chat().

        Returns:
            Model response as string.
        """
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = self.chat(messages, **kwargs)
        return response.choices[0].message.content

    def stream_chat(
        self,
        messages: list[dict],
        **kwargs,
    ) -> Generator[str, None, None]:
        """
        Stream chat completion response.

        Args:
            messages: List of message dicts.
            **kwargs: Additional parameters for chat().

        Yields:
            Content chunks as they arrive.
        """
        response = self.chat(messages, stream=True, **kwargs)
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

    def print_stream(
        self,
        messages: list[dict],
        **kwargs,
    ) -> str:
        """
        Stream and print chat response in real-time.

        Args:
            messages: List of message dicts.
            **kwargs: Additional parameters for chat().

        Returns:
            Complete response as string.
        """
        full_response = ""
        for chunk in self.stream_chat(messages, **kwargs):
            print(chunk, end="", flush=True)
            full_response += chunk
        print()  # Final newline
        return full_response

    def test_connection(self) -> bool:
        """
        Test API connection with a simple request.

        Returns:
            True if connection successful, raises exception otherwise.
        """
        try:
            response = self.simple_chat("Say 'Hello' in one word.", max_tokens=10)
            print(f"✓ Connection successful! Response: {response}")
            return True
        except Exception as e:
            print(f"✗ Connection failed: {e}")
            raise


# Convenience function for quick usage
def get_client(**kwargs) -> MiniMaxClient:
    """Get a configured MiniMax client instance."""
    return MiniMaxClient(**kwargs)
