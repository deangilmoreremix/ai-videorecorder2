export interface EndCard {
  id: string;
  type: 'video' | 'playlist' | 'subscribe' | 'link' | 'social';
  title: string;
  url: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    background: string;
    border: string;
    shadow: string;
    opacity: number;
    animation: string;
  };
  timing: {
    start: number;
    duration: number;
    delay: number;
  };
  analytics: {
    clicks: number;
    impressions: number;
    ctr: number;
  };
  platform?: 'youtube' | 'facebook' | 'instagram' | 'twitter';
  layout?: 'grid' | 'overlay' | 'sidebar';
}

export interface EndCardTemplate {
  id: string;
  name: string;
  layout: string;
  cards: Partial<EndCard>[];
}

export interface EndCardAnalytics {
  clicks: number;
  impressions: number;
  ctr: number;
}