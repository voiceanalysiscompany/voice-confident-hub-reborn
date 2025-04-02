
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Download } from 'lucide-react';
import { toast } from "sonner";

interface VoiceRecorderProps {
  onAnalyze?: (audioBlob: Blob) => void;
  maxRecordingTime?: number;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onAnalyze,
  maxRecordingTime = 12 // Default maximum recording time in seconds
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(30).fill(0));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  // Effect to stop recording when maximum time is reached
  useEffect(() => {
    if (isRecording && recordingDuration >= maxRecordingTime) {
      stopRecording();
      toast.info(`Maximum recording time of ${maxRecordingTime} seconds reached.`);
    }
  }, [isRecording, recordingDuration, maxRecordingTime]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const updateWaveform = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const newWaveformData = Array.from({ length: 30 }, (_, i) => {
          const index = Math.floor(i * dataArray.length / 30);
          return dataArray[index] / 255;
        });
        
        setWaveformData(newWaveformData);
        requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (onAnalyze) {
          onAnalyze(audioBlob);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioURL(null);
      setRecordingDuration(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions and try again.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `voice-recording-${new Date().toISOString()}.wav`;
      a.click();
    }
  };
  
  const analyzeRecording = () => {
    if (audioURL && onAnalyze) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      onAnalyze(audioBlob);
      toast.success('Analyzing your voice...');
    }
  };
  
  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-sm p-6 border">
      <div className="waveform-container w-full mb-6">
        {waveformData.map((height, i) => (
          <div 
            key={i} 
            className="voice-bar"
            style={{
              height: `${isRecording ? Math.max(5, height * 100) : 5}%`,
            }}
          />
        ))}
      </div>
      
      <div className="text-2xl font-bold mb-6">
        {isRecording 
          ? (
            <div className="flex items-center gap-2">
              <span className="recording-indicator"></span>
              {formatTime(recordingDuration)} / {formatTime(maxRecordingTime)}
            </div>
          ) 
          : (audioURL ? 'Recording Complete' : 'Ready to Record')}
      </div>
      
      <div className="flex gap-4 mb-6">
        {!isRecording && !audioURL && (
          <Button 
            onClick={startRecording} 
            className="rounded-full h-16 w-16 gradient-bg"
          >
            <Mic size={24} />
          </Button>
        )}
        
        {isRecording && (
          <Button 
            onClick={stopRecording} 
            variant="destructive"
            className="rounded-full h-16 w-16"
          >
            <StopCircle size={24} />
          </Button>
        )}
        
        {audioURL && (
          <>
            <Button
              onClick={() => {
                const audio = new Audio(audioURL);
                audio.play();
              }}
              variant="outline"
              className="rounded-full h-12 w-12"
            >
              <Play size={20} />
            </Button>
            
            <Button
              onClick={analyzeRecording}
              className="gradient-bg"
            >
              Analyze Recording
            </Button>
            
            <Button
              onClick={handleDownload}
              variant="outline"
            >
              <Download size={20} className="mr-2" />
              Download
            </Button>
          </>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        {isRecording ? `Recording in progress (max ${maxRecordingTime}s)...` : 
          (audioURL ? 'Your recording is ready for analysis or download.' : 
            'Click the microphone button to start recording your voice.')}
      </p>

      {/* Remove the jsx attribute from the style tag */}
      <style>
        {`
        .waveform-container {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100px;
          gap: 2px;
        }
        .voice-bar {
          flex: 1;
          background: linear-gradient(to top, #4f46e5, #818cf8);
          border-radius: 2px;
          transition: height 0.1s ease;
        }
        .recording-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default VoiceRecorder;
