import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, RotateCcw } from 'lucide-react';

interface VideoRecorderProps {
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onRecordingStart, 
  onRecordingStop, 
  isRecording, 
  setIsRecording 
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode }, 
        audio: true 
      });
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const startRecording = async () => {
    if (!stream) return;

    try {
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      onRecordingStart?.();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      onRecordingStop?.();
    }
  };

  const switchCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: newFacingMode }, 
        audio: true 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  useEffect(() => {
    requestPermissions();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (hasPermission === false) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Camera className="mx-auto mb-4 text-red-600" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
        <p className="text-gray-600 mb-4">Camera access is required for emergency video calls</p>
        <button 
          onClick={requestPermissions}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Grant Camera Access
        </button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Main Video Area */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">RECORDING</span>
          </div>
        )}

        {/* Dispatcher Video Placeholder */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-white text-xs">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full mx-auto mb-1"></div>
              <span>Dispatcher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRecording ? <Square size={20} /> : <Camera size={20} />}
            {isRecording ? 'Stop Recording' : 'Start Emergency Call'}
          </button>
          
          <button
            onClick={switchCamera}
            className="flex items-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            disabled={isRecording}
          >
            <RotateCcw size={20} />
            Flip Camera
          </button>
        </div>
      </div>

      {/* Recorded Video Playback */}
      {recordedVideoUrl && !isRecording && (
        <div className="p-4 border-t bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recorded Emergency Call</h3>
          <video
            ref={recordedVideoRef}
            src={recordedVideoUrl}
            controls
            className="w-full max-h-64 bg-black rounded-lg"
          />
        </div>
      )}
    </div>
  );
};