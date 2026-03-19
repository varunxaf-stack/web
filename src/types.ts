import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName?: string;
  email: string;
  photoURL?: string;
  phoneNumber?: string;
  onboardingComplete?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relation?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  priority?: number;
  enabled: boolean;
  preferredMethod: 'call' | 'whatsapp' | 'sms';
}

export interface TriggerPhrase {
  id: string;
  userId: string;
  text: string;
  repetitionCount: number;
  timeWindow: number; // in seconds
  sensitivity: number; // 0 to 1
  enabled: boolean;
}

export interface AlertEvent {
  id: string;
  userId: string;
  timestamp: Timestamp;
  location?: {
    lat: number;
    lng: number;
    accuracy: number;
  };
  triggerPhrase?: string;
  status: 'triggered' | 'cancelled' | 'notified' | 'failed';
  recipients?: string[];
}

export interface DetectionSettings {
  sensitivity: number;
  timeWindow: number;
  repetitionCount: number;
}
