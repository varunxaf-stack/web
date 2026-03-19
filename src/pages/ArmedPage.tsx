import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mic, Bell, AlertTriangle, ChevronLeft, Terminal, Play, Square } from 'lucide-react';
import { Button, Card, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { useAuth, useTriggers, useContacts } from '../hooks/useFirebase';
import { DetectionEngine, DetectionResult } from '../services/detectionService';
import { alertService } from '../services/alertService';
import { TriggerPhrase } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ArmedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggers } = useTriggers(user?.uid);
  const { contacts } = useContacts(user?.uid);
  const [isArmed, setIsArmed] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult | null>(null);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const engineRef = useRef<DetectionEngine | null>(null);

  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new DetectionEngine(
        (phrase) => handleTrigger(phrase),
        (result) => setLastResult(result)
      );
    }
    engineRef.current.setTriggers(triggers);
  }, [triggers]);

  const handleTrigger = (phrase: TriggerPhrase) => {
    console.log('TRIGGERED:', phrase.text);
    setIsArmed(false);
    engineRef.current?.stop();
    navigate('/sos', { state: { phrase: phrase.text } });
  };

  const toggleArmed = () => {
    if (isArmed) {
      engineRef.current?.stop();
      setIsArmed(false);
    } else {
      engineRef.current?.start();
      setIsArmed(true);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowDevPanel(!showDevPanel)} className="text-brand-sand">
          <Terminal className="h-5 w-5" />
        </Button>
      </div>

      <SectionHeader 
        title={isArmed ? "Shield Armed" : "Shield Disarmed"} 
        subtitle={isArmed ? "Listening for your trigger phrases..." : "Arm the shield when you feel unsafe."}
      />

      <div className="flex flex-col items-center justify-center space-y-12 py-12">
        <motion.div
          animate={isArmed ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className={cn(
            "absolute -inset-8 rounded-full blur-3xl transition-all duration-1000",
            isArmed ? "bg-brand-red/20 animate-pulse" : "bg-brand-sand/10"
          )} />
          <div className={cn(
            "relative flex h-48 w-48 items-center justify-center rounded-full border-4 transition-all duration-500",
            isArmed ? "border-brand-red bg-white shadow-2xl shadow-brand-red/20" : "border-brand-sand/20 bg-white shadow-lg"
          )}>
            <Shield className={cn(
              "h-24 w-24 transition-all duration-500",
              isArmed ? "text-brand-red" : "text-brand-sand/40"
            )} />
          </div>
        </motion.div>

        <div className="w-full space-y-4 px-4">
          <Button 
            size="xl" 
            variant={isArmed ? "danger" : "primary"} 
            className="w-full py-6"
            onClick={toggleArmed}
          >
            {isArmed ? (
              <><Square className="mr-2 h-6 w-6 fill-current" /> Disarm Shield</>
            ) : (
              <><Play className="mr-2 h-6 w-6 fill-current" /> Arm Shield</>
            )}
          </Button>
          
          <p className="text-center text-xs font-medium text-brand-sand">
            {isArmed ? "Stay safe. We are listening." : "Arming requires microphone permission."}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-brand-charcoal">Active Triggers</h3>
        <div className="flex flex-wrap gap-2">
          {triggers.filter(t => t.enabled).map(trigger => (
            <Card key={trigger.id} className="flex items-center space-x-3 p-3">
              <Mic className="h-4 w-4 text-brand-terracotta" />
              <span className="text-sm font-bold text-brand-charcoal">{trigger.text}</span>
              <span className="text-[10px] font-bold text-brand-sand uppercase tracking-widest">x{trigger.repetitionCount}</span>
            </Card>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showDevPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-brand-graphite text-brand-ivory font-mono text-xs space-y-2 p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold text-brand-terracotta uppercase tracking-widest">Developer Diagnostics</span>
                <Terminal className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p><span className="text-brand-sand">Status:</span> {isArmed ? 'LISTENING' : 'IDLE'}</p>
                <p><span className="text-brand-sand">Latest:</span> {lastResult?.phrase || 'None'}</p>
                <p><span className="text-brand-sand">Confidence:</span> {lastResult?.confidence.toFixed(4) || '0.0000'}</p>
                <p><span className="text-brand-sand">Buffer Size:</span> {triggers.length} triggers active</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={() => engineRef.current?.simulateTrigger(triggers[0]?.text || 'help')}
              >
                Simulate Trigger
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="flex items-center space-x-4 border-2 border-brand-sand/10 bg-brand-sand/5 p-4">
        <AlertTriangle className="h-6 w-6 text-brand-sand" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-charcoal">Safety Note</h4>
          <p className="text-xs font-medium text-brand-sand leading-relaxed">
            Voice detection is a fallback. In immediate danger, use the manual SOS button on the dashboard.
          </p>
        </div>
      </Card>
    </div>
  );
};

import { cn } from '../components/UI';
