import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Bot,
  User,
  Sparkles,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Zap,
  RotateCcw
} from "lucide-react";
import { aiConversations } from "../data/mockData";
import { toast } from "sonner";

const AIChat = () => {
  const [messages, setMessages] = useState(aiConversations);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState("general"); // general, quiz, explanation
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateAIResponse = (userMessage) => {
    const responses = {
      general: [
        "That's a fascinating question about gene editing! Let me break it down for you. Gene editing technologies like CRISPR work by making precise changes to DNA sequences. Would you like me to explain any specific aspect in more detail?",
        "Great question! In the context of climate adaptation, genetic modifications can help organisms survive in changing environments. For example, we can engineer drought-resistant crops by enhancing water retention mechanisms. What specific application interests you most?",
        "Excellent point! The ethical considerations around genetic engineering are complex. We need to balance scientific advancement with safety, equity, and environmental impact. What's your perspective on this?"
      ],
      quiz: [
        "Let me test your understanding! Which of these is the main function of guide RNA in CRISPR? A) Cut DNA B) Guide Cas9 to target location C) Repair DNA D) Create mutations",
        "Quiz time! What percentage of the human genome is shared with chimpanzees? A) 80% B) 90% C) 98.8% D) 95%",
        "Challenge question: Which climate adaptation strategy would be most effective for rice cultivation in rising sea levels? A) Salt tolerance B) Drought resistance C) Heat tolerance D) Pest resistance"
      ],
      explanation: [
        "Let me explain this step by step. CRISPR-Cas9 works like molecular scissors guided by GPS. The guide RNA acts as the GPS, finding the exact location in the genome, while Cas9 acts as the scissors, making the cut. Then the cell's repair mechanisms fix the cut, often incorporating new genetic material.",
        "Think of genetic adaptation like this: imagine organisms as houses that need renovation for climate change. Some houses (organisms) need better insulation (heat resistance), others need better drainage (flood resistance), and some need both. Genetic engineering gives us the tools to make these 'renovations' at the molecular level.",
        "The relationship between genes and traits is like a recipe. Genes are the ingredients list, but the final dish (trait) depends on how the ingredients interact, the cooking method (environment), and even what other dishes are being made at the same time (other genes). This is why genetic engineering is both powerful and complex."
      ]
    };

    const modeResponses = responses[chatMode] || responses.general;
    return modeResponses[Math.floor(Math.random() * modeResponses.length)];
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      message: currentMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        message: simulateAIResponse(currentMessage),
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Add XP notification occasionally
      if (Math.random() > 0.7) {
        setTimeout(() => {
          toast.success("Great question! You earned 5 XP for active learning! 🎯");
        }, 1000);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      message: "Hi! I'm your AI biology tutor. I can help explain gene editing concepts, discuss ethical dilemmas, or quiz you on genetics. What would you like to explore today?",
      sender: "ai",
      timestamp: new Date().toISOString()
    }]);
    toast.success("Chat cleared! Ready for a fresh conversation! 🤖");
  };

  const quickPrompts = [
    { text: "Explain CRISPR", icon: <BookOpen className="h-4 w-4" />, mode: "explanation" },
    { text: "Quiz me", icon: <HelpCircle className="h-4 w-4" />, mode: "quiz" },
    { text: "Climate adaptation", icon: <Lightbulb className="h-4 w-4" />, mode: "explanation" },
    { text: "Ethics discussion", icon: <Sparkles className="h-4 w-4" />, mode: "general" }
  ];

  const handleQuickPrompt = (prompt) => {
    setChatMode(prompt.mode);
    setCurrentMessage(prompt.text);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Discussion Buddy
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Get instant help with genetics concepts, ethical dilemmas, and scientific discussions
          </p>
        </div>

        {/* Chat Mode & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Mode:</span>
            <Badge 
              variant={chatMode === "general" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setChatMode("general")}
            >
              General Chat
            </Badge>
            <Badge 
              variant={chatMode === "quiz" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setChatMode("quiz")}
            >
              Quiz Mode
            </Badge>
            <Badge 
              variant={chatMode === "explanation" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setChatMode("explanation")}
            >
              Explanations
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur h-[700px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Gene Editing Tutor
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={msg.sender === "user" ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}>
                        {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[80%]">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl px-4 py-3 bg-gray-100">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            
            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about gene editing, ethics, or climate adaptation..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isTyping}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Prompts */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Quick Starters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-gray-50"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt.icon}
                  {prompt.text}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                I Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Explain complex concepts</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Quiz your knowledge</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Discuss ethical dilemmas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Provide study tips</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Tips */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>💡 Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Ask specific questions for better explanations</p>
                <p>• Request examples to understand concepts</p>
                <p>• Challenge yourself with quiz mode</p>
                <p>• Discuss real-world applications</p>
                <p>• Explore ethical implications</p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Stats */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Chat Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Messages:</span>
                  <span className="text-sm font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Questions Asked:</span>
                  <span className="text-sm font-medium">{messages.filter(m => m.sender === "user").length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <Badge variant="outline" className="text-xs">
                    {chatMode.charAt(0).toUpperCase() + chatMode.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIChat;