import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth, useTriggers } from '../hooks/useFirebase';
import { Button, Card, Input, StatusChip } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { Mic, Plus, Trash2, Settings, ChevronLeft, ChevronRight, Clock, Repeat, Zap } from 'lucide-react';
import { TriggerPhrase } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const TriggersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggers, loading } = useTriggers(user?.uid);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Partial<TriggerPhrase>>({
    text: '',
    repetitionCount: 2,
    timeWindow: 5,
    sensitivity: 0.5,
    enabled: true
  });

  const handleAddTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTrigger.text) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'triggers'), {
        ...newTrigger,
        userId: user.uid
      });
      setShowAddForm(false);
      setNewTrigger({ text: '', repetitionCount: 2, timeWindow: 5, sensitivity: 0.5, enabled: true });
    } catch (error) {
      console.error('Failed to add trigger:', error);
    }
  };

  const handleDeleteTrigger = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'triggers', id));
    } catch (error) {
      console.error('Failed to delete trigger:', error);
    }
  };

  const toggleTrigger = async (trigger: TriggerPhrase) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'triggers', trigger.id), {
        enabled: !trigger.enabled
      });
    } catch (error) {
      console.error('Failed to toggle trigger:', error);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-1 h-5 w-5" /> Add Phrase
        </Button>
      </div>

      <SectionHeader 
        title="Trigger Phrases" 
        subtitle="Configure the words that activate the shield."
      />

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="space-y-4 border-2 border-brand-red/10 bg-brand-red/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-brand-charcoal">New Trigger</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <form onSubmit={handleAddTrigger} className="space-y-6">
                <Input 
                  label="Trigger Phrase" 
                  placeholder="e.g. Help, Save me" 
                  value={newTrigger.text} 
                  onChange={e => setNewTrigger({...newTrigger, text: e.target.value})} 
                  required 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Repetitions" 
                    type="number"
                    min="1"
                    max="10"
                    value={newTrigger.repetitionCount} 
                    onChange={e => setNewTrigger({...newTrigger, repetitionCount: parseInt(e.target.value)})} 
                    required 
                  />
                  <Input 
                    label="Window (sec)" 
                    type="number"
                    min="1"
                    max="60"
                    value={newTrigger.timeWindow} 
                    onChange={e => setNewTrigger({...newTrigger, timeWindow: parseInt(e.target.value)})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-graphite">Sensitivity ({newTrigger.sensitivity})</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    className="w-full accent-brand-red"
                    value={newTrigger.sensitivity}
                    onChange={e => setNewTrigger({...newTrigger, sensitivity: parseFloat(e.target.value)})}
                  />
                </div>
                <Button type="submit" className="w-full">Save Trigger</Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-red border-t-transparent" />
          </div>
        ) : triggers.length === 0 ? (
          <Card className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <div className="rounded-full bg-brand-sand/10 p-6">
              <Mic className="h-12 w-12 text-brand-sand" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-brand-charcoal">No triggers yet</h4>
              <p className="text-sm font-medium text-brand-sand">Add phrases that will trigger an SOS.</p>
            </div>
            <Button size="md" onClick={() => setShowAddForm(true)}>Add Phrase</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {triggers.map((trigger) => (
              <Card key={trigger.id} className={cn(
                "relative flex flex-col space-y-4 p-5 transition-all",
                !trigger.enabled && "opacity-50 grayscale"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <Mic className="h-5 w-5" />
                    </div>
                    <h4 className="text-xl font-black text-brand-charcoal">"{trigger.text}"</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleTrigger(trigger)}
                      className={cn(trigger.enabled ? "text-green-600" : "text-brand-sand")}
                    >
                      {trigger.enabled ? "Active" : "Inactive"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTrigger(trigger.id)} className="text-red-400">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center space-y-1 rounded-xl bg-brand-sand/5 p-2 text-center">
                    <Repeat className="h-3 w-3 text-brand-sand" />
                    <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-widest">{trigger.repetitionCount}x Reps</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 rounded-xl bg-brand-sand/5 p-2 text-center">
                    <Clock className="h-3 w-3 text-brand-sand" />
                    <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-widest">{trigger.timeWindow}s Window</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1 rounded-xl bg-brand-sand/5 p-2 text-center">
                    <Zap className="h-3 w-3 text-brand-sand" />
                    <span className="text-[10px] font-bold text-brand-charcoal uppercase tracking-widest">{trigger.sensitivity} Sens.</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="flex items-center space-x-4 border-2 border-brand-sand/10 bg-brand-sand/5 p-4">
        <Settings className="h-6 w-6 text-brand-sand" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-brand-charcoal">Detection Tip</h4>
          <p className="text-xs font-medium text-brand-sand leading-relaxed">
            Use distinct phrases that you wouldn't normally say. Short, sharp words work best for detection.
          </p>
        </div>
      </Card>
    </div>
  );
};

import { cn } from '../components/UI';
