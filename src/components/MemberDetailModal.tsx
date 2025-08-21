'use client';

import React from 'react';
import { Member } from '@/lib/supabase';
import { X, MapPin, Crown, Calendar, Link, MessageCircle, Wifi, WifiOff, Clock, Globe } from 'lucide-react';

interface MemberDetailModalProps {
  isVisible: boolean;
  member: Member | null;
  onClose: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ 
  isVisible, 
  member, 
  onClose 
}) => {
  if (!isVisible || !member) return null;

  const getLocationName = (lat?: number, lng?: number) => {
    if (!lat || !lng) return 'Unknown Location';
    if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) return 'Bangalore, India';
    if (lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.3) return 'San Francisco, USA';
    return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  };

  const getStatus = (lastSeen?: string) => {
    if (!lastSeen) return { key: 'offline', text: 'Offline', color: 'bg-gray-400', icon: WifiOff };
    const diff = (new Date().getTime() - new Date(lastSeen).getTime()) / 60000;
    if (diff < 5) return { key: 'online', text: 'Online', color: 'bg-green-500', icon: Wifi };
    if (diff < 30) return { key: 'busy', text: 'Recently Active', color: 'bg-yellow-500', icon: Wifi };
    return { key: 'offline', text: 'Offline', color: 'bg-gray-400', icon: WifiOff };
  };

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvatarContent = () => {
    if (member.pfp) {
      return (
        <img 
          src={member.pfp} 
          alt={member.name || 'Profile'} 
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
    
    const initials = member.name 
      ? member.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : member.wallet 
        ? member.wallet.slice(2, 4).toUpperCase() 
        : '?';
    
    return (
      <span className="font-bold text-3xl text-white">
        {initials}
      </span>
    );
  };

  const status = getStatus(member.last_seen);
  const location = getLocationName(member.lat || member.latitude, member.lng || member.longitude);
  const StatusIcon = status.icon;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'scale-100 translate-y-0 opacity-100' 
            : 'scale-75 translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          {/* Profile Section */}
          <div className="text-center">
            <div 
              className={`relative inline-block mb-4 transition-all duration-700 ease-out ${
                isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center overflow-hidden mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300">
                {getAvatarContent()}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${status.color} rounded-full border-3 border-black flex items-center justify-center animate-pulse`}>
                <StatusIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h2 
              className={`text-2xl font-bold text-white mb-1 transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
            >
              {member.name || formatAddress(member.wallet)}
            </h2>
            
            <div 
              className={`flex items-center justify-center gap-2 mb-2 transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '500ms' : '0ms' }}
            >
              <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-yellow-500 font-medium">{member.role}</span>
            </div>
            
            <div 
              className={`flex items-center justify-center gap-2 mb-4 transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}
            >
              <StatusIcon className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{status.text}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Bio Section */}
          {member.bio && (
            <div 
              className={`bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-500 ease-out hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? '700ms' : '0ms' }}
            >
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 animate-bounce" />
                About
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Culture Section */}
          {member.culture && (
            <div 
              className={`bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-500 ease-out hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}
            >
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                Primary Culture
              </h3>
              <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200">
                {member.culture}
              </span>
            </div>
          )}

          {/* Details Grid */}
          <div 
            className={`grid grid-cols-1 gap-4 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '900ms' : '0ms' }}
          >
            {/* Location */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-200">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Location
              </h3>
              <p className="text-white/80 text-sm">{location}</p>
            </div>

            {/* Calendar */}
            {member.calendar_url && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-200">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  Calendar
                </h3>
                <a
                  href={member.calendar_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors hover:scale-105"
                >
                  <Link className="w-3 h-3" />
                  View Calendar
                </a>
              </div>
            )}

            {/* Member Since */}
            {member.created_at && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-200">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Member Since
                </h3>
                <p className="text-white/80 text-sm">{formatDate(member.created_at)}</p>
              </div>
            )}

            {/* Wallet Address */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-200">
              <h3 className="text-white font-semibold mb-2">Wallet Address</h3>
              <code className="text-white/80 text-xs bg-black/30 px-2 py-1 rounded font-mono hover:bg-black/50 transition-colors duration-200">
                {formatAddress(member.wallet)}
              </code>
            </div>
          </div>

          {/* Action Buttons */}
          <div 
            className={`flex gap-3 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '1000ms' : '0ms' }}
          >
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Connect
            </button>
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
