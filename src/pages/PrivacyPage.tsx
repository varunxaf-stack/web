import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, Lock, Eye, Server, UserCheck } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { SectionHeader } from '../components/Navigation';

export const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
      </div>

      <SectionHeader 
        title="Privacy Policy" 
        subtitle="Your safety and privacy are our top priorities."
      />

      <div className="space-y-6">
        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-red">
            <Lock className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Data Encryption</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            All your personal information, emergency contacts, and alert history are encrypted and stored securely using Firebase. We do not sell your data to third parties.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-terracotta">
            <Mic className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Voice Detection</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            Voice detection happens locally in your browser. Audio is not recorded or stored on our servers. The microphone is only active when you explicitly "Arm" the shield.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-sand">
            <Navigation className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Location Tracking</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            Your location is only accessed when an SOS alert is triggered or when you are viewing the "Live Location" page. We do not track your location in the background.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-charcoal">
            <UserCheck className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">User Consent</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            You have full control over your data. You can delete your account and all associated data at any time from the profile settings.
          </p>
        </Card>
      </div>

      <div className="rounded-2xl bg-brand-sand/10 p-6 text-center">
        <p className="text-xs font-bold text-brand-sand uppercase tracking-widest">
          Last Updated: March 19, 2026
        </p>
      </div>
    </div>
  );
};

import { Mic, Navigation } from 'lucide-react';
