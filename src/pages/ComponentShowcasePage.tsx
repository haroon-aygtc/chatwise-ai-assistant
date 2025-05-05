
import React, { useState } from 'react';
import { ChatWindow } from "@/components/chat/ChatWindow";
import { FormField } from "@/components/ui/form-field";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { Mail, User, Lock } from 'lucide-react';
import { Session } from "@/types/chat";

const ComponentShowcasePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('US');

  // Mock session for ChatWindow
  const mockSession: Session = {
    id: "session_1",
    name: "John Doe",
    email: "john@example.com",
    isAiActive: true,
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    status: "active",
    unreadCount: 0
  };

  const handlePhoneChange = (value: string, code: string) => {
    setPhone(value);
    setCountryCode(code);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Component Showcase</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Form Components</h2>
            <div className="bg-card p-6 rounded-lg shadow">
              <div className="space-y-4">
                <FormField
                  id="name"
                  label="Full Name"
                  value={name}
                  onChange={setName}
                  placeholder="Enter your full name"
                  icon={<User className="h-4 w-4" />}
                />
                
                <FormField
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="your.email@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />
                
                <FormField
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                />
                
                <PhoneInput
                  id="phone"
                  label="Phone Number"
                  value={phone}
                  countryCode={countryCode}
                  onChange={handlePhoneChange}
                />
                
                <Button className="w-full">Submit Form</Button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Chat Components</h2>
          <div className="h-[600px] rounded-lg overflow-hidden border">
            <ChatWindow 
              session={mockSession}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcasePage;
