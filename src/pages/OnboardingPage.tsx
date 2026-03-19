import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useFirebase';
import { Button, Card, Input } from '../components/UI';
import { Shield, Mic, Bell, Navigation, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().onboardingComplete) {
        navigate('/dashboard');
      }
    };
    checkOnboarding();
  }, [user, navigate]);

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        onboardingComplete: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Welcome to Nirbhaya Shield",
      subtitle: "Your personal safety companion. Let's get you set up in 3 simple steps.",
      icon: Shield,
      color: "text-brand-red"
    },
    {
      title: "Microphone Access",
      subtitle: "We need microphone access to listen for your trigger phrases when the shield is armed.",
      icon: Mic,
      color: "text-brand-terracotta"
    },
    {
      title: "Location Access",
      subtitle: "We need your location to send to your trusted contacts in case of an emergency.",
      icon: Navigation,
      color: "text-brand-sand"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-12 py-12 text-center">
      <div className="flex w-full items-center justify-between px-4">
        {step > 1 ? (
          <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
            <ChevronLeft className="mr-1 h-5 w-5" /> Back
          </Button>
        ) : <div />}
        <div className="flex space-x-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              s === step ? "w-6 bg-brand-red" : "bg-brand-sand/30"
            )} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="space-y-8"
        >
          <div className="relative mx-auto h-24 w-24">
            <div className={cn("absolute -inset-4 rounded-full blur-xl opacity-20", currentStep.color.replace('text-', 'bg-'))} />
            <div className={cn("relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-xl", currentStep.color)}>
              <currentStep.icon className="h-12 w-12" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter text-brand-charcoal">{currentStep.title}</h2>
            <p className="mx-auto max-w-[280px] text-sm font-medium text-brand-sand leading-relaxed">
              {currentStep.subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full space-y-4 px-4">
        {step < 3 ? (
          <Button size="xl" className="w-full" onClick={() => setStep(step + 1)}>
            Continue <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        ) : (
          <Button size="xl" className="w-full" onClick={handleComplete} isLoading={loading}>
            Complete Setup <CheckCircle className="ml-2 h-5 w-5" />
          </Button>
        )}
        <p className="text-xs font-bold uppercase tracking-widest text-brand-sand">
          Step {step} of 3
        </p>
      </div>
    </div>
  );
};

import { cn } from '../components/UI';
