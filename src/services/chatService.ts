import { ref, get, set } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: number;
}

const CHAT_STORAGE_KEY = 'she_nourishes_live_chat_messages';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    sender: 'admin',
    senderName: 'Sneha Dey (Nutritionist)',
    text: 'Hello! Welcome to She Nourishes. I am reviewing your biometrics and daily food log. How are your energy levels and meals feeling today? Ask me any questions here!',
    timestamp: Date.now() - 7200000,
  },
];

export async function getChatMessages(): Promise<ChatMessage[]> {
  try {
    if (isFirebaseConfigured && database) {
      const chatRef = ref(database, 'chat/messages');
      const snap = await get(chatRef);
      if (snap.exists()) {
        const val = snap.val();
        const list: ChatMessage[] = Array.isArray(val) ? val : Object.values(val);
        return list.sort((a, b) => a.timestamp - b.timestamp);
      }
    }
  } catch (e) {
    console.warn('Firebase error fetching chat messages:', e);
  }

  const local = localStorage.getItem(CHAT_STORAGE_KEY);
  if (local) {
    try {
      const parsed: ChatMessage[] = JSON.parse(local);
      return parsed.sort((a, b) => a.timestamp - b.timestamp);
    } catch {}
  }

  saveChatMessages(INITIAL_MESSAGES);
  return INITIAL_MESSAGES;
}

export async function saveChatMessages(messages: ChatMessage[]): Promise<void> {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  try {
    if (isFirebaseConfigured && database) {
      const chatRef = ref(database, 'chat/messages');
      await set(chatRef, messages);
    }
  } catch (e) {
    console.warn('Firebase error saving chat messages:', e);
  }
}

export async function sendChatMessage(sender: 'user' | 'admin', senderName: string, text: string): Promise<ChatMessage[]> {
  const current = await getChatMessages();
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    sender,
    senderName,
    text: text.trim(),
    timestamp: Date.now(),
  };

  const updated = [...current, newMsg];
  await saveChatMessages(updated);
  return updated;
}
