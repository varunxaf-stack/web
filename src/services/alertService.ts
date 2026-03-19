import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AlertEvent, EmergencyContact } from '../types';

export class AlertService {
  private sirenAudio: HTMLAudioElement | null = null;

  constructor() {
    this.sirenAudio = new Audio('https://www.soundjay.com/mechanical/sounds/siren-1.mp3');
    this.sirenAudio.loop = true;
  }

  public async triggerSOS(userId: string, triggerPhrase: string, contacts: EmergencyContact[]): Promise<string> {
    const location = await this.getCurrentLocation();
    const alert: Omit<AlertEvent, 'id'> = {
      userId,
      timestamp: Timestamp.now(),
      location,
      triggerPhrase,
      status: 'triggered',
      recipients: contacts.filter(c => c.enabled).map(c => c.name)
    };

    const docRef = await addDoc(collection(db, 'users', userId, 'alerts'), alert);
    return docRef.id;
  }

  public startSiren() {
    if (this.sirenAudio) {
      this.sirenAudio.play().catch(e => console.error('Siren play failed:', e));
    }
  }

  public stopSiren() {
    if (this.sirenAudio) {
      this.sirenAudio.pause();
      this.sirenAudio.currentTime = 0;
    }
  }

  public generateWhatsAppLink(phone: string, location: { lat: number, lng: number }) {
    const mapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    const message = `EMERGENCY! I need help. My location: ${mapsLink}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  private async getCurrentLocation(): Promise<{ lat: number, lng: number, accuracy: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }
}

export const alertService = new AlertService();
