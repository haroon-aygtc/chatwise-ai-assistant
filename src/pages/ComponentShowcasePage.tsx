
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomFormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { CheckedState } from "@radix-ui/react-checkbox";

const ComponentShowcasePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [preferredContact, setPreferredContact] = useState("email");
  const [sliderValue, setSliderValue] = useState(50);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  
  const form = useForm();

  const onVerify = (value: string, isValid: boolean) => {
    setVerificationCode(value);
    setIsVerified(isValid);
    // Ignore code parameter
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Component Showcase</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Form Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name" 
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Enter your message" 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <RadioGroup value={preferredContact} onValueChange={setPreferredContact}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone" />
                    <Label htmlFor="phone">Phone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">Text Message</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Priority Level ({sliderValue}%)</Label>
                <Slider
                  value={[sliderValue]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => setSliderValue(values[0])}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted} 
                  onCheckedChange={(checked: CheckedState) => setTermsAccepted(checked as boolean)} 
                />
                <Label htmlFor="terms">
                  I accept the terms and conditions
                </Label>
              </div>
              
              <Button className="w-full">Submit</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Custom Form Field */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Form Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <CustomFormField
                name="custom-name"
                label="Full Name"
                description="Please enter your full name as it appears on your ID"
                tooltip="This helps us verify your identity"
                required={true}
              >
                <Input placeholder="Enter your full name" />
              </CustomFormField>
              
              <CustomFormField
                name="custom-email"
                label="Email Address"
                description="We'll use this to contact you"
                tooltip="We'll never share your email with third parties"
                required={true}
              >
                <Input type="email" placeholder="Enter your email address" />
              </CustomFormField>
              
              <CustomFormField
                name="custom-message"
                label="Your Message"
                tooltip="Be as detailed as possible"
              >
                <Textarea placeholder="Enter your message" />
              </CustomFormField>
              
              <Button type="submit">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComponentShowcasePage;
