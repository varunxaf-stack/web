import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAlertHistory } from '../hooks/useFirebase';
import { Button, Card, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { History, Bell, Navigation, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, loading } = useAlertHistory(user?.uid);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
      </div>

      <SectionHeader 
        title="Alert History" 
        subtitle="Review your past SOS triggers and events."
      />

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
          </div>
        ) : alerts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <div className="rounded-full bg-brand-sand/10 p-6">
              <History className="h-12 w-12 text-brand-sand" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-brand-charcoal">No alerts yet</h4>
              <p className="text-sm font-medium text-brand-sand">Your SOS history will appear here.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      alert.status === 'triggered' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-sand/10 text-brand-sand'
                    )}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-brand-charcoal capitalize">{alert.status}</h4>
                      <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-sand">
                        <Calendar className="h-3 w-3" />
                        <span>{alert.timestamp.toDate().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{alert.timestamp.toDate().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <StatusChip label={alert.status} active={alert.status === 'triggered'} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 rounded-xl bg-brand-sand/5 p-3">
                    <MapPin className="h-4 w-4 text-brand-terracotta" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">Location</p>
                      <p className="text-xs font-bold text-brand-charcoal">
                        {alert.location ? `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rounded-xl bg-brand-sand/5 p-3">
                    <Users className="h-4 w-4 text-brand-terracotta" />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">Notified</p>
                      <p className="text-xs font-bold text-brand-charcoal">
                        {alert.recipients?.length || 0} Contacts
                      </p>
                    </div>
                  </div>
                </div>

                {alert.triggerPhrase && (
                  <div className="flex items-center space-x-2 rounded-xl border border-brand-red/10 bg-brand-red/5 p-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-white">
                      <Shield className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-bold text-brand-charcoal">
                      Triggered by: <span className="text-brand-red">"{alert.triggerPhrase}"</span>
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { cn } from '../components/UI';
