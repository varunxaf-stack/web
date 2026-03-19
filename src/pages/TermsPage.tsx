import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronLeft, AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { SectionHeader } from '../components/Navigation';

export const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
      </div>

      <SectionHeader 
        title="Terms & Safety" 
        subtitle="Important information about using Nirbhaya Shield."
      />

      <div className="space-y-6">
        <Card className="space-y-4 border-2 border-brand-red/10 bg-brand-red/5 p-6">
          <div className="flex items-center space-x-3 text-brand-red">
            <AlertTriangle className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Safety Disclaimer</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            Nirbhaya Shield is a supplemental safety tool and is not a replacement for official emergency services. In immediate danger, always call 112 or your local emergency number first.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-terracotta">
            <Info className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Browser Limitations</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            As a web application, Nirbhaya Shield cannot listen for voice triggers in the background or when the screen is locked on most mobile devices. The app must be open and active for voice triggers to work.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-sand">
            <CheckCircle className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">Proper Configuration</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            It is your responsibility to ensure that your trigger phrases are distinct, your emergency contacts are correctly entered, and your device has a stable internet connection and location services enabled.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-center space-x-3 text-brand-charcoal">
            <HelpCircle className="h-6 w-6" />
            <h3 className="text-lg font-bold text-brand-charcoal">No Guarantee</h3>
          </div>
          <p className="text-sm font-medium text-brand-sand leading-relaxed">
            We do not guarantee that an alert will always be successfully triggered or delivered, as this depends on various factors including network availability, browser support, and device settings.
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
