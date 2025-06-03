import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import Button from '../ui/Button';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
  className?: string;
}

const ChatBox = ({
  messages,
  onSendMessage,
  onClose,
  className,
}: ChatBoxProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h3 className="font-medium text-gray-800 dark:text-gray-200">Chat</h3>
        <button
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`px-3 py-2 rounded-lg max-w-[85%] ${
                message.isSystem
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mx-auto text-center'
                  : message.sender === 'You'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 ml-auto'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 mr-auto'
              }`}
            >
              {!message.isSystem && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No messages yet
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <textarea
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Type a message..."
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;