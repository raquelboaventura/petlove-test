// Variável global para armazenar o ID da sessão
let SESSION_ID = null;

document.addEventListener('DOMContentLoaded', () => {
const chatbox = document.getElementById('chatbox');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const sessionDisplay = document.getElementById('session-display');
const loadingIndicator = document.getElementById('loading-indicator');
const submitButton = document.getElementById('submit-button');

// --- 1. Geração do Session ID ---
function initializeSession() {
    SESSION_ID = crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.floor(Math.random() * 99999)}`;
    
    sessionDisplay.textContent = `Sessão ID: ${SESSION_ID.substring(0, 8)}...`;
    
    const initialMessage = chatbox.querySelector('.bot-message p');
    if (initialMessage) {
            initialMessage.textContent = 'Olá! Sua sessão foi iniciada. Como posso te ajudar?';
    }
}

function toggleLoading(show) {
        if (show) {
            // garante que o indicador esteja visível e sempre como último filho do chatbox
            loadingIndicator.classList.remove('hidden');
            submitButton.disabled = true;
            userInput.disabled = true;

            if (!chatbox.contains(loadingIndicator)) {
                chatbox.appendChild(loadingIndicator);
            } else {
                // move para o final caso já exista
                chatbox.appendChild(loadingIndicator);
            }

            // rola até o fim para mostrar o indicador
            chatbox.scrollTop = chatbox.scrollHeight;
        } else {
            loadingIndicator.classList.add('hidden');
            submitButton.disabled = false;
            userInput.disabled = false;
        }
    }

function markdownToHtml(markdownText) {
    let html = markdownText;

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\n\n/g, '</p><p>');

    const listPattern = /^\s*[\*-]\s+(.*)$/gm;
    if (listPattern.test(html)) {
        
        let inList = false;
        const lines = html.split('\n');
        let processedHtml = '';

        lines.forEach(line => {
            const trimmedLine = line.trim();
            const listItemMatch = trimmedLine.match(/^[\*-]\s+(.*)$/);
            
            if (listItemMatch) {
                if (!inList) {
                    processedHtml += '<ul>';
                    inList = true;
                }
                const content = listItemMatch[1].trim();
                processedHtml += `<li>${content}</li>`;
            } else {
                if (inList) {
                    processedHtml += '</ul>';
                    inList = false;
                }
                // Adicionar parágrafo (aplica o negrito já convertido)
                if (line.trim().length > 0) {
                        processedHtml += `<p>${line.trim()}</p>`;
                }
            }
        });

        if (inList) {
            processedHtml += '</ul>';
        }
        html = processedHtml;
    } else {
        html = `<p>${html}</p>`;
    }

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-petlove-main hover:underline font-medium">$1</a>');
    
    return html;
}

// --- 2. Função Utilizada para Adicionar Mensagens ---
function addMessage(rawMessage, sender) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', 'flex', sender === 'user' ? 'justify-end' : 'justify-start');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'p-3', 'max-w-[85%]', 'shadow-md', 'transition', 'duration-300');

    if (sender === 'user') {
        messageDiv.classList.add('user-message', ...['bg-petlove-main', 'text-white', 'rounded-xl', 'rounded-tr-sm']);
    } else {
        messageDiv.classList.add('bot-message', ...['bg-gray-100', 'text-gray-800', 'rounded-xl', 'rounded-bl-sm']);
    }

    messageDiv.innerHTML = markdownToHtml(rawMessage);
    
    messageContainer.appendChild(messageDiv);
    chatbox.appendChild(messageContainer);

    chatbox.scrollTop = chatbox.scrollHeight;
}

// --- 3. Função Assíncrona para Chamar a API ---
async function sendMessageToAPI(message) {
    toggleLoading(true);
    try {
        const response = await fetch('http://127.0.0.1:3000/api/question-and-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Prepara o payload JSON com o session_id e a mensagem
            body: JSON.stringify({
                session_id: SESSION_ID,
                message: message
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Erro do servidor (${response.status}): ${errorData.error || 'Falha na comunicação com a API.'}`);
        }
        const data = await response.json();
        toggleLoading(false);
        addMessage(data.response || 'Desculpe, não recebi uma resposta válida.', 'bot');
    } catch (error) {
        console.error('Erro na chamada da API:', error);
        addMessage(`Ocorreu um erro: ${error.message}. Verifique se seu servidor Flask está rodando.`, 'bot');
    } finally {
        toggleLoading(false);
        userInput.focus(); 
    }
}

// --- 4. Evento de Submissão do Formulário ---
inputForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const userMessage = userInput.value.trim();
    if (userMessage === '') {
        return;
    }
    // 1. Adiciona a mensagem do usuário
    addMessage(userMessage, 'user');
    // 2. Chama a API
    sendMessageToAPI(userMessage);
    // 3. Limpa o campo
    userInput.value = '';
});

// Inicia a sessão quando a página carrega
initializeSession();
});