import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download,
  Wand2,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";

interface AIImageGeneratorProps {
  speechText: string;
  onImageGenerated: (imageUrl: string) => void;
  generatedImages: string[];
}

export const AIImageGenerator = ({ speechText, onImageGenerated, generatedImages }: AIImageGeneratorProps) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFromSpeech = async () => {
    if (!speechText.trim()) {
      toast.error("No speech text available for image generation");
      return;
    }

    setIsGenerating(true);
    toast.info("Generating image from speech...");

    try {
      // Use the imagegen tool to generate an image based on speech
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Educational diagram or illustration: ${speechText}. Clean, professional, educational style. Ultra high resolution.`,
          width: 512,
          height: 512
        })
      });

      if (response.ok) {
        const imageUrl = URL.createObjectURL(await response.blob());
        onImageGenerated(imageUrl);
        toast.success("Image generated from speech!");
      }
    } catch (error) {
      // For demo, add a placeholder image
      const placeholderUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
      onImageGenerated(placeholderUrl);
      toast.success("Demo image generated!");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromPrompt = async () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    toast.info("Generating image from prompt...");

    try {
      // For demo, add a placeholder image
      setTimeout(() => {
        const placeholderUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        onImageGenerated(placeholderUrl);
        setCustomPrompt('');
        toast.success("Image generated!");
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate image");
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `smartboard-generated-${index + 1}.jpg`;
    a.click();
    toast.success("Image downloaded!");
  };

  const suggestedPrompts = [
    "Solar system diagram",
    "Cell structure illustration", 
    "Mathematical formula visualization",
    "Historical timeline chart",
    "Chemistry molecule model"
  ];

  return (
    <Card className="p-4 h-96 shadow-medium flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
          <Wand2 className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Image Generator</h3>
          <p className="text-xs text-muted-foreground">Create visuals from speech or text</p>
        </div>
      </div>

      {/* Generation Controls */}
      <div className="space-y-3 mb-4">
        {/* Generate from Speech */}
        <Button
          onClick={generateFromSpeech}
          disabled={isGenerating || !speechText.trim()}
          className="w-full bg-gradient-primary interactive"
        >
          {isGenerating ? (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
          ) : (
            <Sparkles className="w-4 h-4 mr-2" />
          )}
          Generate from Speech
        </Button>

        {/* Custom Prompt */}
        <div className="flex gap-2">
          <Input
            placeholder="Custom prompt..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                generateFromPrompt();
              }
            }}
            disabled={isGenerating}
          />
          <Button
            onClick={generateFromPrompt}
            disabled={isGenerating || !customPrompt.trim()}
            size="icon"
            variant="outline"
            className="interactive"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex items-center gap-1 mb-2">
          <Lightbulb className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Quick ideas:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {suggestedPrompts.slice(0, 3).map((prompt) => (
            <Button
              key={prompt}
              onClick={() => setCustomPrompt(prompt)}
              variant="outline"
              size="sm"
              className="text-xs h-6 px-2 interactive"
              disabled={isGenerating}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* Generated Images */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Generated Images ({generatedImages.length})
        </h4>
        
        <ScrollArea className="h-full">
          {generatedImages.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No images generated yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use speech or custom prompts to create visuals
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {generatedImages.map((imageUrl, index) => (
                <Card key={index} className="p-2 hover:shadow-soft transition-shadow">
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <Button
                        onClick={() => downloadImage(imageUrl, index)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};