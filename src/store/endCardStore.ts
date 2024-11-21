import { create } from 'zustand';
import { EndCard, EndCardTemplate } from '../types/endCards';

interface EndCardStore {
  endCards: EndCard[];
  selectedCardId: string | null;
  previewMode: boolean;
  templates: EndCardTemplate[];
  addEndCard: (card: EndCard) => void;
  updateEndCard: (id: string, updates: Partial<EndCard>) => void;
  removeEndCard: (id: string) => void;
  setSelectedCard: (id: string | null) => void;
  togglePreviewMode: () => void;
  duplicateCard: (id: string) => void;
  applyTemplate: (template: EndCardTemplate) => void;
  updateCardAnalytics: (id: string, clicks: number, impressions: number) => void;
}

export const useEndCardStore = create<EndCardStore>((set) => ({
  endCards: [],
  selectedCardId: null,
  previewMode: false,
  templates: [
    {
      id: 'youtube-standard',
      name: 'YouTube Standard',
      layout: 'grid',
      cards: [
        { type: 'video', position: { x: 70, y: 20 }, size: { width: 25, height: 25 } },
        { type: 'playlist', position: { x: 70, y: 50 }, size: { width: 25, height: 25 } },
        { type: 'subscribe', position: { x: 20, y: 80 }, size: { width: 30, height: 10 } }
      ]
    },
    {
      id: 'social-bundle',
      name: 'Social Bundle',
      layout: 'overlay',
      cards: [
        { type: 'social', platform: 'youtube', position: { x: 10, y: 10 } },
        { type: 'social', platform: 'instagram', position: { x: 10, y: 30 } },
        { type: 'social', platform: 'twitter', position: { x: 10, y: 50 } }
      ]
    }
  ],

  addEndCard: (card) => set((state) => ({
    endCards: [...state.endCards, card],
    selectedCardId: card.id
  })),

  updateEndCard: (id, updates) => set((state) => ({
    endCards: state.endCards.map((card) =>
      card.id === id ? { ...card, ...updates } : card
    )
  })),

  removeEndCard: (id) => set((state) => ({
    endCards: state.endCards.filter((card) => card.id !== id),
    selectedCardId: state.selectedCardId === id ? null : state.selectedCardId
  })),

  setSelectedCard: (id) => set({ selectedCardId: id }),

  togglePreviewMode: () => set((state) => ({ previewMode: !state.previewMode })),

  duplicateCard: (id) => set((state) => {
    const card = state.endCards.find((c) => c.id === id);
    if (!card) return state;

    const newCard = {
      ...card,
      id: Math.random().toString(36).substr(2, 9),
      position: {
        x: card.position.x + 5,
        y: card.position.y + 5
      }
    };

    return {
      endCards: [...state.endCards, newCard],
      selectedCardId: newCard.id
    };
  }),

  applyTemplate: (template) => set((state) => {
    const newCards = template.cards.map((cardTemplate) => ({
      id: Math.random().toString(36).substr(2, 9),
      type: cardTemplate.type || 'video',
      title: `New ${cardTemplate.type} card`,
      url: '',
      position: cardTemplate.position || { x: 50, y: 50 },
      size: cardTemplate.size || { width: 20, height: 20 },
      style: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        shadow: 'lg',
        opacity: 1,
        animation: 'fade'
      },
      timing: {
        start: 0,
        duration: 20,
        delay: 0
      },
      analytics: {
        clicks: 0,
        impressions: 0,
        ctr: 0
      },
      platform: cardTemplate.platform
    }));

    return {
      endCards: [...state.endCards, ...newCards]
    };
  }),

  updateCardAnalytics: (id, clicks, impressions) => set((state) => ({
    endCards: state.endCards.map((card) =>
      card.id === id
        ? {
            ...card,
            analytics: {
              clicks,
              impressions,
              ctr: impressions > 0 ? (clicks / impressions) * 100 : 0
            }
          }
        : card
    )
  }))
}));