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
  try {
    if (url.includes("cloudinary.com") && url.includes("/video/upload/")) {
      if (url.includes("/video/upload/w_640,h_360") || url.includes("/video/upload/h_360")) {
        return url;
      }
      if (url.includes("/video/upload/h_480") || url.includes("/video/upload/w_") || url.includes("/video/upload/q_")) {
        return url.replace(/\/video\/upload\/[^/]+\//, "/video/upload/w_640,h_360,c_limit,q_auto:eco/");
      }
      return url.replace("/video/upload/", "/video/upload/w_640,h_360,c_limit,q_auto:eco/");
    }
  } catch {
    return url || "";
  }
  return url;
}

export const ensure480pUrl = ensure360pUrl;

export const LOGO_ITEMS_DATA: LogoItem[] = [
  {
    id: 'dj-capecious',
    title: 'DJ CAPECIOUS 3D LOGO',
    style: '3D Gold Metallic Spin & Neon Pulse',
    category: 'Gold & Metallic',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609383/DJ_CAPECIOUS.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 99,
    tags: ['3D Metallic', 'Gold Spin', 'Club LED Ready']
  },
  {
    id: 'electric-shockwave-wa0011',
    title: 'ELECTRIC SHOCKWAVE INTRO',
    style: 'High-Voltage Lightning & Bass Impact',
    category: 'Neon & Electric',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609295/VID-20260810-WA0011.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • Data Saver',
    matchScore: 98,
    tags: ['Electric Sparks', 'Bass Impact', 'Transparent Alpha']
  },
  {
    id: 'dj-2m',
    title: 'DJ 2M 3D INTRO STAMP',
    style: 'Heavy Extrusion & Laser Sweep Flare',
    category: '3D Extrusion',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609371/dj_2m.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 99,
    tags: ['Laser Sweep', 'Heavy 3D', 'Festival Stage']
  },
  {
    id: 'official-dj',
    title: 'OFFICIAL DJ LUXURY GOLD',
    style: 'Molten Gold Liquid & Shimmer Explosion',
    category: 'Gold & Metallic',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609348/official_dj.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) Render',
    matchScore: 98,
    tags: ['Molten Gold', 'VIP Mixtape', 'Shimmer FX']
  },
  {
    id: 'shield-sparks',
    title: 'SHIELD LOGO ASSEMBLING (SPARKS)',
    style: 'Steel Shield Lock & Welding Sparks',
    category: 'Sparks & Pyro',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609285/Shield_logo_assembling_with_sparks_202608212101_1.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Transparent',
    matchScore: 99,
    tags: ['Shield Armor', 'Welding Sparks', 'Cinematic Lock']
  },
  {
    id: 'cyber-transformer-3d',
    title: 'CYBERNETIC 3D TRANSFORMER',
    style: 'Multi-Part Mechanical Build & Neon Grid',
    category: 'Cybernetic & Sci-Fi',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609273/Create_3D_logo_animation_202608141634.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 97,
    tags: ['Cyber Mechanical', 'Neon Grid', 'Sci-Fi Build']
  },
  {
    id: 'neon-glow-pulse-wa0056',
    title: 'NEON GLOW PULSE INTRO',
    style: 'Ultra-Vibrant Laser Beams & Smoke Wave',
    category: 'Neon & Electric',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609293/VID-20260810-WA0056.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Alpha Channel',
    matchScore: 99,
    tags: ['Vibrant Lasers', 'Party Smoke', 'Bass Reaction']
  },
  {
    id: 'pyro-flame-wa0009',
    title: 'FLAME & SMOKE PYRO EXPLOSION',
    style: 'Real Fire Embers & Shockwave Slam',
    category: 'Sparks & Pyro',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609268/VID-20260814-WA0009.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 98,
    tags: ['Pyro Shockwave', 'Fire Embers', 'Festival Banger']
  },
  {
    id: 'dark-matter-wa0049',
    title: 'DARK MATTER TITANIUM FLIP',
    style: 'Titanium Specular Flare & Dynamic Flip',
    category: '3D Extrusion',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609263/VID-20260810-WA0049.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Transparent',
    matchScore: 97,
    tags: ['Titanium Metal', 'Dynamic Flip', 'Club Screen']
  },
  {
    id: 'inshot-showcase',
    title: 'DJ EMMA PRO 3D SIGNATURE MASTER',
    style: 'Ultimate 3D Motion & Audio Visualizer',
    category: 'Signature Master',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789608429/InShot_20260829_041540077.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) Master • 60 FPS',
    matchScore: 99,
    tags: ['Signature Master', 'Audio Visualizer', 'WhatsApp Delivery']
  },
  {
    id: 'gold-vip-club-led',
    title: 'GOLD METALLIC VIP ROTATION',
    style: '360° Smooth Rotation with Ambient Gold Reflections',
    category: 'Gold & Metallic',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609383/DJ_CAPECIOUS.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 98,
    tags: ['360 Rotation', 'Club LED Wall', 'VIP Luxury']
  },
  {
    id: 'blue-lightning-shockwave',
    title: 'BLUE LIGHTNING BASS INTRO',
    style: 'Sub-bass Synced High Frequency Blue Arcs',
    category: 'Neon & Electric',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609295/VID-20260810-WA0011.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 99,
    tags: ['Blue Lightning', 'Sub-bass Sync', 'Soundclash']
  },
  {
    id: 'titanium-dubplate-stamp',
    title: 'TITANIUM STEEL DUBPLATE STAMP',
    style: 'Heavy Industrial Steel Stamping & Sound Wave',
    category: '3D Extrusion',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609371/dj_2m.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) Render',
    matchScore: 98,
    tags: ['Industrial Steel', 'Dubplate Intro', 'Heavy Weight']
  },
  {
    id: 'molten-crown-gold',
    title: 'SHIMMERING MOLTEN CROWN 3D',
    style: 'Golden Particle Sparkles & Fluid Metal Glow',
    category: 'Gold & Metallic',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609348/official_dj.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 99,
    tags: ['Golden Crown', 'Liquid Glow', 'Party Intro']
  },
  {
    id: 'armored-shield-battle',
    title: 'ARMORED SHIELD BATTLE ASSEMBLY',
    style: 'Forged Titanium Plates & Laser Welding Burst',
    category: 'Sparks & Pyro',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609285/Shield_logo_assembling_with_sparks_202608212101_1.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Transparent Alpha',
    matchScore: 99,
    tags: ['Armored Shield', 'Laser Welding', 'Clash Ready']
  },
  {
    id: 'cyber-robotic-grid-build',
    title: 'CYBER GRID ROBOTIC LOGO BUILD',
    style: 'Futuristic HUD Interface & Hexagonal Assembly',
    category: 'Cybernetic & Sci-Fi',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609273/Create_3D_logo_animation_202608141634.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) Master • 60 FPS',
    matchScore: 97,
    tags: ['Hexagonal Grid', 'HUD Interface', 'Robot Animation']
  },
  {
    id: 'ultra-violet-laser-pulse',
    title: 'ULTRA VIOLET NEON WAVE 3D',
    style: 'Deep Magenta & Cyan Lasers with Club Fog',
    category: 'Neon & Electric',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609293/VID-20260810-WA0056.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Alpha Overlay',
    matchScore: 99,
    tags: ['Ultra Violet', 'Club Fog', 'Festival Intro']
  },
  {
    id: 'fire-embers-shockwave-slam',
    title: 'FIRE EMBERS & BASS SLAM PYRO',
    style: 'Massive Pyro Blast with Slow-Motion Sparks',
    category: 'Sparks & Pyro',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609268/VID-20260814-WA0009.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Fast Stream • 30 FPS',
    matchScore: 98,
    tags: ['Slow Motion Pyro', 'Bass Slam', 'Stage Ready']
  },
  {
    id: 'dark-chrome-specular-flip',
    title: 'DARK CHROME SPECULAR SHOCKWAVE',
    style: 'Deep Onyx Metal & Reflective Glare Sweep',
    category: '3D Extrusion',
    videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789609263/VID-20260810-WA0049.mp4',
    priceUgx: '18,000 UGX',
    priceUsd: '$5 USD',
    resolution: '360p Video (Data Saver) • Transparent',
    matchScore: 98,
    tags: ['Dark Onyx', 'Reflective Glare', 'Street Mixtape']
  },
    {
      id: 'dj-emma-pro-festival-master',
      title: 'DJ EMMA PRO 3D FESTIVAL STAGE MASTER',
      style: 'Signature 3D Motion Graphics & Equalizer Pulse',
      category: 'Signature Master',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1789608429/InShot_20260829_041540077.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Video (Data Saver) Master • 60 FPS',
      matchScore: 100,
      tags: ['Official Master', 'Equalizer Pulse', 'VIP Delivery']
    },
    {
      id: 'emma-lower-third-3d',
      title: 'EMMA LOWER THIRD 3D',
      style: 'Lower Third Motion & Neon Bar',
      category: 'Gold & Metallic',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123105/EMMA_LOWERT.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Lower Third', 'Neon Bar', 'VIP Intro']
    },
    {
      id: 'dick-pro-signature-stamp',
      title: 'DICK PRO SIGNATURE STAMP',
      style: 'Heavy Extrusion & Laser Sweep',
      category: '3D Extrusion',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123102/dick_pro.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Laser Sweep', 'Heavy 3D', 'Club Ready']
    },
    {
      id: 'emma-1-1-club-intro',
      title: 'EMMA 1.1 CLUB INTRO',
      style: 'High Voltage Spark & Bass Drop',
      category: 'Neon & Electric',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123066/EMMA-1_1.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['High Voltage', 'Bass Drop', 'Club LED']
    },
    {
      id: 'tm-vip-logo-animation',
      title: 'TM VIP LOGO ANIMATION',
      style: 'Gold Shimmer & 360 Rotation',
      category: 'Gold & Metallic',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123066/TM.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Gold Shimmer', '360 Rotation', 'VIP Luxury']
    },
    {
      id: 'emma-1-festival-intro',
      title: 'EMMA 1 FESTIVAL INTRO',
      style: 'Pyro Sparks & Shockwave Slam',
      category: 'Sparks & Pyro',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123058/emma1.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Pyro Sparks', 'Shockwave Slam', 'Festival Stage']
    },
    {
      id: 'dj-emma-pro-text-master',
      title: 'DJ EMMA PRO TEXT MASTER',
      style: 'Signature 3D Typography & Equalizer',
      category: 'Signature Master',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790123050/DJ_EMMA_PRO_TEXT_NAME.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 100,
      tags: ['3D Typography', 'Equalizer', 'Official Stamp']
    },
    {
      id: 'emma-pro-studio-drop-01',
      title: 'EMMA PRO STUDIO DROP 01',
      style: 'Cybernetic Build & Neon Grid',
      category: 'Cybernetic & Sci-Fi',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122985/InShot_20260829_022842934.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Cybernetic Build', 'Neon Grid', 'Studio Drop']
    },
    {
      id: 'risky-boy-signature-stamp',
      title: 'RISKY BOY SIGNATURE STAMP',
      style: 'Dynamic Metallic Flip & Specular Flare',
      category: '3D Extrusion',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122981/RISKYBOY.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Metallic Flip', 'Specular Flare', 'Signature Stamp']
    },
    {
      id: 'emma-pro-club-mix-intro',
      title: 'EMMA PRO CLUB MIX INTRO',
      style: 'Vibrant Laser Beams & Smoke Wave',
      category: 'Neon & Electric',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122966/InShot_20260901_180733541.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Laser Beams', 'Smoke Wave', 'Club Mix']
    },
    {
      id: 'ibra-pro-3d-logo',
      title: 'IBRA PRO 3D LOGO',
      style: 'Gold Metallic Spin & Reflection',
      category: 'Gold & Metallic',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122937/IBRA_PRO.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Gold Metallic', 'Spin Reflection', 'VIP Logo']
    },
    {
      id: 'deejay-master-intro',
      title: 'DEEJAY MASTER INTRO',
      style: 'Shield Armor & Welding Sparks',
      category: 'Sparks & Pyro',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122933/DEEJAY.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Shield Armor', 'Welding Sparks', 'Master Intro']
    },
    {
      id: 'simo-dj-club-intro',
      title: 'SIMO DJ CLUB INTRO',
      style: 'Heavy Steel Extrusion & Laser Sweep',
      category: '3D Extrusion',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122922/SIMO_DJ.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Steel Extrusion', 'Laser Sweep', 'Club Intro']
    },
    {
      id: 'matisto-3d-logo-animation',
      title: 'MATISTO 3D LOGO ANIMATION',
      style: 'Molten Gold Liquid & Shimmer FX',
      category: 'Gold & Metallic',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122922/MATISTO.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Molten Gold', 'Shimmer FX', '3D Animation']
    },
    {
      id: 'cris-pro-signature-stamp',
      title: 'CRIS PRO SIGNATURE STAMP',
      style: 'Electric Lightning & Bass Impact',
      category: 'Neon & Electric',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122909/CRIS_PRO.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 98,
      tags: ['Electric Lightning', 'Bass Impact', 'Signature Stamp']
    },
    {
      id: 'jemo-pro-3d-intro',
      title: 'JEMO PRO 3D INTRO',
      style: 'Pyro Shockwave & Festival Banger',
      category: 'Sparks & Pyro',
      videoUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/w_640,h_360,c_limit,q_auto:eco/v1790122890/JEMO_PRO.mp4',
      priceUgx: '18,000 UGX',
      priceUsd: '$5 USD',
      resolution: '360p Fast Stream • 30 FPS',
      matchScore: 99,
      tags: ['Pyro Shockwave', 'Festival Banger', '3D Intro']
    }
];
