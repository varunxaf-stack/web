import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, collection, query, orderBy, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, EmergencyContact, TriggerPhrase, AlertEvent } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, loading, setLoading };
}

export function useUserProfile(uid: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      setProfile(doc.exists() ? (doc.data() as UserProfile) : null);
      setLoading(false);
    });
  }, [uid]);

  return { profile, loading };
}

export function useContacts(uid: string | undefined) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'contacts'), orderBy('priority', 'asc'));
    return onSnapshot(q, (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmergencyContact)));
      setLoading(false);
    });
  }, [uid]);

  return { contacts, loading };
}

export function useTriggers(uid: string | undefined) {
  const [triggers, setTriggers] = useState<TriggerPhrase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'triggers'));
    return onSnapshot(q, (snapshot) => {
      setTriggers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TriggerPhrase)));
      setLoading(false);
    });
  }, [uid]);

  return { triggers, loading };
}

export function useAlertHistory(uid: string | undefined) {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, 'users', uid, 'alerts'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AlertEvent)));
      setLoading(false);
    });
  }, [uid]);

  return { alerts, loading };
}
