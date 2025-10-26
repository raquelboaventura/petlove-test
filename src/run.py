from flask import Flask, jsonify, render_template, request
from app.service.ai_service import GeminiChatService
from google.genai.errors import APIError


app = Flask(__name__, template_folder="app/templates", static_folder="app/static")
chat_sessions = {}

@app.route('/')
def home():
    return "Hello, World!"
