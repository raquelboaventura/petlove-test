# 🐾 Flask Chatbot - Teste Técnico Petlove


Este projeto é um **backend em Flask** que fornece uma API para integração com um serviço de IA. Ele inclui uma estrutura organizada com diretórios para templates e arquivos estáticos.

---

## ⚙️ Configuração do Ambiente

1. **Ative o ambiente virtual (se ainda não estiver ativo):**

   ```bash
   venv\Scripts\activate
   ```

2. **Defina a variável de ambiente do Flask:**

   ```powershell
   $env:FLASK_APP = "run.py"
   ```

   *(Se estiver usando Linux/Mac, use:)*

   ```bash
   export FLASK_APP=run.py
   ```

 3. **Configure o arquivo .env**

    Crie um arquivo .env na raiz do projeto e adicione sua chave da API Gemini:
    ```
    GEMINI_API_KEY=chave_aqui
    ```

4. **Execute o servidor Flask:**

   ```bash
   flask run
   ```

---

## 🌐 Estrutura do Flask

* ``: Ponto de entrada principal da aplicação.
* ``: Contém os arquivos HTML (frontend).
* ``: Contém CSS, JS e imagens.
* ``: Implementações de serviços e integrações (ex: IA Gemini).

---

## 🧠 API - Exemplo de Endpoint

### **POST /api/question-and-answer**

#### Exemplo de requisição:

```json
{
  "session_id": "123",
  "message": "qual a melhor ração para golden?"
}
```

#### Exemplo de resposta:

```json
{
  "response": "Escolher a melhor ração para um Golden Retriever envolve considerar a qualidade dos ingredientes, as necessidades nutricionais e as preferências individuais do cão."
}
```

---

## ✅ Verificação

Após rodar `flask run`, acesse:

```
http://127.0.0.1:5000/
```

E verifique se o `index.html` é carregado corretamente.

---

## 💡 Observações

* Projeto desenvolvido em **Python 3.11+**
* Framework utilizado: **Flask 3.1.2**
* Dependências podem ser instaladas via:

  ```bash
  pip install -r requirements.txt
  ```

---

> Desenvolvido por **Raquel Boaventura** para o **Teste Técnico Petlove** 🐶
