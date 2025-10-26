from flask import Flask, jsonify, render_template, request
from app.service.ai_service import GeminiChatService
from google.genai.errors import APIError


app = Flask(__name__, template_folder="app/templates", static_folder="app/static")
chat_sessions = {}

@app.route('/')
def home():
     render_template('index.html')

@app.route('/api/question-and-answer', methods=['POST'])
def send_message():
    """Envia mensagens para a IA conforme o session_id recebido

    Returns:
        response: retorna a resposta com base no contexto da conversa, considerando o session_id
    """
    try:
        data = request.get_json()
        session_id = data["session_id"]
        message = data["message"]

        if session_id not in chat_sessions:
            chat_sessions[session_id] = GeminiChatService()

        chat = chat_sessions[session_id]
        reply = chat.send_message(message)
        return jsonify({"response": reply}), 200

    except (KeyError, TypeError) as e:
        error_message = f"Dados de entrada inválidos ou ausentes: {e}. Certifique-se de que o JSON contenha 'session_id' e 'message'."
        return jsonify({"error": error_message, "type": "InvalidInputError"}), 400

    except APIError as e: 
        error_message = (f"ERRO 500 - API Gemini Falhou: {e}")
        return jsonify({"error": error_message, "type": "GeminiAPIError"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
