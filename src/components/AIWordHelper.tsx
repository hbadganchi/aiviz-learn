import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIWordHelper = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Word Helper. Type any word or phrase and I'll provide definitions, examples, and explanations to help you learn.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple word definitions database (in a real app, this would be an API call)
  const getWordDefinition = (word: string): string => {
    const definitions: Record<string, string> = {
      'photosynthesis': 'The process by which green plants use sunlight, water, and carbon dioxide to create glucose and oxygen.',
      'democracy': 'A system of government where citizens exercise power by voting and participating in political processes.',
      'metaphor': 'A figure of speech that compares two unlike things without using "like" or "as".',
      'ecosystem': 'A community of living and non-living things that work together in an environment.',
      'gravity': 'The force that attracts objects toward each other, especially the force that keeps us on Earth.',
      'evolution': 'The process by which species change over time through natural selection and genetic variation.',
      'fraction': 'A number that represents part of a whole, written as one number over another (like 1/2).',
      'culture': 'The beliefs, customs, arts, and way of life of a particular group of people.',
    };

    const lowerWord = word.toLowerCase().trim();
    
    if (definitions[lowerWord]) {
      return `**${word}**: ${definitions[lowerWord]}`;
    }

    // Generate a helpful response for unknown words
    return `I'd be happy to help with "${word}"! While I don't have a specific definition stored, here are some tips:

• Try breaking the word into parts (prefixes, roots, suffixes)
• Look for context clues in the sentence where you found it
• Consider what subject area it might relate to

Would you like to try another word or ask me to explain a concept in more detail?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getWordDefinition(userMessage),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96">
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </ScrollArea>
      
      <div className="flex space-x-2 p-4 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a word or ask a question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};