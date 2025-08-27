import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square,
  Download,
  Trash2,
  Volume2,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface MicrophoneToolProps {
  onTranscriptChange?: (transcript: string) => void;
  className?: string;
}

export const MicrophoneTool = ({ onTranscriptChange, className }: MicrophoneToolProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordings, setRecordings] = useState<{ url: string; name: string; duration: number }[]>([]);
  const [currentRecording, setCurrentRecording] = useState<{ url: string; duration: number } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognitionAPI();
      
      const recognition = speechRecognitionRef.current;
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
        setLiveTranscript(fullTranscript);
        
        if (finalTranscript && onTranscriptChange) {
          onTranscriptChange(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Speech recognition error");
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      stopRecording();
      stopListening();
    };
  }, [onTranscriptChange]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = Date.now() - recordingStartTime;
        
        setCurrentRecording({ url, duration });
        setRecordings(prev => [...prev, {
          url,
          name: `Recording ${prev.length + 1}`,
          duration: Math.round(duration / 1000)
        }]);
        
        toast.success("Recording saved!");
      };

      const recordingStartTime = Date.now();
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start audio level monitoring
      monitorAudioLevel();
      
      toast.success("Recording started!");
    } catch (error) {
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
      
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!isRecording) return;
      
      analyserRef.current!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 128) * 100));
      
      requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  };

  const startListening = () => {
    if (speechRecognitionRef.current) {
      setLiveTranscript('');
      speechRecognitionRef.current.start();
      setIsListening(true);
      toast.info("Live transcription started");
    }
  };

  const stopListening = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
    setIsPlaying(true);
    
    audio.onended = () => {
      setIsPlaying(false);
    };
    
    toast.success("Playing recording");
  };

  const downloadRecording = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.webm`;
    a.click();
    toast.success("Recording downloaded!");
  };

  const deleteRecording = (index: number) => {
    setRecordings(prev => prev.filter((_, i) => i !== index));
    toast.success("Recording deleted!");
  };

  return (
    <Card className={`p-4 shadow-medium ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Voice Tool</h3>
              <p className="text-xs text-muted-foreground">Record & transcribe audio</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="interactive">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <Separator />

        {/* Recording Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className={`flex-1 interactive ${
                isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                  : 'bg-gradient-primary'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
            
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "secondary" : "outline"}
              className={`interactive ${
                isListening ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Audio Level Indicator */}
          {isRecording && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Audio Level</span>
                <span>{Math.round(audioLevel)}%</span>
              </div>
              <Progress value={audioLevel} className="h-2" />
            </div>
          )}

          {/* Live Transcript */}
          {isListening && liveTranscript && (
            <Card className="p-3 bg-gradient-accent">
              <div className="flex items-start gap-2">
                <Volume2 className="w-4 h-4 text-accent-foreground mt-0.5 flex-shrink-0" />
                <p className="text-accent-foreground text-sm">
                  "{liveTranscript}"
                </p>
              </div>
            </Card>
          )}
        </div>

        <Separator />

        {/* Recordings List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Recordings ({recordings.length})
          </h4>
          
          {recordings.length === 0 ? (
            <div className="text-center py-4">
              <Mic className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recordings yet</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {recordings.map((recording, index) => (
                <Card key={index} className="p-2 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => playRecording(recording.url)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        {isPlaying ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <div>
                        <p className="text-xs font-medium">{recording.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {recording.duration}s
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => downloadRecording(recording.url, recording.name)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteRecording(index)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};