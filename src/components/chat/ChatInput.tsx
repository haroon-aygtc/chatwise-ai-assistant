
import { useState, FormEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendAttachment?: (file: File) => void;
  isLoading?: boolean;
  allowAttachments?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  onSendAttachment, 
  isLoading = false,
  allowAttachments = true,
  placeholder = "Type a message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendAttachment) {
      onSendAttachment(file);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-background p-3 border-t">
      {allowAttachments && (
        <>
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="h-9 w-9 shrink-0" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden"
            disabled={isLoading}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </>
      )}
      
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="min-h-[40px] max-h-[120px] resize-none pr-10"
          rows={1}
        />
      </div>
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || isLoading} 
        className="h-9 w-9 shrink-0"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
