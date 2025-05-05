import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Settings,
  User,
} from "lucide-react";

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  secondaryColor?: string;
  botName?: string;
  welcomeMessage?: string;
  logoUrl?: string;
}

const ChatWidget = ({
  position = "bottom-right",
  primaryColor = "hsl(var(--primary))",
  secondaryColor = "hsl(var(--secondary))",
  botName = "AI Assistant",
  welcomeMessage = "Hello! How can I help you today?",
  logoUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=chat-bot",
}: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: welcomeMessage, sender: "bot", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thank you for your message. This is a simulated response from the AI assistant.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleRegister = () => {
    // In a real implementation, this would validate and submit the form
    setIsRegistered(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`rounded-full h-14 w-14 shadow-lg flex items-center justify-center ${positionClasses[position]} fixed z-50`}
        style={{ backgroundColor: primaryColor }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed ${positionClasses[position]} z-50 w-80 sm:w-96 h-[500px] flex flex-col shadow-xl rounded-lg overflow-hidden bg-background`}
    >
      {/* Header */}
      <div
        className="p-4 flex justify-between items-center"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <div className="flex items-center gap-2">
          <Avatar>
            <img src={logoUrl} alt={botName} />
          </Avatar>
          <div>
            <h3 className="font-medium">{botName}</h3>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
        {!isRegistered ? (
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2">Please register to continue</h4>
            <div className="space-y-3">
              <Input
                placeholder="Full Name *"
                value={userInfo.name}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
              />
              <Input
                placeholder="Email"
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone Number *"
                type="tel"
                value={userInfo.phone}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, phone: e.target.value })
                }
              />
              <Button
                className="w-full"
                onClick={handleRegister}
                disabled={!userInfo.name || !userInfo.phone}
              >
                Start Chatting
              </Button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex gap-2 max-w-[80%]">
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <img src={logoUrl} alt={botName} />
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      }`}
                    >
                      {message.text}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <img src={logoUrl} alt={botName} />
                  </Avatar>
                  <div className="bg-card rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      {isRegistered && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatWidget;
