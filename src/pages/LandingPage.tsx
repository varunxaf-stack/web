import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mic, Bell, Navigation, ChevronRight } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useFirebase';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-12 pb-12 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-4 rounded-full bg-brand-red/10 blur-2xl animate-pulse" />
        <Shield className="relative h-24 w-24 text-brand-red" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tighter text-brand-charcoal">
          Nirbhaya <span className="text-brand-red">Shield</span>
        </h1>
        <p className="mx-auto max-w-[280px] text-lg font-medium text-brand-sand">
          Your voice is your weapon. Personal safety, redefined for the modern world.
        </p>
      </div>

      <div className="flex w-full flex-col space-y-4 px-4">
        <Link to="/login">
          <Button size="xl" className="w-full">
            Get Started <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link to="/privacy">
          <Button variant="ghost" size="sm" className="w-full text-brand-sand">
            Privacy & Safety First
          </Button>
        </Link>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 px-2">
        <Card className="flex flex-col items-center space-y-2 p-4 text-center">
          <Mic className="h-8 w-8 text-brand-terracotta" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Voice Trigger</h3>
        </Card>
        <Card className="flex flex-col items-center space-y-2 p-4 text-center">
          <Bell className="h-8 w-8 text-brand-terracotta" />
          <h3 className="text-xs font-bold uppercase tracking-widest">SOS Alerts</h3>
        </Card>
        <Card className="flex flex-col items-center space-y-2 p-4 text-center">
          <Navigation className="h-8 w-8 text-brand-terracotta" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Live Location</h3>
        </Card>
        <Card className="flex flex-col items-center space-y-2 p-4 text-center">
          <Shield className="h-8 w-8 text-brand-terracotta" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Trusted Circle</h3>
        </Card>
      </div>

      <div className="space-y-8 px-4 text-left">
        <h2 className="text-2xl font-bold text-brand-charcoal">How it works</h2>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-white font-bold">1</div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-charcoal">Configure Triggers</h4>
              <p className="text-sm text-brand-sand">Add phrases like "Help" or "Save me" that activate the shield.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-white font-bold">2</div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-charcoal">Arm the Shield</h4>
              <p className="text-sm text-brand-sand">Activate listening mode when you're in an unsafe environment.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red text-white font-bold">3</div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-charcoal">Automatic SOS</h4>
              <p className="text-sm text-brand-sand">If a trigger is detected, your trusted contacts are notified instantly.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-brand-sand/20 pt-8 text-xs font-medium text-brand-sand">
        <p>© 2026 Nirbhaya Shield. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
};
