import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Navigation, RefreshCw, ChevronLeft, MapPin, AlertCircle } from 'lucide-react';
import { Button, Card, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { useAuth } from '../hooks/useFirebase';
import { motion } from 'motion/react';

export const LiveLocationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState<{ lat: number, lng: number, accuracy: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLastUpdated(new Date());
        setLoading(false);
      },
      (err) => {
        console.error('Location fetch failed:', err);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button variant="ghost" size="sm" onClick={fetchLocation} disabled={loading} className="text-brand-sand">
          <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
        </Button>
      </div>

      <SectionHeader 
        title="Live Location" 
        subtitle="Your current coordinates and tracking status."
      />

      <Card className="relative h-64 overflow-hidden border-2 border-brand-sand/10 bg-brand-sand/5">
        {location ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-brand-red/10 blur-xl animate-pulse" />
              <MapPin className="relative h-12 w-12 text-brand-red" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-brand-charcoal">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sand">
                Accuracy: ±{Math.round(location.accuracy)} meters
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
            <Navigation className="h-12 w-12 text-brand-sand animate-pulse" />
            <p className="text-sm font-medium text-brand-sand">Fetching your location...</p>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <StatusChip label={loading ? "Updating" : "Live"} active={!loading} />
          {lastUpdated && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-sand">Location Sharing</h3>
        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-charcoal">Emergency Sharing</h4>
              <p className="text-xs font-medium text-brand-sand leading-relaxed">
                When an SOS is triggered, this location is automatically sent to your trusted circle via a Google Maps link.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="flex items-center space-x-4 border-2 border-brand-sand/10 bg-brand-sand/5 p-4">
        <AlertCircle className="h-6 w-6 text-brand-sand" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-charcoal">Privacy Note</h4>
          <p className="text-xs font-medium text-brand-sand leading-relaxed">
            Your location is only accessed when you are on this page or when an SOS is active. We do not track you in the background.
          </p>
        </div>
      </Card>
    </div>
  );
};

import { cn } from '../components/UI';
