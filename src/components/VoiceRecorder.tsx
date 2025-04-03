
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
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      console.log("Voice recorder component unmounting, cleaning up resources");
      stopMediaRecording();
      stopTimer();
      stopStream();
      closeAudioContext();
      cancelAnimationFrame();
    };
  }, []);

  const stopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        console.log("Stopping media recorder on cleanup");
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error("Error stopping MediaRecorder during cleanup:", err);
      }
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      console.log("Clearing timer on cleanup");
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      console.log("Stopping media stream tracks on cleanup");
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}, enabled: ${track.enabled}, readyState: ${track.readyState}`);
        track.stop();
      });
      streamRef.current = null;
    }
  };

  const closeAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      console.log(`Closing audio context, current state: ${audioContextRef.current.state}`);
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const cancelAnimationFrame = () => {
    if (animationFrameRef.current) {
      console.log("Canceling animation frame on cleanup");
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Effect to stop recording when maximum time is reached
  useEffect(() => {
    if (isRecording && recordingDuration >= maxRecordingTime) {
      console.log(`Maximum recording time of ${maxRecordingTime} seconds reached, stopping recording`);
      stopRecording();
      toast.info(`Maximum recording time of ${maxRecordingTime} seconds reached.`);
    }
  }, [isRecording, recordingDuration, maxRecordingTime]);
  
  const startRecording = async () => {
    try {
      setRecordingError(null);
      console.log("Requesting microphone access...");
      
      // Reset recording state
      setAudioURL(null);
      setRecordingDuration(0);
      setIsRecording(false);
      audioChunksRef.current = [];
      
      // First, clean up any existing resources
      stopMediaRecording();
      stopTimer();
      stopStream();
      closeAudioContext();
      cancelAnimationFrame();
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        const error = "MediaRecorder API is not supported in this browser";
        console.error(error);
        setRecordingError(error);
        toast.error(error);
        return;
      }
      
      // Request microphone access with explicit audio constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log("Microphone access granted", stream);
      console.log("Audio tracks:", stream.getAudioTracks().length);
      console.log("Audio track settings:", stream.getAudioTracks()[0]?.getSettings());
      
      streamRef.current = stream;
      setPermissionDenied(false);
      
      // Create audio context and analyzer
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        const error = "AudioContext is not supported in this browser";
        console.error(error);
        setRecordingError(error);
        toast.error(error);
        return;
      }
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const updateWaveform = () => {
        if (!analyserRef.current || !isRecording) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const newWaveformData = Array.from({ length: 30 }, (_, i) => {
          const index = Math.floor(i * dataArray.length / 30);
          return dataArray[index] / 255;
        });
        
        setWaveformData(newWaveformData);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      
      // Start updating waveform
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
      
      // Initialize media recorder with supported mime type
      const mimeType = getSupportedMimeType();
      console.log("Using MIME type:", mimeType);
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
        console.log("MediaRecorder created successfully");
      } catch (err) {
        console.error("Error creating MediaRecorder:", err);
        // Try again with default options
        try {
          console.log("Trying to create MediaRecorder with default options");
          mediaRecorderRef.current = new MediaRecorder(stream);
          console.log("MediaRecorder created with default options");
        } catch (fallbackErr) {
          const error = `Failed to create MediaRecorder: ${fallbackErr}`;
          console.error(error);
          setRecordingError(error);
          toast.error("Could not initialize audio recording. Please try a different browser.");
          return;
        }
      }
      
      // Set up MediaRecorder event handlers
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("Data available event:", e.data.size, "bytes");
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("Audio chunk added, total chunks:", audioChunksRef.current.length);
        } else {
          console.warn("Received empty data in ondataavailable");
        }
      };
      
      mediaRecorderRef.current.onstart = () => {
        console.log("MediaRecorder started successfully");
        setIsRecording(true);
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setRecordingError("Error during recording");
        toast.error("Recording error occurred");
      };
      
      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped, chunks:", audioChunksRef.current.length);
        
        if (audioChunksRef.current.length > 0) {
          const mimeType = getSupportedMimeType();
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          console.log("Created audio blob:", audioBlob.size, "bytes");
          
          if (audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            console.log("Audio URL created:", audioUrl);
            
            // Stop tracks after successful recording
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
              console.log("Media tracks stopped after successful recording");
            }
            
            if (onAnalyze) {
              console.log("Calling onAnalyze with blob:", audioBlob.size, "bytes");
              onAnalyze(audioBlob);
            }
          } else {
            const error = "Created audio blob is empty";
            console.error(error);
            setRecordingError(error);
            toast.error("No audio data was recorded. Please try again.");
          }
        } else {
          const error = "No audio data recorded";
          console.error(error);
          setRecordingError(error);
          toast.error("No audio data was recorded. Please try again.");
        }
        
        setIsRecording(false);
      };
      
      // Start recording
      console.log("Starting MediaRecorder...");
      mediaRecorderRef.current.start(100); // Collect data every 100ms for more consistent chunks
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error: any) {
      console.error('Error accessing microphone:', error);
      
      let errorMessage = "Could not access microphone.";
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "Microphone access was denied. Please allow microphone access and try again.";
        setPermissionDenied(true);
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "No microphone was found on your device.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Your microphone is being used by another application.";
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = "Microphone constraints cannot be satisfied.";
      } else if (error.name === 'TypeError') {
        errorMessage = "Audio is not supported on this device or browser.";
      }
      
      setRecordingError(errorMessage);
      toast.error(errorMessage);
      
      // Clean up if there was an error
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };
  
  // Get supported MIME type for audio recording
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return ''; // Return empty string to let browser choose default
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping recording...");
      try {
        // Only call requestData if state is recording/paused
        if (mediaRecorderRef.current.state !== 'inactive') {
          console.log("Requesting final data chunk");
          mediaRecorderRef.current.requestData();
          console.log("Stopping MediaRecorder");
          mediaRecorderRef.current.stop();
        } else {
          console.log("MediaRecorder already inactive, not stopping");
        }
      } catch (err) {
        console.error("Error stopping MediaRecorder:", err);
        setRecordingError("Error stopping recording");
        toast.error("Error stopping recording");
      }
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      setIsRecording(false);
    } else {
      console.warn("Cannot stop recording: either not recording or no MediaRecorder");
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
    if (audioURL && onAnalyze && audioChunksRef.current.length > 0) {
      const mimeType = getSupportedMimeType();
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
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
      
      {recordingError && (
        <div className="text-red-500 mb-4 text-center">
          {recordingError}
        </div>
      )}
      
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
            permissionDenied ? 'Please allow microphone access to record your voice.' :
            'Click the microphone button to start recording your voice.')}
      </p>

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
