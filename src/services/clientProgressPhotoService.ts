/**
 * Client Progress Photo & Scanner Service
 * Manages front, side, and back body composition progress photos,
 * scanner snapshots, timestamps, and body weight logs.
 * Syncs with Firebase Realtime Database & LocalStorage.
 */

import { database, isFirebaseConfigured } from './firebase';
import { ref, get, set, remove } from 'firebase/database';
import type { ClientProgressPhotoItem } from '../types/longTermSupport';

const STORAGE_PHOTO_PREFIX = 'she_nourishes_progress_photos_';

export async function getProgressPhotos(clientId: string): Promise<ClientProgressPhotoItem[]> {
  // Check Firebase RTDB
  if (isFirebaseConfigured && database) {
    try {
      const snap = await get(ref(database, `customers/${clientId}/progressPhotos`));
      if (snap.exists()) {
        const val = snap.val();
        const arr = Object.values(val) as ClientProgressPhotoItem[];
        arr.sort((a, b) => b.uploadedAt - a.uploadedAt);
        return arr;
      }
    } catch (e) {
      console.warn('Firebase getProgressPhotos fallback:', e);
    }
  }

  // Check LocalStorage
  try {
    const raw = localStorage.getItem(`${STORAGE_PHOTO_PREFIX}${clientId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  // Default initial photos for demo
  const defaults: ClientProgressPhotoItem[] = [
    {
      id: 'photo_init_1',
      date: '2026-09-15',
      photoType: 'Front',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
      weightKg: 68.5,
      notes: 'Baseline posture & front waist assessment.',
      uploadedBy: 'Admin',
      uploadedAt: Date.now() - 86400000 * 16,
    },
    {
      id: 'photo_init_2',
      date: '2026-09-29',
      photoType: 'Side',
      imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
      weightKg: 66.8,
      notes: 'Visible abdominal toning and improved thoracic alignment.',
      uploadedBy: 'Admin',
      uploadedAt: Date.now() - 86400000 * 2,
    }
  ];
  return defaults;
}

export async function addProgressPhoto(
  clientId: string,
  photo: Omit<ClientProgressPhotoItem, 'id' | 'uploadedAt'>
): Promise<ClientProgressPhotoItem> {
  const item: ClientProgressPhotoItem = {
    ...photo,
    id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    uploadedAt: Date.now(),
  };

  const key = `${STORAGE_PHOTO_PREFIX}${clientId}`;
  let list: ClientProgressPhotoItem[] = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) list = JSON.parse(raw);
  } catch {}

  list.unshift(item);
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}

  if (isFirebaseConfigured && database) {
    try {
      await set(ref(database, `customers/${clientId}/progressPhotos/${item.id}`), item);
    } catch (e) {
      console.warn(e);
    }
  }

  window.dispatchEvent(new CustomEvent('progress_photo_added', { detail: item }));
  return item;
}

export async function deleteProgressPhoto(clientId: string, photoId: string): Promise<void> {
  const key = `${STORAGE_PHOTO_PREFIX}${clientId}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const list = (JSON.parse(raw) as ClientProgressPhotoItem[]).filter(p => p.id !== photoId);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch {}

  if (isFirebaseConfigured && database) {
    try {
      await remove(ref(database, `customers/${clientId}/progressPhotos/${photoId}`));
    } catch (e) {
      console.warn(e);
    }
  }
}
