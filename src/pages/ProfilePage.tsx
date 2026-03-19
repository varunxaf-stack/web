import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth, useUserProfile } from '../hooks/useFirebase';
import { Button, Card, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { User, LogOut, ChevronLeft, ChevronRight, Shield, Mic, Navigation, Bell, AlertCircle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading } = useUserProfile(user?.uid);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const permissions = [
    { icon: Mic, label: 'Microphone', status: 'Granted', active: true },
    { icon: Navigation, label: 'Location', status: 'Granted', active: true },
    { icon: Bell, label: 'Notifications', status: 'Denied', active: false },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500">
          <LogOut className="mr-1 h-5 w-5" /> Logout
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-4 py-4 text-center">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-brand-red/10 blur-xl animate-pulse" />
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl">
            <img src={profile?.photoURL || 'https://picsum.photos/seed/user/200'} alt="Profile" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-brand-charcoal">{profile?.displayName || 'User'}</h2>
          <p className="text-sm font-medium text-brand-sand">{profile?.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-sand">System Permissions</h3>
        <div className="space-y-3">
          {permissions.map((perm) => (
            <Card key={perm.label} className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/10 text-brand-charcoal">
                  <perm.icon className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-brand-charcoal">{perm.label}</h4>
              </div>
              <StatusChip label={perm.status} active={perm.active} />
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-sand">Account Settings</h3>
        <div className="space-y-3">
          <Card className="flex items-center justify-between p-4" onClick={() => navigate('/location')}>
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/10 text-brand-charcoal">
                <Navigation className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-brand-charcoal">Live Location</h4>
            </div>
            <ChevronRight className="h-5 w-5 text-brand-sand" />
          </Card>
          <Card className="flex items-center justify-between p-4" onClick={() => navigate('/privacy')}>
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/10 text-brand-charcoal">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-brand-charcoal">Privacy Preferences</h4>
            </div>
            <ChevronRight className="h-5 w-5 text-brand-sand" />
          </Card>
          <Card className="flex items-center justify-between p-4" onClick={() => navigate('/terms')}>
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/10 text-brand-charcoal">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-brand-charcoal">Terms & Safety</h4>
            </div>
            <ChevronRight className="h-5 w-5 text-brand-sand" />
          </Card>
        </div>
      </div>

      <div className="pt-8">
        <Button variant="outline" className="w-full border-red-200 text-red-500 hover:bg-red-50">
          <Trash2 className="mr-2 h-5 w-5" /> Reset Account Data
        </Button>
        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-brand-sand">
          Version 1.0.0 (Build 2026.03.19)
        </p>
      </div>
    </div>
  );
};

import { cn } from '../components/UI';
