import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { ChatMessage } from '@/types/message';

export const useChatPersistence = (conversationKey: string = 'default') => {
  const storageKey = `wce_emulator_chats_${conversationKey}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        });
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    }
    return [];
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setMessages(JSON.parse(saved, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        }));
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
      setMessages([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (messages.length > 0 || localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  const clearPersistence = () => {
    localStorage.removeItem(storageKey);
    setMessages([]);
    toast.success("Chat history cleared for this channel");
  };

  return { messages, setMessages, clearPersistence };
};