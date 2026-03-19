import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Settings, History, Navigation, Bell, ChevronRight, AlertCircle } from 'lucide-react';
import { Button, Card, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { useAuth, useUserProfile, useContacts, useTriggers, useAlertHistory } from '../hooks/useFirebase';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);
  const { contacts } = useContacts(user?.uid);
  const { triggers } = useTriggers(user?.uid);
  const { alerts } = useAlertHistory(user?.uid);

  const activeTriggers = triggers.filter(t => t.enabled);
  const enabledContacts = contacts.filter(c => c.enabled);

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title={`Hello, ${profile?.displayName?.split(' ')[0] || 'User'}`} 
        subtitle="Your safety dashboard is ready."
        action={
          <div 
            className="h-12 w-12 overflow-hidden rounded-full border-2 border-brand-sand/20 cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <img src={profile?.photoURL || 'https://picsum.photos/seed/user/200'} alt="Profile" className="h-full w-full object-cover" />
          </div>
        }
      />

      <Card className="relative overflow-hidden border-2 border-brand-red/10 bg-gradient-to-br from-white to-brand-red/5 p-8">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-red/5 blur-3xl" />
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-brand-red/10 blur-xl animate-pulse" />
            <Shield className="relative h-16 w-16 text-brand-red" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-brand-charcoal">Shield Status</h3>
            <StatusChip label="Ready to Arm" active={false} />
          </div>
          <Button size="lg" className="w-full" onClick={() => navigate('/armed')}>
            Arm the Shield <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col justify-between space-y-4 p-5" onClick={() => navigate('/contacts')}>
          <div className="flex items-center justify-between">
            <Users className="h-6 w-6 text-brand-terracotta" />
            <span className="text-2xl font-bold text-brand-charcoal">{enabledContacts.length}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-sand">Trusted Circle</p>
        </Card>
        <Card className="flex flex-col justify-between space-y-4 p-5" onClick={() => navigate('/triggers')}>
          <div className="flex items-center justify-between">
            <Settings className="h-6 w-6 text-brand-terracotta" />
            <span className="text-2xl font-bold text-brand-charcoal">{activeTriggers.length}</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-sand">Active Triggers</p>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-brand-charcoal">Recent Alerts</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-brand-sand">
            View All
          </Button>
        </div>
        {alerts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center space-y-2 py-12 text-center">
            <div className="rounded-full bg-brand-sand/10 p-4">
              <History className="h-8 w-8 text-brand-sand" />
            </div>
            <p className="text-sm font-medium text-brand-sand">No alert history found.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 3).map(alert => (
              <Card key={alert.id} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    alert.status === 'triggered' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-sand/10 text-brand-sand'
                  )}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-charcoal capitalize">{alert.status}</h4>
                    <p className="text-xs font-medium text-brand-sand">
                      {alert.timestamp.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-brand-sand" />
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="flex items-center space-x-4 border-2 border-brand-sand/10 bg-brand-sand/5 p-4">
        <AlertCircle className="h-6 w-6 text-brand-sand" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-charcoal">Browser Limitations</h4>
          <p className="text-xs font-medium text-brand-sand leading-relaxed">
            Voice detection requires the app to be open and active. Background listening is not supported on mobile browsers.
          </p>
        </div>
      </Card>
    </div>
  );
};

import { cn } from '../components/UI';
