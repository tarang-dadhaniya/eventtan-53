import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

export interface Speaker {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  socialMedia: {
    blogRss: boolean;
    facebook: boolean;
    twitter: boolean;
  };
  blogRssUrl: string;
  facebookUrl: string;
  speakersFor: string;
  description: string;
  profileImage: string;
  documentName: string;
}

@Injectable({
  providedIn: "root",
})
export class SpeakerService {
  private readonly STORAGE_KEY = "eventtan_speakers";
  private speakersSubject = new BehaviorSubject<Speaker[]>(
    this.loadFromStorage(),
  );

  speakers$: Observable<Speaker[]> = this.speakersSubject.asObservable();

  constructor() {}

  private loadFromStorage(): Speaker[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage(speakers: Speaker[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(speakers));
  }

  getSpeakers(): Speaker[] {
    return this.speakersSubject.value;
  }

  getSpeakersByEvent(eventId: string): Speaker[] {
    return this.getSpeakers().filter((speaker) => speaker.eventId === eventId);
  }

  addSpeaker(
    eventId: string,
    speaker: Omit<Speaker, "id" | "eventId">,
  ): Speaker {
    const newSpeaker: Speaker = {
      ...speaker,
      id: this.generateId(),
      eventId: eventId,
    };

    const speakers = [...this.getSpeakers(), newSpeaker];
    this.speakersSubject.next(speakers);
    this.saveToStorage(speakers);
    return newSpeaker;
  }

  updateSpeaker(id: string, updates: Partial<Speaker>): void {
    const speakers = this.getSpeakers().map((speaker) => {
      if (speaker.id === id) {
        return { ...speaker, ...updates };
      }
      return speaker;
    });
    this.speakersSubject.next(speakers);
    this.saveToStorage(speakers);
  }

  deleteSpeaker(id: string): void {
    const speakers = this.getSpeakers().filter((speaker) => speaker.id !== id);
    this.speakersSubject.next(speakers);
    this.saveToStorage(speakers);
  }

  getSpeakerById(id: string): Speaker | undefined {
    return this.getSpeakers().find((speaker) => speaker.id === id);
  }

  private generateId(): string {
    return `speaker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
