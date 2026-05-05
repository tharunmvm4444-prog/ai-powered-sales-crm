import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatInterface.css';

const API_KEY = "AIzaSyDd6w70Mxl5mFBZKvLNNmG7YYGVunUgneg";
console.log("Gemini API Key:", API_KEY);

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            content: "Hello! I'm your AI assistant. How can I help you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatSessionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initializeChat = async () => {
        if (!API_KEY) return;
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            chatSessionRef.current = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "Hello" }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Hello! I'm your AI assistant. How can I help you today?" }],
                    },
                ],
            });
        } catch (error) {
            console.error("Error initializing chat:", error);
        }
    };

    useEffect(() => {
        if (API_KEY) {
            initializeChat();
        } else {
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'bot',
                content: "⚠️ Missing API Key. Please add VITE_GEMINI_API_KEY to your .env file to start chatting."
            }]);
        }
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!API_KEY) {
            alert("Please set your Gemini API Key in .env file!");
            return;
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatSessionRef.current) {
                await initializeChat();
            }

            const result = await chatSessionRef.current.sendMessage(input);
            const response = await result.response;
            const text = response.text();

            const botMessage = {
                id: Date.now() + 1,
                role: 'bot',
                content: text
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'bot',
                content: `Error: ${error.message || "Something went wrong with the API."}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSend(e);
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1>
                    <div className="status-indicator"></div>
                    AI Assistant
                </h1>

            </header>

            <div className="messages-area">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.role}`}>
                        <div className="avatar">
                            {msg.role === 'user' ? '👤' : '✨'}
                        </div>
                        <div className="message-content">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot">
                        <div className="avatar">✨</div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                <textarea
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                />
                <button
                    className="send-button"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                >
                    {isLoading ? '...' : '➤'}
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
