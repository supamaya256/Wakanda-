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
  try {
    if (url.includes('cloudinary.com') && url.includes('/video/upload/')) {
      // If already has 360p transformation, return as is
      if (url.includes('/video/upload/w_640,h_360') || url.includes('/video/upload/h_360')) {
        return url;
      }
      // If has existing transformation (e.g. h_480,q_auto or other)
      if (url.includes('/video/upload/h_480') || url.includes('/video/upload/w_') || url.includes('/video/upload/q_')) {
        return url.replace(/\/video\/upload\/[^/]+\//, '/video/upload/w_640,h_360,c_limit,q_auto:eco/');
      }
      // Standard /video/upload/v...
      return url.replace('/video/upload/', '/video/upload/w_640,h_360,c_limit,q_auto:eco/');
    }
  } catch {
    return url || '';
  }
  return url;
}

export const THREE_D_LOGOS_REVEAL_DATA: ThreeDLogoRevealItem[] = [
  {
    id: '3d-reveal-02',
    title: '3D LOGO REVEAL',
    edition: 'Edition #02',
    styleTag: 'Electric Cyber Burst & Smoke Flares',
    description: 'High-voltage lightning arcs breaking into volumetric smoke with cinematic logo lockup.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609268/VID-20260814-WA0009.mp4',
    category: 'Electric & Laser',
    resolution: '360p Data Saver',
    fps: 30,
    featured: true
  },
  {
    id: '3d-reveal-03',
    title: '3D LOGO REVEAL',
    edition: 'Edition #03',
    styleTag: 'Neon Hologram Pulse & Laser Sweep',
    description: 'Futuristic glowing cyan and magenta wireframe assembly with synchronized electronic sweep FX.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609263/VID-20260810-WA0049.mp4',
    category: 'Neon & Cyber',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-04',
    title: '3D LOGO REVEAL',
    edition: 'Edition #04',
    styleTag: 'Molten Flare Extrusion & Shockwave',
    description: 'Intense fiery combustion revealing heavy beveled typography with shockwave blast.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789608429/InShot_20260829_041540077.mp4',
    category: 'Pyro & Impact',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-05',
    title: '3D LOGO REVEAL',
    edition: 'Edition #05',
    styleTag: 'Cris Pro Chrome Reflection Studio',
    description: 'Polished mirror chrome typography navigating 3D studio light chambers with crystal acoustic sting.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122909/CRIS_PRO.mp4',
    category: 'Studio Master',
    resolution: '360p Data Saver',
    fps: 30,
    featured: true
  },
  {
    id: '3d-reveal-06',
    title: '3D LOGO REVEAL',
    edition: 'Edition #06',
    styleTag: 'Simo DJ Sonic Wave Explosion',
    description: 'Audio-reactive subwoofer blast breaking the dimensional barrier with club LED strobe transitions.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122922/SIMO_DJ.mp4',
    category: 'Electric & Laser',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-07',
    title: '3D LOGO REVEAL',
    edition: 'Edition #07',
    styleTag: 'Ibra Pro Laser Vortex & Bevel Glow',
    description: 'Twin high-speed laser beams carving through dark space to unveil multi-layered dimensional typography.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122937/IBRA_PRO.mp4',
    category: 'Electric & Laser',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-08',
    title: '3D LOGO REVEAL',
    edition: 'Edition #08',
    styleTag: 'Cinematic Ember Blast & Smoke Drift',
    description: 'Atmospheric burning embers and drifting stage mist framing an explosive gold metallic crest.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122966/InShot_20260901_180733541.mp4',
    category: 'Pyro & Impact',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-09',
    title: '3D LOGO REVEAL',
    edition: 'Edition #09',
    styleTag: 'Riskyboy Titanium Glitch & Warp',
    description: 'Brutalist brushed titanium structure with digital glitch displacement and stadium sound design.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122981/RISKYBOY.mp4',
    category: 'Studio Master',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-10',
    title: '3D LOGO REVEAL',
    edition: 'Edition #10',
    styleTag: 'Hyper-Speed Dynamic Spin & Laser Glint',
    description: 'Aerodynamic angled typography accelerating into camera space with anamorphic lens glints.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122985/InShot_20260829_022842934.mp4',
    category: 'Metallic & Gold',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-11',
    title: '3D LOGO REVEAL',
    edition: 'Edition #11',
    styleTag: 'Emma Signature Gold 3D Extrusion',
    description: 'The definitive DJ Emma Pro FX signature 3D emblem with 24k gold leaf shaders and sub-drop.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123066/EMMA-1_1.mp4',
    category: 'Studio Master',
    resolution: '360p Data Saver',
    fps: 30,
    featured: true
  },
  {
    id: '3d-reveal-12',
    title: '3D LOGO REVEAL',
    edition: 'Edition #12',
    styleTag: 'Emma Masterpiece Cinema Reveal',
    description: 'Slow-motion cinematic reveal with orchestral brass build-up and mirror floor reflection.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123058/emma1.mp4',
    category: 'Studio Master',
    resolution: '360p Data Saver',
    fps: 30
  },
  {
    id: '3d-reveal-13',
    title: '3D LOGO REVEAL',
    edition: 'Edition #13',
    styleTag: 'Dick Pro Quantum Particle Collapse',
    description: 'Billions of glowing energy particles collapsing inward to forge a solid metallic DJ moniker.',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123102/dick_pro.mp4',
    category: 'Neon & Cyber',
    resolution: '360p Data Saver',
    fps: 30
  }
];
