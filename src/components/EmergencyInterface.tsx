import React, { useState } from 'react';
import { VideoRecorder } from './VideoRecorder';
import { VoiceTranscript } from './VoiceTranscript';
import { LocationDisplay } from './LocationDisplay';
import { Phone, Shield, Clock } from 'lucide-react';

export const EmergencyInterface: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState('00:00');

  const handleRecordingStart = () => {
    setCallStartTime(new Date());
  };

  const handleRecordingStop = () => {
    setCallStartTime(null);
  };

  // Update call duration
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callStartTime && isRecording) {
      interval = setInterval(() => {
        const duration = Date.now() - callStartTime.getTime();
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callStartTime, isRecording]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="text-white" size={32} />
              <div>
                <h1 className="text-2xl font-bold">SwiftEMS</h1>
                <p className="text-red-100 text-sm">Emergency Response System</p>
              </div>
            </div>
            
            {isRecording && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">EMERGENCY CALL ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 bg-red-700 px-3 py-1 rounded-lg">
                  <Clock size={16} />
                  <span className="font-mono text-sm">{callDuration}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Section - Takes up more space */}
          <div className="lg:col-span-2 space-y-6">
            <VideoRecorder 
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            
            <VoiceTranscript isRecording={isRecording} />
          </div>

          {/* Location Section */}
          <div className="lg:col-span-1">
            <LocationDisplay />
          </div>
        </div>
      </main>

      {/* Emergency Action Bar */}
      {isRecording && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="animate-pulse" size={20} />
              <span className="font-semibold">Emergency call in progress</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>🚑 Ambulance dispatched</span>
              <span>📍 Location shared</span>
              <span>🎙️ Audio recording</span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Quick Actions (when not recording) */}
      {!isRecording && (
        <div className="fixed bottom-6 right-6">
          <div className="bg-white rounded-lg shadow-xl p-4 border-l-4 border-red-600">
            <h4 className="font-semibold text-gray-900 mb-2">Quick Emergency Actions</h4>
            <div className="space-y-2 text-sm">
              <button className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 rounded text-red-800 transition-colors">
                🚑 Medical Emergency
              </button>
              <button className="w-full text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded text-orange-800 transition-colors">
                🔥 Fire Emergency  
              </button>
              <button className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-800 transition-colors">
                🚓 Police Emergency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};