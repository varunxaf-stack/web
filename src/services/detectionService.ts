import { TriggerPhrase } from '../types';

export interface DetectionResult {
  phrase: string;
  confidence: number;
  timestamp: number;
}

export class DetectionEngine {
  private recognition: any = null;
  private buffer: DetectionResult[] = [];
  private activeTriggers: TriggerPhrase[] = [];
  private onTrigger: (phrase: TriggerPhrase) => void;
  private onResult: (result: DetectionResult) => void;
  private isListening: boolean = false;

  constructor(
    onTrigger: (phrase: TriggerPhrase) => void,
    onResult: (result: DetectionResult) => void
  ) {
    this.onTrigger = onTrigger;
    this.onResult = onResult;
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim().toLowerCase();
        const confidence = event.results[last][0].confidence;
        this.processResult(text, confidence);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition.start();
        }
      };
    }
  }

  public setTriggers(triggers: TriggerPhrase[]) {
    this.activeTriggers = triggers.filter(t => t.enabled);
  }

  public start() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  private processResult(text: string, confidence: number) {
    const result: DetectionResult = {
      phrase: text,
      confidence,
      timestamp: Date.now()
    };
    this.onResult(result);

    // Check against active triggers
    this.activeTriggers.forEach(trigger => {
      const triggerText = trigger.text.toLowerCase();
      if (text.includes(triggerText)) {
        this.buffer.push(result);
        this.checkThreshold(trigger);
      }
    });

    // Clean up old results from buffer
    const maxWindow = Math.max(...this.activeTriggers.map(t => t.timeWindow), 0) * 1000;
    const now = Date.now();
    this.buffer = this.buffer.filter(r => now - r.timestamp < maxWindow);
  }

  private checkThreshold(trigger: TriggerPhrase) {
    const triggerText = trigger.text.toLowerCase();
    const now = Date.now();
    const windowMs = trigger.timeWindow * 1000;

    const matches = this.buffer.filter(r => 
      r.phrase.includes(triggerText) && 
      (now - r.timestamp) < windowMs
    );

    if (matches.length >= trigger.repetitionCount) {
      this.onTrigger(trigger);
      this.buffer = []; // Clear buffer after trigger
    }
  }

  public simulateTrigger(phraseText: string) {
    const trigger = this.activeTriggers.find(t => t.text.toLowerCase() === phraseText.toLowerCase());
    if (trigger) {
      this.onTrigger(trigger);
    }
  }
}
