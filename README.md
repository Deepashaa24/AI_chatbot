# 🤖 AI Chatbot - Multilingual Assistant

A friendly, intelligent AI chatbot web application powered by Google Gemini API. Supports **8 languages** including English, Hindi, Hinglish, Spanish, French, German, Arabic, and Chinese with automatic language detection and maintains conversation context.

## ✨ Features

- 🌐 **Multilingual Support**: Automatically detects and responds in 8 languages (English, Hindi, Hinglish, Spanish, French, German, Arabic, Chinese)
- 💬 **Conversation Context**: Maintains chat history for natural follow-up questions
- 🎨 **Modern UI**: Beautiful, responsive chat interface with smooth animations
- ⚡ **Real-time Responses**: Fast API responses with typing indicators
- 🛡️ **Session Management**: Each user gets isolated conversation sessions
- 🎯 **Multi-Topic Support**: Fashion, lifestyle, medical advice, math problems, and general assistance
- 🏥 **Medical Advice**: Provides general health guidance with reminders to consult professionals
- 🔢 **Math Problem Solver**: Solves math problems with step-by-step explanations
- 🎤 **Voice Input**: Speak your messages instead of typing (browser speech recognition)
- 📎 **File Upload**: Upload and analyze images and documents (like Gemini!)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd AI_chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create or sign in to your Google account
   - Generate a new API key

4. **Configure environment variables**
   - Open the `.env` file
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     PORT=3000
     SESSION_SECRET=your_secret_key_change_this_in_production
     ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Start chatting with your AI assistant!

## 📁 Project Structure

```
AI_chatbot/
├── .github/
│   └── copilot-instructions.md
├── public/
│   ├── index.html          # Chat interface
│   ├── styles.css          # Styling
│   └── script.js           # Frontend logic
├── routes/
│   └── chatbot.js          # API routes
├── services/
│   └── chatbot.js          # Gemini AI integration & logic
├── .env                    # Environment variables (not committed)
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── README.md
└── server.js               # Express server setup
```

## 🔧 API Endpoints

### POST `/api/chat`
Send a message and receive AI response

**Request:**
```json
{
  "message": "Hello! How are you?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! 😊 I'm doing great, thank you for asking! How can I assist you today?",
    "language": "english",
    "sessionId": "session_id_here"
  }
}
```

### DELETE `/api/chat/history`
Clear conversation history for current session

**Response:**
```json
{
  "success": true,
  "message": "Conversation history cleared"
}
```

### GET `/api/health`
Check if the API is running

**Response:**
```json
{
  "status": "ok",
  "message": "AI Chatbot API is running"
}
```

## 🌍 Language Support

The chatbot automatically detects the language of your input:

- **English**: "What are the latest fashion trends?"
- **Hindi**: "नवीनतम फैशन ट्रेंड क्या हैं?"
- **Hinglish**: "Latest fashion trends kya hain?"

## 🎨 Features in Detail

### Voice Input 🎤
Click the microphone button to speak your message instead of typing. The chatbot uses browser speech recognition to convert your speech to text.

**Supported Browsers:**
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Safari
- ❌ Firefox (limited support)

**How to use:**
1. Click the 🎤 microphone button
2. Speak your message clearly
3. The text will appear in the input field
4. Click send or press Enter

### File Upload 📎
Upload images and documents for the AI to analyze, just like Gemini! The chatbot can analyze images, describe content, answer questions about documents, and more.

**Supported File Types:**
- ✅ Images: JPG, PNG, GIF, WebP
- ✅ Documents: PDF, TXT, DOC, DOCX
- ⚠️ Max file size: 5MB

**How to use:**
1. Click the 📎 paperclip button
2. Select an image or document
3. Preview appears below input field
4. Type your question about the file (optional)
5. Click send to analyze

**Example uses:**
- Upload a fashion photo: "What style is this outfit?"
- Upload a math problem screenshot: "Solve this problem"
- Upload a recipe image: "What ingredients do I need?"
- Upload a medical report: "Explain this in simple terms"

### Automatic Language Detection
The chatbot analyzes your message and determines whether you're using English, Hindi (Devanagari script), or Hinglish (Hindi in Latin script), then responds in the same language.

### Conversation Context
The system maintains the last 10 exchanges in memory, allowing for natural follow-up questions and contextual responses.

### Friendly Responses
- Concise (1-3 sentences)
- Human-like tone
- Appropriate emojis
- Practical suggestions
- Follow-up action prompts

## 🛠️ Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-reload)

### Technologies Used

- **Backend**: Node.js, Express.js
- **AI**: Google Gemini API (@google/generative-ai)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Session Management**: express-session
- **Environment**: dotenv

## 📝 Customization

### Modifying Chatbot Behavior

Edit `services/chatbot.js` to customize:
- System prompts for different languages
- Response style and tone
- Conversation history length
- Language detection logic

### Styling

Edit `public/styles.css` to customize:
- Color scheme
- Layout
- Animations
- Responsive breakpoints

## 🔒 Security Notes

- Never commit your `.env` file with actual API keys
- Change the `SESSION_SECRET` in production
- Use HTTPS in production (set `cookie: { secure: true }`)
- Implement rate limiting for production use
- Validate and sanitize user inputs

## 🐛 Troubleshooting

### "API key not found" error
- Make sure you've added your Gemini API key to the `.env` file
- Verify the key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Server won't start
- Check if port 3000 is already in use
- Try changing the PORT in `.env` file
- Verify all dependencies are installed with `npm install`

### No response from chatbot
- Check your internet connection
- Verify API key is correct
- Check browser console for errors
- Ensure the backend server is running

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Made with ❤️ using Node.js, Express.js, and Google Gemini API**
# AI_chatbot
