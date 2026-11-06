export interface LogoItem {
  id: string;
  title: string;
  style: string;
  category: string;
  videoUrl: string;
  priceUgx: string;
  priceUsd: string;
  resolution: string;
  matchScore: number;
  tags: string[];
}

export function ensure360pUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "";
  return url;
}

export const ensure480pUrl = ensure360pUrl;

export const LOGO_ITEMS_DATA: LogoItem[] = [
  {
    id: '3d-logo-01',
    title: '3D LOGO ANIMATION • VOL. 1',
    style: 'High-Voltage Lightning & Bass Impact',
    category: 'Neon & Electric',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(1).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 99,
    tags: ['Electric Sparks', 'Bass Impact', 'Club Visual']
  },
  {
    id: '3d-logo-02',
    title: '3D LOGO ANIMATION • VOL. 2',
    style: 'Electric Cyber Burst & Neon Flares',
    category: 'Neon & Electric',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(2).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 98,
    tags: ['Cyber Neon', 'Smoke Flares', 'Stage Intro']
  },
  {
    id: '3d-logo-03',
    title: '3D LOGO ANIMATION • VOL. 3',
    style: 'Hologram Grid & Laser Sweep Flare',
    category: '3D Extrusion',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(3).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 99,
    tags: ['Laser Sweep', 'Heavy 3D', 'Festival Stage']
  },
  {
    id: '3d-logo-04',
    title: '3D LOGO ANIMATION • VOL. 4',
    style: 'Molten Gold Liquid & Flame Shockwave',
    category: 'Gold & Metallic',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(4).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 98,
    tags: ['Molten Gold', 'VIP Mixtape', 'Shockwave Blast']
  },
  {
    id: '3d-logo-05',
    title: '3D LOGO ANIMATION • VOL. 5',
    style: 'Polished Mirror Chrome Studio Loop',
    category: 'Gold & Metallic',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(5).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 99,
    tags: ['Mirror Chrome', 'Studio Master', 'Clean Shimmer']
  },
  {
    id: '3d-logo-06',
    title: '3D LOGO ANIMATION • VOL. 6',
    style: 'Subwoofer Soundwave & Strobe Burst',
    category: 'Sparks & Pyro',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(6).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 98,
    tags: ['Subwoofer Blast', 'LED Strobe', 'Bass Impact']
  },
  {
    id: '3d-logo-07',
    title: '3D LOGO ANIMATION • VOL. 7',
    style: 'Laser Vortex Core & High-Impact Bevel Glow',
    category: 'Neon & Electric',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(7).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 99,
    tags: ['Laser Vortex', 'Bevel Glow', 'Electronic Sting']
  },
  {
    id: '3d-logo-08',
    title: '3D LOGO ANIMATION • VOL. 8 (EDITION #08)',
    style: 'Cinematic Ember Blast & Gold Crest Reveal',
    category: 'Gold & Metallic',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(8).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 100,
    tags: ['Edition 08 Master', 'Gold Crest', 'Cinematic Embers']
  },
  {
    id: '3d-logo-09',
    title: '3D LOGO ANIMATION • VOL. 9',
    style: 'Brushed Titanium Extrusion & Sub-Bass Rumble',
    category: '3D Extrusion',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(9).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 98,
    tags: ['Brushed Titanium', 'Stadium Bass', 'Glitch Impact']
  },
  {
    id: '3d-logo-10',
    title: '3D LOGO ANIMATION • VOL. 10',
    style: 'Hyper-Speed Dynamic Spin & Anamorphic Glint',
    category: 'Gold & Metallic',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(10).mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: 'Full HD 1080p • 60 FPS',
    matchScore: 99,
    tags: ['Hyper Speed', 'Anamorphic Flare', 'Metallic Slam']
  }
];
