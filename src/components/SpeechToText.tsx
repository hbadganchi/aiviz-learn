import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, Pause, Play } from "lucide-react";
import { toast } from "sonner";

interface SpeechToTextProps {
  onSpeechResult: (text: string) => void;
}

export const SpeechToText = ({ onSpeechResult }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript) {
          onSpeechResult(finalTranscript);
          toast.success("Speech captured!", {
            description: finalTranscript.substring(0, 50) + "..."
          });
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        toast.error("Speech recognition error", {
          description: "Please check microphone permissions"
        });
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSpeechResult]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setIsPaused(false);
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
      setIsPaused(false);
      toast.info("Listening... Speak now");
    }
  };

  const togglePause = () => {
    if (!isSupported || !isListening) return;

    if (isPaused) {
      recognitionRef.current?.start();
      setIsPaused(false);
      toast.info("Resumed listening");
    } else {
      recognitionRef.current?.stop();
      setIsPaused(true);
      toast.info("Paused listening");
    }
  };

  if (!isSupported) {
    return (
      <Card className="p-4 bg-muted">
        <p className="text-muted-foreground text-sm">
          Speech recognition not supported in this browser
        </p>
      </Card>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {transcript && (
        <Card className="max-w-md p-3 bg-gradient-primary">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary-foreground" />
            <p className="text-primary-foreground text-sm font-medium">
              "{transcript.substring(0, 60)}{transcript.length > 60 ? '...' : ''}"
            </p>
          </div>
        </Card>
      )}
      
      <div className="flex gap-2">
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className={`
            interactive shadow-medium min-w-[140px]
            ${isListening 
              ? 'bg-destructive hover:bg-destructive/90' + (isPaused ? '' : ' animate-pulse')
              : 'bg-gradient-primary hover:bg-primary-hover'
            }
          `}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Listening
            </>
          )}
        </Button>
        
        {isListening && (
          <Button
            onClick={togglePause}
            variant="outline"
            size="lg"
            className="interactive shadow-medium"
          >
            {isPaused ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};