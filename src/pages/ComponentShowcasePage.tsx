
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ColorPicker } from "@/components/ui/color-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/ui/form-field";
import { PhoneInput } from "@/components/ui/phone-input";
import { Mail, User, Lock, Info, ChevronRight, Menu, AlertCircle } from 'lucide-react';

const ComponentShowcasePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [color, setColor] = useState('#6E59A5');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isChecked, setIsChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const handlePhoneChange = (value: string, code: string) => {
    setPhone(value);
    setCountryCode(code);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Component Showcase</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Component Showcase</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      
      <Tabs defaultValue="basics">
        <TabsList className="mb-6">
          <TabsTrigger value="basics">Basic UI</TabsTrigger>
          <TabsTrigger value="forms">Form Components</TabsTrigger>
          <TabsTrigger value="data">Data Display</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basics" className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Badges</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
            <div className="flex flex-wrap gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>This is an informational alert message.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
              </Alert>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="forms" className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Form Fields</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Fields</CardTitle>
                  <CardDescription>Basic form input components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Submit</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Specialized Inputs</CardTitle>
                  <CardDescription>Special form components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-medium text-sm">Phone Number</label>
                    <PhoneInput
                      id="phone"
                      value={phone}
                      countryCode={countryCode}
                      onChange={handlePhoneChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium text-sm">Color Picker</label>
                    <ColorPicker value={color} onChange={setColor} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="font-medium text-sm">Date Picker</label>
                    <div className="border rounded-md p-3">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Checkboxes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms1" checked={isChecked} onCheckedChange={setIsChecked} />
                <label htmlFor="terms1" className="text-sm font-medium">
                  Accept terms and conditions
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <CustomCheckbox
                  checked={isChecked}
                  onCheckedChange={setIsChecked}
                />
                <label htmlFor="terms2" className="text-sm font-medium">
                  Custom Checkbox
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <CustomCheckbox
                  checked={isChecked}
                  indeterminate={isIndeterminate}
                  onCheckedChange={setIsChecked}
                />
                <label className="text-sm font-medium">
                  Indeterminate Checkbox
                </label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsIndeterminate(!isIndeterminate)}
                >
                  Toggle Indeterminate
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card content with some sample text to show the card body.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Action</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Feature Card</CardTitle>
                  <CardDescription>With avatar and badge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">Product Designer</p>
                    </div>
                    <Badge className="ml-auto">New</Badge>
                  </div>
                  <p>Card with avatar, text content and status badge.</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">Cancel</Button>
                  <Button size="sm">Save</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <AspectRatio ratio={16/9} className="bg-muted">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">16:9 Aspect Ratio</p>
                  </div>
                </AspectRatio>
                <CardHeader>
                  <CardTitle>Media Card</CardTitle>
                  <CardDescription>With aspect ratio container</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card with an aspect ratio container for media.</p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Accordion</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Shadcn UI?</AccordionTrigger>
                <AccordionContent>
                  Shadcn UI is a collection of reusable components built using Radix UI and Tailwind CSS.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How to install components?</AccordionTrigger>
                <AccordionContent>
                  Components can be installed using the CLI. Run `npx shadcn-ui@latest add button` to add the button component.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I customize the components?</AccordionTrigger>
                <AccordionContent>
                  Yes! The components are designed to be customizable. You can modify the components to fit your design system.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Collapsible</h2>
            <div className="border rounded-md p-4">
              <Collapsible className="w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Collapsible Content</h3>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="py-2">
                  This content is always visible
                </div>
                <CollapsibleContent className="pt-2 border-t">
                  <div className="py-2">
                    This content can be collapsed and expanded.
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Layout Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breadcrumb Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Home</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Components</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Layout</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Tabs Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tab1">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                      <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
                      Tab 1 content
                    </TabsContent>
                    <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
                      Tab 2 content
                    </TabsContent>
                    <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
                      Tab 3 content
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      
      <div className="mt-10 p-4 border rounded-md bg-muted/50">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="h-5 w-5" />
          <h2 className="text-lg font-medium">Component Navigator</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/login"}>
            Login Page
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/signup"}>
            Signup Page
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/admin/users"}>
            User Management
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = "/"}>
            Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcasePage;
