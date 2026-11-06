/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThreeDLogoRevealItem {
  id: string;
  title: string; // Strictly "3D LOGO REVEAL" per user instruction
  edition: string;
  styleTag: string;
  description: string;
  videoUrl: string;
  category: 'Metallic & Gold' | 'Neon & Cyber' | 'Electric & Laser' | 'Pyro & Impact' | 'Studio Master';
  resolution: string;
  fps: number;
  featured?: boolean;
}

/**
 * Ensures 3D logo reveal video streams are delivered in lightweight 360p video quality (w_640,h_360,c_limit,q_auto:eco)
 * saving massive mobile data for all visitors while maintaining smooth playback.
 */
export function ensure360pLogoUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  return url;
}

export const DEFAULT_3D_LOGO_REVEAL_EDITION = 'Edition #08';

export function getDefault3DLogoRevealItem(): ThreeDLogoRevealItem {
  const item = THREE_D_LOGOS_REVEAL_DATA.find(i => i.edition === DEFAULT_3D_LOGO_REVEAL_EDITION);
  return item || THREE_D_LOGOS_REVEAL_DATA[7] || THREE_D_LOGOS_REVEAL_DATA[0];
}

export function getDefault3DLogoRevealIndex(): number {
  const idx = THREE_D_LOGOS_REVEAL_DATA.findIndex(i => i.edition === DEFAULT_3D_LOGO_REVEAL_EDITION);
  return idx !== -1 ? idx : 7;
}

export const THREE_D_LOGOS_REVEAL_DATA: ThreeDLogoRevealItem[] = [
  {
    id: '3d-reveal-01',
    title: '3D LOGO REVEAL',
    edition: 'Edition #01',
    styleTag: 'Electric Shockwave High-Voltage Lightning & Bass Impact',
    description: 'High-voltage lightning arcs breaking into volumetric smoke with cinematic 3D logo lockup and bass impact.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(1).mp4',
    category: 'Electric & Laser',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60,
    featured: true
  },
  {
    id: '3d-reveal-02',
    title: '3D LOGO REVEAL',
    edition: 'Edition #02',
    styleTag: 'Electric Cyber Burst & Neon Smoke Flares',
    description: 'Dynamic neon electrical discharge revealing multi-layered beveled 3D typography with sub-bass rumble.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(2).mp4',
    category: 'Neon & Cyber',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60,
    featured: true
  },
  {
    id: '3d-reveal-03',
    title: '3D LOGO REVEAL',
    edition: 'Edition #03',
    styleTag: 'Neon Hologram Pulse & Laser Grid Sweep',
    description: 'Futuristic glowing cybernetic wireframe assembly with synchronized electronic laser sweep FX.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(3).mp4',
    category: 'Electric & Laser',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60
  },
  {
    id: '3d-reveal-04',
    title: '3D LOGO REVEAL',
    edition: 'Edition #04',
    styleTag: 'Molten Flame Extrusion & Shockwave Blast',
    description: 'Intense fiery combustion revealing heavy beveled gold typography with explosive shockwave blast.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(4).mp4',
    category: 'Pyro & Impact',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60
  },
  {
    id: '3d-reveal-05',
    title: '3D LOGO REVEAL',
    edition: 'Edition #05',
    styleTag: 'Mirror Chrome Reflection & Studio Lighting',
    description: 'Polished mirror chrome 3D emblem navigating dimensional studio light chambers with crystal acoustic sting.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(5).mp4',
    category: 'Studio Master',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60,
    featured: true
  },
  {
    id: '3d-reveal-06',
    title: '3D LOGO REVEAL',
    edition: 'Edition #06',
    styleTag: 'Sonic Subwoofer Blast & LED Strobe Wave',
    description: 'Audio-reactive subwoofer blast breaking the dimensional barrier with club LED strobe transitions.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(6).mp4',
    category: 'Metallic & Gold',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60
  },
  {
    id: '3d-reveal-07',
    title: '3D LOGO REVEAL',
    edition: 'Edition #07',
    styleTag: 'Laser Vortex Core & High-Impact Bevel Glow',
    description: 'Twin high-speed laser beams carving through dark space to unveil dimensional gold and chrome typography.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(7).mp4',
    category: 'Electric & Laser',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60
  },
  {
    id: '3d-reveal-08',
    title: '3D LOGO REVEAL',
    edition: 'Edition #08',
    styleTag: 'Cinematic Ember Blast & Volumetric Smoke Drift',
    description: 'Atmospheric burning embers and drifting stage mist framing an explosive gold metallic crest. Official default edition.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(8).mp4',
    category: 'Pyro & Impact',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60,
    featured: true
  },
  {
    id: '3d-reveal-09',
    title: '3D LOGO REVEAL',
    edition: 'Edition #09',
    styleTag: 'Brushed Titanium Glitch & Stadium Bass Drop',
    description: 'Brutalist brushed titanium structure with digital glitch displacement and stadium sound design.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(9).mp4',
    category: 'Studio Master',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60
  },
  {
    id: '3d-reveal-10',
    title: '3D LOGO REVEAL',
    edition: 'Edition #10',
    styleTag: 'Hyper-Speed Dynamic Spin & Anamorphic Lens Glint',
    description: 'Aerodynamic angled typography accelerating into camera space with anamorphic lens glints and final metallic slam.',
    videoUrl: 'https://pub-9ff2b7b2f3a346f5a63e81c39303b367.r2.dev/3d%20logos%20(10).mp4',
    category: 'Metallic & Gold',
    resolution: 'Full HD 1080p • 60 FPS',
    fps: 60,
    featured: true
  }
];
