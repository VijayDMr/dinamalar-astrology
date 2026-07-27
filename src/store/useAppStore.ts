// src/store/useAppStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BirthDetails, SavedHoroscope, RasiData } from '../types/astrology';

interface UserProfile {
  email: string | null;
  name: string;
  avatar: string | null;
}

interface AppState {
  authStatus: 'authenticated_google' | 'authenticated_email' | 'guest';
  userProfile: UserProfile;
  activeBirthDetails: BirthDetails;
  savedHoroscopes: SavedHoroscope[];
  geminiApiKey: string | null;
  
  // Auth Actions
  loginGoogle: () => void;
  loginEmail: (email: string, name: string) => void;
  loginGuest: () => void;
  logout: () => void;

  // Chart Actions
  updateBirthDetails: (details: Partial<BirthDetails>) => void;
  saveHoroscope: (name: string, gender: 'male' | 'female' | 'other', details: BirthDetails) => void;
  loadHoroscope: (id: string) => void;
  deleteHoroscope: (id: string) => void;
  
  // Settings/Admin Actions
  setGeminiKey: (key: string | null) => void;
}

// Default birth details seeded for a luxury out-of-the-box experience
const defaultBirthDetails: BirthDetails = {
  name: 'விஜய் (Vijay)',
  date: '1995-10-15',
  time: '08:30',
  location: 'Chennai, Tamil Nadu, India',
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 5.5
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      authStatus: 'guest',
      userProfile: {
        email: null,
        name: 'Guest User',
        avatar: null
      },
      activeBirthDetails: defaultBirthDetails,
      savedHoroscopes: [
        {
          id: '1',
          name: 'விஜய் (Primary)',
          gender: 'male',
          birthDetails: defaultBirthDetails,
          createdAt: new Date('2026-07-27').toISOString()
        }
      ],
      geminiApiKey: null,

      loginGoogle: () => set({
        authStatus: 'authenticated_google',
        userProfile: {
          email: 'vijay.dmr@gmail.com',
          name: 'Vijay DMR',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        }
      }),

      loginEmail: (email, name) => set({
        authStatus: 'authenticated_email',
        userProfile: {
          email,
          name,
          avatar: null
        }
      }),

      loginGuest: () => set({
        authStatus: 'guest',
        userProfile: {
          email: null,
          name: 'Guest User',
          avatar: null
        }
      }),

      logout: () => set({
        authStatus: 'guest',
        userProfile: {
          email: null,
          name: 'Guest User',
          avatar: null
        },
        activeBirthDetails: defaultBirthDetails
      }),

      updateBirthDetails: (details) => set((state) => ({
        activeBirthDetails: {
          ...state.activeBirthDetails,
          ...details
        }
      })),

      saveHoroscope: (name, gender, details) => set((state) => {
        const newHoroscope: SavedHoroscope = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          gender,
          birthDetails: details,
          createdAt: new Date().toISOString()
        };
        return {
          savedHoroscopes: [...state.savedHoroscopes, newHoroscope]
        };
      }),

      loadHoroscope: (id) => set((state) => {
        const matched = state.savedHoroscopes.find(h => h.id === id);
        if (matched) {
          return { activeBirthDetails: matched.birthDetails };
        }
        return {};
      }),

      deleteHoroscope: (id) => set((state) => ({
        savedHoroscopes: state.savedHoroscopes.filter(h => h.id !== id)
      })),

      setGeminiKey: (key) => set({ geminiApiKey: key })
    }),
    {
      name: 'dinamalar-astrology-store', // Store state in browser's localStorage
    }
  )
);
