import React, { useState } from 'react';
import { MapPin, Share2, Navigation } from 'lucide-react';

export const LocationDisplay: React.FC = () => {
  const [locationShared, setLocationShared] = useState(false);
  const [accuracy, setAccuracy] = useState(5);

  const mockAddress = "123 Emergency Ave, Toronto, ON M5V 3A1";
  const coordinates = { lat: 43.6532, lng: -79.3832 };

  const handleShareLocation = () => {
    setLocationShared(true);
    setTimeout(() => setLocationShared(false), 3000);
  };

  // Static map URL (using OpenStreetMap via Leaflet style)
  const mapImageUrl = `https://images.pexels.com/photos/2330137/pexels-photo-2330137.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-red-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-red-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Emergency Location</h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">LIVE</span>
        </div>
      </div>

      {/* Location Info */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <MapPin className="text-red-600 mt-1" size={18} />
          <div className="flex-1">
            <p className="text-gray-900 font-medium">{mockAddress}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Lat: {coordinates.lat}</span>
              <span>Lng: {coordinates.lng}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="text-green-600" size={16} />
            <span className="text-sm text-gray-700">Accuracy: {accuracy}m</span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Static Map */}
      <div className="relative">
        <img 
          src={mapImageUrl}
          alt="Emergency Location Map"
          className="w-full h-48 object-cover"
        />
        
        {/* Location Pin Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <MapPin className="text-red-600 drop-shadow-lg" size={32} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Accuracy Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="border-2 border-blue-400 border-opacity-50 rounded-full bg-blue-400 bg-opacity-20"
            style={{ width: '60px', height: '60px' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 flex gap-3">
        <button
          onClick={handleShareLocation}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            locationShared 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Share2 size={16} />
          {locationShared ? 'Location Shared!' : 'Share Location'}
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
          <Navigation size={16} />
          Refine Location
        </button>
      </div>

      {/* Emergency Services Info */}
      <div className="p-4 border-t bg-yellow-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-semibold text-yellow-800">Dispatch Status</span>
        </div>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>🚑 Ambulance: En route (ETA 8 min)</p>
          <p>🚓 Police: Dispatched (ETA 6 min)</p>
          <p>📞 Emergency Contact: Notified</p>
        </div>
      </div>
    </div>
  );
};