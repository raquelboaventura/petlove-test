import os
from google import genai
from dotenv import load_dotenv

class GeminiChatService:
    """
    Classe de inicialização do chat e configuração da IA da Petlove.
    """
    def __init__(self):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            raise ValueError("Chave GEMINI_API_KEY não encontrada nas variáveis de ambiente.")

        try:
            self.client = genai.Client(api_key=api_key)
            self.chat = self.client.chats.create(
                model="gemini-2.5-flash",
            )
        except Exception as e:
            raise RuntimeError(f"Falha na inicialização do serviço Gemini: {e}") from e

    def send_message(self, message: str) -> str:
        """
        Envia uma mensagem ao chat. Erros da API (como cota ou prompt bloqueado) 
        são propagados como google.genai.errors.APIError.
        """
        response = self.chat.send_message(message)
        return response.text
