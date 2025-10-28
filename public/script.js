const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const voiceBtn = document.getElementById('voiceBtn');
const micIcon = document.getElementById('micIcon');
const listeningIcon = document.getElementById('listeningIcon');
const fileBtn = document.getElementById('fileBtn');
const fileInput = document.getElementById('fileInput');
const languageSelect = document.getElementById('languageSelect');

// File handling
let selectedFile = null;

// Selected language (default is auto-detect)
let selectedLanguage = 'auto';

// Suggested prompts click handler
document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        userInput.value = prompt;
        userInput.focus();
        sendMessage();
    });
});

// Language selector change event
languageSelect.addEventListener('change', (e) => {
    selectedLanguage = e.target.value;
    
    // Update speech recognition language
    if (recognition) {
        const langCodes = {
            english: 'en-US',
            hindi: 'hi-IN',
            hinglish: 'hi-IN',
            spanish: 'es-ES',
            french: 'fr-FR',
            german: 'de-DE',
            arabic: 'ar-SA',
            chinese: 'zh-CN',
            auto: 'en-US'
        };
        recognition.lang = langCodes[selectedLanguage] || 'en-US';
    }
});

// Handle Enter key to send message
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initialize Speech Recognition
let recognition = null;
let isListening = false;

// Check if browser supports speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // Support multiple languages
    recognition.lang = 'en-US';
    
    // Handle recognition results
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        userInput.focus();
    };
    
    // Handle recognition end
    recognition.onend = () => {
        stopListening();
    };
    
    // Handle recognition errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
        
        if (event.error === 'no-speech') {
            addBotMessage('No speech detected. Please try again. 🎤');
        } else if (event.error === 'not-allowed') {
            addBotMessage('Microphone access denied. Please allow microphone permissions. 🎤');
        } else {
            addBotMessage('Voice input error. Please try again or type your message. 😔');
        }
    };
} else {
    if (voiceBtn) {
        voiceBtn.style.display = 'none';
    }
}

// Start listening
function startListening() {
    if (!recognition) {
        addBotMessage('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari. 😔');
        return;
    }
    
    try {
        isListening = true;
        voiceBtn.classList.add('listening');
        micIcon.classList.add('hidden');
        listeningIcon.classList.remove('hidden');
        
        recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopListening();
    }
}

// Stop listening
function stopListening() {
    isListening = false;
    voiceBtn.classList.remove('listening');
    micIcon.classList.remove('hidden');
    listeningIcon.classList.add('hidden');
}

// File handling functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        addBotMessage('File is too large! Please select a file under 5MB. 📁');
        return;
    }
    
    selectedFile = file;
    showFilePreview(file);
}

function showFilePreview(file) {
    filePreview.classList.remove('hidden');
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const isImage = file.type.startsWith('image/');
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';
        
        filePreview.innerHTML = `<div class="file-preview-item">${isImage ? `<img src="${e.target.result}" alt="Preview">` : '<span style="font-size: 30px;">📄</span>'}<div class="file-info"><div class="file-name">${file.name}</div><div class="file-size">${fileSize}</div></div><button class="remove-file" onclick="removeFile()">✕</button></div>`;
    };
    
    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else {
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';
        filePreview.innerHTML = `<div class="file-preview-item"><span style="font-size: 30px;">📄</span><div class="file-info"><div class="file-name">${file.name}</div><div class="file-size">${fileSize}</div></div><button class="remove-file" onclick="removeFile()">✕</button></div>`;
    }
}

function removeFile() {
    selectedFile = null;
    filePreview.classList.add('hidden');
    filePreview.innerHTML = '';
    fileInput.value = '';
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function addUserMessage(message, hasFile = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    let fileIndicator = '';
    if (hasFile) {
        fileIndicator = '<span style="font-size: 12px; opacity: 0.8;">📎 File attached</span><br>';
    }
    
    messageDiv.innerHTML = `<div class="message-content">${fileIndicator}<p>${escapeHtml(message)}</p></div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<div class="message-content"><p>${escapeHtml(message)}</p></div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main send message function
async function sendMessage() {
    const message = userInput.value.trim();
    const hasFile = selectedFile !== null;
    
    if (!message && !hasFile) return;

    addUserMessage(message || '(Analyzing file...)', hasFile);
    userInput.value = '';

    userInput.disabled = true;

    showTypingIndicator();

    try {
        let requestBody = { 
            message: message || 'Analyze this file',
            language: selectedLanguage !== 'auto' ? selectedLanguage : undefined
        };
        
        if (selectedFile) {
            const base64Data = await fileToBase64(selectedFile);
            requestBody.file = {
                data: base64Data,
                mimeType: selectedFile.type,
                name: selectedFile.name
            };
        }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.success) {
            if (hasFile) {
                removeFile();
            }
            
            removeTypingIndicator();
            addBotMessage(data.data.response);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addBotMessage('Sorry, I encountered an error. Please try again. 😔');
    } finally {
        userInput.disabled = false;
        userInput.focus();
    }
}

async function clearChatHistory() {
    try {
        const response = await fetch('/api/chat/history', {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            chatMessages.innerHTML = `<div class="message bot-message"><div class="message-content"><p>👋 Hello! I can help with fashion, lifestyle, medical advice, math problems, and more!</p></div></div>`;
        }
    } catch (error) {
        console.error('Error clearing history:', error);
        addBotMessage('Failed to clear chat history. Please try again.');
    }
}

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
        clearChatHistory();
    }
});

if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            stopListening();
        } else {
            startListening();
        }
    });
}

if (fileBtn) {
    fileBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
}

userInput.focus();
