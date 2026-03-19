import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth, useContacts } from '../hooks/useFirebase';
import { Button, Card, Input } from '../components/UI';
import { SectionHeader } from '../components/Navigation';
import { Users, Plus, Trash2, Phone, MessageCircle, Mail, ChevronLeft, ChevronRight, Star, Shield, Bell } from 'lucide-react';
import { EmergencyContact } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const ContactsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { contacts, loading } = useContacts(user?.uid);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    relation: '',
    phone: '',
    whatsapp: '',
    email: '',
    enabled: true,
    preferredMethod: 'whatsapp'
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newContact.name || !newContact.phone) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'contacts'), {
        ...newContact,
        userId: user.uid,
        priority: contacts.length + 1
      });
      setShowAddForm(false);
      setNewContact({ name: '', relation: '', phone: '', whatsapp: '', email: '', enabled: true, preferredMethod: 'whatsapp' });
    } catch (error) {
      console.error('Failed to add contact:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'contacts', id));
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const toggleContact = async (contact: EmergencyContact) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'contacts', contact.id), {
        enabled: !contact.enabled
      });
    } catch (error) {
      console.error('Failed to toggle contact:', error);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex w-full items-center justify-between px-1">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="mr-1 h-5 w-5" /> Back
        </Button>
        <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
          <Plus className="mr-1 h-5 w-5" /> Add Contact
        </Button>
      </div>

      <SectionHeader 
        title="Trusted Circle" 
        subtitle="Manage your emergency contacts and priority."
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
                <h3 className="text-lg font-bold text-brand-charcoal">New Contact</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <form onSubmit={handleAddContact} className="space-y-4">
                <Input 
                  label="Full Name" 
                  placeholder="e.g. John Doe" 
                  value={newContact.name} 
                  onChange={e => setNewContact({...newContact, name: e.target.value})} 
                  required 
                />
                <Input 
                  label="Relation" 
                  placeholder="e.g. Brother" 
                  value={newContact.relation} 
                  onChange={e => setNewContact({...newContact, relation: e.target.value})} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Phone" 
                    placeholder="+91..." 
                    value={newContact.phone} 
                    onChange={e => setNewContact({...newContact, phone: e.target.value})} 
                    required 
                  />
                  <Input 
                    label="WhatsApp" 
                    placeholder="+91..." 
                    value={newContact.whatsapp} 
                    onChange={e => setNewContact({...newContact, whatsapp: e.target.value})} 
                  />
                </div>
                <Button type="submit" className="w-full">Save Contact</Button>
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
        ) : contacts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
            <div className="rounded-full bg-brand-sand/10 p-6">
              <Users className="h-12 w-12 text-brand-sand" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-brand-charcoal">No contacts yet</h4>
              <p className="text-sm font-medium text-brand-sand">Add your first trusted contact to start.</p>
            </div>
            <Button size="md" onClick={() => setShowAddForm(true)}>Add Contact</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <Card key={contact.id} className={cn(
                "relative flex items-center justify-between p-5 transition-all",
                !contact.enabled && "opacity-50 grayscale"
              )}>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-sand/10 text-xl font-black text-brand-charcoal">
                      {contact.name[0]}
                    </div>
                    {index === 0 && (
                      <div className="absolute -right-1 -top-1 rounded-full bg-brand-red p-1 text-white">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-brand-charcoal">{contact.name}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">{contact.relation}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-brand-sand">
                      <Phone className="h-3 w-3" />
                      <span className="text-xs font-medium">{contact.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleContact(contact)}
                    className={cn(contact.enabled ? "text-green-600" : "text-brand-sand")}
                  >
                    {contact.enabled ? "Enabled" : "Disabled"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact.id)} className="text-red-400">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Card className="flex flex-col space-y-4 border-2 border-brand-sand/10 bg-brand-sand/5 p-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-brand-sand">Emergency Escalation</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white p-4 text-center shadow-sm">
            <Shield className="h-6 w-6 text-brand-red" />
            <h4 className="text-xs font-bold text-brand-charcoal">Police</h4>
            <span className="text-[10px] font-bold text-brand-sand">112</span>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-2xl bg-white p-4 text-center shadow-sm">
            <Bell className="h-6 w-6 text-brand-red" />
            <h4 className="text-xs font-bold text-brand-charcoal">Ambulance</h4>
            <span className="text-[10px] font-bold text-brand-sand">102</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

import { cn } from '../components/UI';
