import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Navigation, Phone, MessageCircle, X, AlertCircle } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { useAuth, useContacts } from '../hooks/useFirebase';
import { alertService } from '../services/alertService';
import { motion, AnimatePresence } from 'motion/react';

export const SOSPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { contacts } = useContacts(user?.uid);
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerPhrase = location.state?.phrase || 'Manual SOS';

  useEffect(() => {
    if (countdown > 0 && !isTriggered) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !isTriggered) {
      handleTrigger();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, isTriggered]);

  const handleTrigger = async () => {
    setIsTriggered(true);
    alertService.startSiren();
    if (user) {
      try {
        const id = await alertService.triggerSOS(user.uid, triggerPhrase, contacts);
        setAlertId(id);
        // Get current location for WhatsApp links
        navigator.geolocation.getCurrentPosition((pos) => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      } catch (error) {
        console.error('SOS Trigger failed:', error);
      }
    }
  };

  const handleCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    alertService.stopSiren();
    navigate('/dashboard');
  };

  const enabledContacts = contacts.filter(c => c.enabled);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-12 py-12 text-center">
      <AnimatePresence mode="wait">
        {!isTriggered ? (
          <motion.div
            key="countdown"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="space-y-12"
          >
            <div className="relative">
              <div className="absolute -inset-12 rounded-full bg-brand-red/10 blur-3xl animate-pulse" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-brand-red bg-white shadow-2xl shadow-brand-red/20">
                <span className="text-7xl font-black text-brand-red">{countdown}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-brand-charcoal uppercase">SOS Triggered</h2>
              <p className="mx-auto max-w-[280px] text-lg font-bold text-brand-sand">
                Triggered by: <span className="text-brand-red">"{triggerPhrase}"</span>
              </p>
            </div>

            <div className="w-full space-y-4 px-4">
              <Button size="xl" variant="outline" className="w-full py-6 border-brand-red text-brand-red hover:bg-brand-red/5" onClick={handleCancel}>
                <X className="mr-2 h-6 w-6" /> Cancel SOS
              </Button>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-sand">
                Emergency contacts will be notified in {countdown}s
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full space-y-8"
          >
            <div className="relative mx-auto h-24 w-24">
              <div className="absolute -inset-4 rounded-full bg-brand-red/20 blur-xl animate-ping" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-brand-red text-white shadow-2xl">
                <Bell className="h-12 w-12 animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-brand-red uppercase">SOS Active</h2>
              <p className="text-sm font-bold text-brand-sand uppercase tracking-widest">Siren is sounding</p>
            </div>

            <div className="space-y-4 px-2">
              <Card className="border-2 border-brand-red/10 bg-brand-red/5 p-6 text-left">
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-brand-red">Emergency Actions</h3>
                <div className="space-y-3">
                  <Button variant="danger" className="w-full justify-start py-4" onClick={() => window.open('tel:112')}>
                    <Phone className="mr-3 h-5 w-5" /> Call Police (112)
                  </Button>
                  <Button variant="danger" className="w-full justify-start py-4" onClick={() => window.open('tel:102')}>
                    <Phone className="mr-3 h-5 w-5" /> Call Ambulance (102)
                  </Button>
                </div>
              </Card>

              <div className="space-y-3">
                <h3 className="text-left text-xs font-black uppercase tracking-widest text-brand-sand">Notify Trusted Circle</h3>
                {enabledContacts.map(contact => (
                  <Card key={contact.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/10 text-brand-charcoal font-bold">
                        {contact.name[0]}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-brand-charcoal">{contact.name}</h4>
                        <p className="text-xs font-medium text-brand-sand">{contact.relation}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${contact.phone}`)} className="text-brand-charcoal">
                        <Phone className="h-5 w-5" />
                      </Button>
                      {currentLocation && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(alertService.generateWhatsAppLink(contact.whatsapp || contact.phone, currentLocation))} className="text-green-600">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="outline" className="w-full py-4" onClick={handleCancel}>
                <Shield className="mr-2 h-5 w-5" /> Stop SOS & Siren
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
