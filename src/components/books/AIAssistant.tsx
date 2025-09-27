import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  MessageSquare, 
  FileQuestion, 
  Brain, 
  BookOpen,
  Lightbulb,
  CheckCircle,
  Copy,
  Loader2
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content_preview?: string;
  ai_summary?: string;
  tags: string[];
}

interface AIAssistantProps {
  selectedNote?: Note;
  onSummaryGenerated: (noteId: string, summary: string) => void;
  className?: string;
}

export const AIAssistant = ({ 
  selectedNote, 
  onSummaryGenerated,
  className 
}: AIAssistantProps) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const aiFeatures = [
    {
      id: 'summarize',
      title: 'Summarize',
      description: 'Get a concise summary of your notes',
      icon: FileQuestion,
      action: 'Generate Summary'
    },
    {
      id: 'explain',
      title: 'Explain',
      description: 'Get detailed explanations of concepts',
      icon: Lightbulb,
      action: 'Explain Concept'
    },
    {
      id: 'quiz',
      title: 'Generate Quiz',
      description: 'Create practice questions from your notes',
      icon: Brain,
      action: 'Create Quiz'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Ask questions about your notes',
      icon: MessageSquare,
      action: 'Ask Question'
    }
  ];

  const handleAIRequest = async (feature: string, query?: string) => {
    if (!selectedNote) {
      toast({
        title: "No note selected",
        description: "Please select a note to use AI features.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setActiveFeature(feature);

    try {
      // Mock AI responses - in real implementation, this would call an AI API
      await new Promise(resolve => setTimeout(resolve, 2000));

      let mockResponse = "";
      
      switch (feature) {
        case 'summarize':
          mockResponse = `**Summary of "${selectedNote.title}"**\n\nThis note covers key concepts including ${selectedNote.tags.slice(0, 3).join(', ')}. The main points are:\n\n• Core concept explanations\n• Important formulas and definitions\n• Practical examples and applications\n• Key takeaways for understanding\n\nThis material is essential for building foundational knowledge in the subject area.`;
          if (selectedNote.id) {
            onSummaryGenerated(selectedNote.id, mockResponse);
          }
          break;
          
        case 'explain':
          mockResponse = `**Detailed Explanation**\n\n${query || 'The selected concept'} can be understood through the following breakdown:\n\n**Definition:** This concept refers to...\n\n**How it works:** The underlying mechanism involves...\n\n**Examples:** Real-world applications include...\n\n**Why it matters:** This is important because...`;
          break;
          
        case 'quiz':
          mockResponse = `**Practice Quiz - ${selectedNote.title}**\n\n**Question 1:** What is the primary concept discussed in this note?\na) Option A\nb) Option B\nc) Option C\nd) Option D\n\n**Question 2:** Which of these is an example of the concept?\na) Example A\nb) Example B\nc) Example C\nd) Example D\n\n**Question 3:** Why is this concept important?\n(Short answer)\n\n**Answer Key:** 1-c, 2-b, 3-[Sample answer provided]`;
          break;
          
        case 'chat':
          mockResponse = `**AI Response**\n\nRegarding your question: "${query}"\n\nBased on the content in "${selectedNote.title}", here's what I can help with:\n\n• The concept relates to ${selectedNote.tags[0] || 'the main topic'}\n• Key points to consider are...\n• This connects to other concepts by...\n\nWould you like me to elaborate on any specific aspect?`;
          break;
      }
      
      setResponse(mockResponse);
      
      toast({
        title: "AI analysis complete",
        description: `Generated ${feature} for ${selectedNote.title}`,
      });
      
    } catch (error) {
      toast({
        title: "AI request failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    toast({
      title: "Copied to clipboard",
      description: "AI response has been copied to your clipboard.",
    });
  };

  return (
    <Card className={`shadow-medium ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {selectedNote ? `Working with: ${selectedNote.title}` : 'Select a note to get started'}
            </p>
          </div>
        </div>

        <Separator />

        {/* AI Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">AI Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Button
                  key={feature.id}
                  variant={activeFeature === feature.id ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-center gap-2"
                  onClick={() => {
                    if (feature.id === 'chat' || feature.id === 'explain') {
                      setActiveFeature(feature.id);
                    } else {
                      handleAIRequest(feature.id);
                    }
                  }}
                  disabled={!selectedNote || isLoading}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-center">
                    <p className="text-xs font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Query Input for Chat/Explain */}
        {(activeFeature === 'chat' || activeFeature === 'explain') && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                {activeFeature === 'chat' ? 'Ask a Question' : 'What would you like explained?'}
              </h4>
              <Textarea
                placeholder={
                  activeFeature === 'chat' 
                    ? "Ask anything about your notes..." 
                    : "Enter a concept to explain..."
                }
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="min-h-[80px]"
              />
              <Button
                onClick={() => handleAIRequest(activeFeature, userQuery)}
                disabled={!userQuery.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4 mr-2" />
                )}
                {aiFeatures.find(f => f.id === activeFeature)?.action}
              </Button>
            </div>
          </div>
        )}

        {/* AI Response */}
        {response && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">AI Response</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="max-h-64">
                <Card className="p-4 bg-muted/50">
                  <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {response}
                  </pre>
                </Card>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">AI is analyzing your notes...</p>
            </div>
          </div>
        )}

        {/* No Note Selected State */}
        {!selectedNote && (
          <div className="text-center py-8 space-y-2">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Select a note to unlock AI-powered features
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};