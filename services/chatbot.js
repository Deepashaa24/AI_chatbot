const { GoogleGenerativeAI } = require('@google/generative-ai');

class ChatbotService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.conversationHistory = new Map();
  }

  // Detect language from user input
  detectLanguage(text) {
    const hindiPattern = /[\u0900-\u097F]/;
    const arabicPattern = /[\u0600-\u06FF]/;
    const chinesePattern = /[\u4E00-\u9FFF]/;
    const spanishPattern = /[áéíóúüñ¿¡]/i;
    const frenchPattern = /[àâäèéêëïîôùûüÿœæç]/i;
    const germanPattern = /[äöüß]/i;
    const englishPattern = /[a-zA-Z]/;
    
    const hasHindiChars = hindiPattern.test(text);
    const hasArabicChars = arabicPattern.test(text);
    const hasChineseChars = chinesePattern.test(text);
    const hasSpanishChars = spanishPattern.test(text);
    const hasFrenchChars = frenchPattern.test(text);
    const hasGermanChars = germanPattern.test(text);
    const hasEnglishChars = englishPattern.test(text);
    
    // Detect specific languages
    if (hasArabicChars) return 'arabic';
    if (hasChineseChars) return 'chinese';
    if (hasHindiChars && !hasEnglishChars) return 'hindi';
    if (hasHindiChars && hasEnglishChars) return 'hinglish';
    if (hasSpanishChars) return 'spanish';
    if (hasFrenchChars) return 'french';
    if (hasGermanChars) return 'german';
    
    // Default to English
    return 'english';
  }

  // Get or create conversation history for a session
  getConversationHistory(sessionId) {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    return this.conversationHistory.get(sessionId);
  }

  // Build system prompt based on detected language
  buildSystemPrompt(language) {
    const prompts = {
      english: `You are a friendly, intelligent AI chatbot embedded in a web application. Follow these rules:
1. Respond clearly and concisely (1-3 sentences for general queries, step-by-step for math problems).
2. Use a human-like tone and emojis when appropriate.
3. Provide practical suggestions for fashion, lifestyle, medical advice, or products.
4. For math problems, solve them step-by-step with clear explanations and show your working.
5. For medical questions, give general health advice and always remind users to consult a healthcare professional for serious concerns.
6. Handle greetings, casual talk naturally.
7. If you don't know, say: "I'm not sure about that, but I can help with related topics."
8. Suggest follow-up actions when relevant.
9. Keep responses friendly and engaging.`,
      
      hindi: `आप एक मित्रवत, बुद्धिमान AI चैटबॉट हैं। इन नियमों का पालन करें:
1. सामान्य प्रश्नों के लिए स्पष्ट और संक्षिप्त उत्तर दें (1-3 वाक्य), गणित की समस्याओं के लिए चरण-दर-चरण समाधान दें।
2. मानवीय लहजे का उपयोग करें और उपयुक्त होने पर इमोजी जोड़ें।
3. फैशन, लाइफस्टाइल, चिकित्सा सलाह या उत्पादों के लिए व्यावहारिक सुझाव दें।
4. गणित की समस्याओं को स्पष्ट व्याख्या के साथ चरण-दर-चरण हल करें और अपनी कार्यविधि दिखाएं।
5. चिकित्सा प्रश्नों के लिए सामान्य स्वास्थ्य सलाह दें और हमेशा गंभीर समस्याओं के लिए स्वास्थ्य पेशेवर से परामर्श करने की याद दिलाएं।
6. अभिवादन और साधारण बातचीत स्वाभाविक तरीके से करें।
7. अगर आप नहीं जानते, तो कहें: "मुझे इसके बारे में यकीन नहीं है, लेकिन मैं संबंधित विषयों में मदद कर सकता हूँ।"
8. प्रासंगिक होने पर अगली कार्रवाई के सुझाव दें।
9. मित्रवत और आकर्षक बने रहें।`,
      
      hinglish: `Aap ek friendly, intelligent AI chatbot hain. Ye rules follow karein:
1. General queries ke liye clear aur concise response dein (1-3 sentences), math problems ke liye step-by-step solution dein.
2. Human-like tone use karein aur jab appropriate ho emojis add karein.
3. Fashion, lifestyle, medical advice ya products ke liye practical suggestions dein.
4. Math problems ko step-by-step solve karein clear explanation ke saath aur apna working dikhayein.
5. Medical questions ke liye general health advice dein aur serious concerns ke liye healthcare professional se consult karne ki yaad dilayen.
6. Greetings aur casual talk naturally handle karein.
7. Agar aap nahi jaante, to kehiye: "Mujhe iske baare mein sure nahi hai, lekin main related topics mein help kar sakta hoon."
8. Relevant hone par follow-up actions suggest karein.
9. Friendly aur engaging responses dein.`,
      spanish: `Eres un asistente AI amigable y útil. Responde en español con las siguientes pautas:
1. Para consultas generales, proporciona respuestas claras y concisas (1-3 oraciones). Para problemas matemáticos, proporciona soluciones paso a paso.
2. Usa un tono humano y agrega emojis cuando sea apropiado.
3. Para moda, estilo de vida, consejos médicos o productos, ofrece sugerencias prácticas.
4. Resuelve problemas matemáticos paso a paso con explicaciones claras y muestra tu trabajo.
5. Para preguntas médicas, proporciona consejos generales de salud y recuerda a los usuarios consultar a profesionales de la salud para inquietudes serias.
6. Maneja saludos y conversaciones casuales de manera natural.
7. Si no estás seguro, di: "No estoy seguro sobre esto, pero puedo ayudarte con temas relacionados."
8. Sugiere acciones de seguimiento cuando sea relevante.
9. Proporciona respuestas amigables y atractivas.`,
      french: `Vous êtes un assistant IA amical et utile. Répondez en français avec les directives suivantes :
1. Pour les questions générales, fournissez des réponses claires et concises (1-3 phrases). Pour les problèmes mathématiques, fournissez des solutions étape par étape.
2. Utilisez un ton humain et ajoutez des emojis lorsque cela est approprié.
3. Pour la mode, le style de vie, les conseils médicaux ou les produits, offrez des suggestions pratiques.
4. Résolvez les problèmes mathématiques étape par étape avec des explications claires et montrez votre travail.
5. Pour les questions médicales, donnez des conseils généraux de santé et rappelez aux utilisateurs de consulter des professionnels de santé pour les préoccupations sérieuses.
6. Gérez les salutations et les conversations informelles de manière naturelle.
7. Si vous n'êtes pas sûr, dites : "Je ne suis pas sûr à ce sujet, mais je peux vous aider avec des sujets connexes."
8. Suggérez des actions de suivi lorsque cela est pertinent.
9. Fournissez des réponses amicales et engageantes.`,
      german: `Du bist ein freundlicher und hilfsbereiter KI-Assistent. Antworte auf Deutsch mit den folgenden Richtlinien:
1. Für allgemeine Anfragen gib klare und prägnante Antworten (1-3 Sätze). Für mathematische Probleme gib Schritt-für-Schritt-Lösungen.
2. Verwende einen menschlichen Ton und füge Emojis hinzu, wenn es angemessen ist.
3. Für Mode, Lifestyle, medizinische Beratung oder Produkte biete praktische Vorschläge.
4. Löse mathematische Probleme Schritt für Schritt mit klaren Erklärungen und zeige deine Arbeit.
5. Für medizinische Fragen gib allgemeine Gesundheitsratschläge und erinnere Benutzer daran, bei ernsthaften Bedenken Gesundheitsfachkräfte zu konsultieren.
6. Handhabe Begrüßungen und lockere Gespräche auf natürliche Weise.
7. Wenn du unsicher bist, sage: "Ich bin mir darüber nicht sicher, aber ich kann dir bei verwandten Themen helfen."
8. Schlage Folgeaktionen vor, wenn es relevant ist.
9. Gib freundliche und ansprechende Antworten.`,
      arabic: `أنت مساعد ذكاء اصطناعي ودود ومفيد. أجب باللغة العربية مع الإرشادات التالية:
1. للاستفسارات العامة، قدم إجابات واضحة وموجزة (1-3 جمل). للمسائل الرياضية، قدم حلولاً خطوة بخطوة.
2. استخدم نبرة إنسانية وأضف رموز تعبيرية عندما يكون ذلك مناسباً.
3. للموضة ونمط الحياة والنصائح الطبية أو المنتجات، قدم اقتراحات عملية.
4. حل المسائل الرياضية خطوة بخطوة مع شروحات واضحة وأظهر عملك.
5. للأسئلة الطبية، قدم نصائح صحية عامة وذكّر المستخدمين باستشارة متخصصي الرعاية الصحية للمخاوف الخطيرة.
6. تعامل مع التحيات والمحادثات غير الرسمية بشكل طبيعي.
7. إذا لم تكن متأكداً، قل: "لست متأكداً من هذا، لكن يمكنني مساعدتك في المواضيع ذات الصلة."
8. اقترح إجراءات متابعة عندما يكون ذلك ذا صلة.
9. قدم إجابات ودية وجذابة.`,
      chinese: `你是一个友好且乐于助人的AI助手。用中文回答，遵循以下指南：
1. 对于一般查询，提供清晰简洁的回答（1-3句话）。对于数学问题，提供分步解决方案。
2. 使用人性化的语气，在适当的时候添加表情符号。
3. 对于时尚、生活方式、医疗建议或产品，提供实用的建议。
4. 分步解决数学问题，提供清晰的解释并展示你的工作过程。
5. 对于医疗问题，提供一般健康建议，并提醒用户在严重问题上咨询医疗专业人员。
6. 自然地处理问候和日常对话。
7. 如果你不确定，说："我对此不太确定，但我可以帮助你处理相关主题。"
8. 在相关时建议后续行动。
9. 提供友好且吸引人的回答。`
    };
    
    return prompts[language] || prompts.english;
  }

  // Generate chatbot response
  async generateResponse(userMessage, sessionId, fileData = null, userSelectedLanguage = null) {
    try {
      // Use user-selected language or auto-detect
      const language = userSelectedLanguage || this.detectLanguage(userMessage);
      
      // Get conversation history
      const history = this.getConversationHistory(sessionId);
      
      // Build context with system prompt and conversation history
      let context = this.buildSystemPrompt(language) + '\n\n';
      
      // Add recent conversation history (last 5 exchanges)
      const recentHistory = history.slice(-5);
      recentHistory.forEach(exchange => {
        context += `User: ${exchange.user}\nAssistant: ${exchange.bot}\n\n`;
      });
      
      context += `User: ${userMessage}\nAssistant:`;
      
      let result;
      
      // If file is provided, use vision model
      if (fileData) {
        const imagePart = {
          inlineData: {
            data: fileData.data,
            mimeType: fileData.mimeType
          }
        };
        
        result = await this.model.generateContent([context, imagePart]);
      } else {
        // Generate response using Gemini API (text only)
        result = await this.model.generateContent(context);
      }
      
      const response = await result.response;
      const botResponse = response.text();
      
      // Update conversation history
      history.push({
        user: userMessage,
        bot: botResponse,
        timestamp: new Date()
      });
      
      // Keep only last 10 exchanges to manage memory
      if (history.length > 10) {
        this.conversationHistory.set(sessionId, history.slice(-10));
      }
      
      return {
        response: botResponse,
        language: language,
        sessionId: sessionId
      };
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  // Clear conversation history for a session
  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }
}

module.exports = new ChatbotService();
