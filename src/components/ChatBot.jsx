import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Bot, User, Settings, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    if (!apiKey) {
      alert('Please set your Google Gemini API key first');
      setShowSettings(true);
      return;
    }

    const userMessage = { id: Date.now(), text: newMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: newMessage }] }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.candidates[0].content.parts[0].text,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please check your API key and try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[500px] sm:h-[600px] bg-white rounded-2xl border border-gray-200 shadow-xl flex flex-col">
      {/* Header */}
      <Card className="border-0 shadow-none rounded-none">
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-2xl text-black">AI Chat Assistant</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Powered by Google Gemini</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="border-0 shadow-none rounded-none bg-gray-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Google Gemini API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="text-sm sm:text-base"
                />
              </div>
              <Button onClick={saveApiKey} className="px-4 py-2.5 sm:py-2">
                Save
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Get your API key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Google AI Studio</a>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">Start a conversation</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Ask me anything, I'm here to help!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-black text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-1 sm:space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    {message.sender === 'user' ? (
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : message.isError ? (
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-75 ${
                      message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-lg max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <Card className="border-0 shadow-none rounded-none">
        <CardContent className="p-4 sm:p-6 pt-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none text-sm sm:text-base"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !newMessage.trim()}
              className="px-4 sm:px-6 py-2.5 sm:py-3"
            >
              <Send className="w-5 h-5 mr-2" />
              <span className="text-sm sm:text-base">Send</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
            Press Enter to send, Shift+Enter for new line
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;