import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface TranscriptEntry {
  id: string;
  speaker: 'User' | 'Dispatcher';
  text: string;
  timestamp: string;
  isEmergencyKeyword?: boolean;
}

interface VoiceTranscriptProps {
  isRecording: boolean;
}

export const VoiceTranscript: React.FC<VoiceTranscriptProps> = ({ isRecording }) => {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const emergencyKeywords = [
    'unconscious', 'bleeding', 'accident', 'help', 'emergency', 
    'hurt', 'pain', 'ambulance', 'fire', 'police', 'cardiac', 
    'stroke', 'breathing', 'choking', 'fell', 'broken'
  ];

  const highlightEmergencyKeywords = (text: string): string => {
    let highlightedText = text;
    emergencyKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="bg-red-100 text-red-800 px-1 rounded font-semibold">$1</span>');
    });
    return highlightedText;
  };

  const addTranscriptEntry = (text: string, speaker: 'User' | 'Dispatcher' = 'User') => {
    if (!text.trim()) return;
    
    const entry: TranscriptEntry = {
      id: Date.now().toString(),
      speaker,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString(),
      isEmergencyKeyword: emergencyKeywords.some(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      )
    };
    
    setTranscript(prev => [...prev, entry]);
  };

  const simulateDispatcherResponse = (userText: string) => {
    const responses = [
      "Stay calm. Help is on the way.",
      "Can you describe what you see?",
      "Keep the person comfortable and don't move them.",
      "Emergency services have been dispatched to your location.",
      "Is the person conscious and breathing?",
      "Apply pressure to any bleeding wounds.",
      "I'm staying on the line with you until help arrives."
    ];
    
    // Simulate dispatcher delay
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addTranscriptEntry(randomResponse, 'Dispatcher');
    }, 2000 + Math.random() * 3000);
  };

  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setHasPermission(false);
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentTranscript(interimTranscript);

        if (finalTranscript) {
          addTranscriptEntry(finalTranscript);
          simulateDispatcherResponse(finalTranscript);
          setCurrentTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isRecording) {
          // Restart recognition if still recording
          setTimeout(() => recognition.start(), 100);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setHasPermission(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (isRecording && hasPermission !== false) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isRecording]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, currentTranscript]);

  // Add initial dispatcher message
  useEffect(() => {
    if (transcript.length === 0) {
      addTranscriptEntry("Emergency services, what's your emergency?", 'Dispatcher');
    }
  }, []);

  if (hasPermission === false) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <MicOff className="mx-auto mb-4 text-red-600" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Microphone Access Required</h3>
          <p className="text-gray-600 mb-4">Voice access is needed for emergency transcription</p>
          <button 
            onClick={startListening}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Grant Microphone Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Emergency Transcript</h3>
        <div className="flex items-center gap-2">
          {isListening ? (
            <Mic className="text-red-600 animate-pulse" size={20} />
          ) : (
            <MicOff className="text-gray-400" size={20} />
          )}
          <span className="text-sm text-gray-600">
            {isListening ? 'Listening...' : 'Audio Off'}
          </span>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="p-4 h-64 overflow-y-auto bg-gray-50">
        <div className="space-y-3">
          {transcript.map((entry) => (
            <div 
              key={entry.id} 
              className={`p-3 rounded-lg ${
                entry.speaker === 'User' 
                  ? 'bg-blue-100 ml-8' 
                  : 'bg-green-100 mr-8'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${
                  entry.speaker === 'User' ? 'text-blue-800' : 'text-green-800'
                }`}>
                  {entry.speaker}:
                </span>
                <span className="text-xs text-gray-500">{entry.timestamp}</span>
              </div>
              <div 
                className="text-gray-800"
                dangerouslySetInnerHTML={{ 
                  __html: highlightEmergencyKeywords(entry.text) 
                }}
              />
            </div>
          ))}
          
          {/* Current interim transcript */}
          {currentTranscript && (
            <div className="p-3 rounded-lg bg-blue-50 ml-8 border border-blue-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-blue-800">User:</span>
                <span className="text-xs text-gray-500">Speaking...</span>
              </div>
              <div 
                className="text-gray-600 italic"
                dangerouslySetInnerHTML={{ 
                  __html: highlightEmergencyKeywords(currentTranscript) 
                }}
              />
            </div>
          )}
          
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* Emergency Keywords Legend */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Emergency keywords are automatically highlighted:</p>
        <div className="flex flex-wrap gap-1">
          {emergencyKeywords.slice(0, 6).map(keyword => (
            <span 
              key={keyword}
              className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
            >
              {keyword}
            </span>
          ))}
          <span className="text-xs text-gray-500 px-2 py-1">+{emergencyKeywords.length - 6} more</span>
        </div>
      </div>
    </div>
  );
};