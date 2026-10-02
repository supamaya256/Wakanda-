import { createContext, useContext, useState, useRef, useEffect, useMemo, ReactNode, RefObject } from 'react';

export interface AudioTrack {
  id: number;
  title: string;
  artist: string;
  durationLabel: string;
  url: string;
  downloadUrl: string;
  filename: string;
  thumbnail: string;
  backdrop: string;
  matchScore: number;
  year: number;
  ageRating: string;
  quality: string;
  genres: string[];
  description: string;
  isTrending?: boolean;
  isVideo?: boolean;
  youtubeId?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  topRank?: number;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 1,
    title: 'STREET ANTHEM 90 • DJ EMMA PRO & WAKANDA DJs',
    artist: 'DJ EMMA PRO x DIVINE DEEJAY UG (FIRE FLAMES DJs)',
    durationLabel: '58:40 Master Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790955038/STREET_ANTHEM_90_DJ_EMMA_PRO_WAKANDA_DJs__DIVINE_DEEJAY_UG_FIRE_FLAMES_DJs_-1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Street_Anthem_90_DJ_Emma_Pro_Wakanda_DJs/v1790955038/STREET_ANTHEM_90_DJ_EMMA_PRO_WAKANDA_DJs__DIVINE_DEEJAY_UG_FIRE_FLAMES_DJs_-1.mp3',
    filename: 'Street_Anthem_90_DJ_Emma_Pro_Wakanda_DJs.mp3',
    thumbnail: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png',
    backdrop: 'https://res.cloudinary.com/foscgxvd/image/upload/v1790956113/file_00000000956c82439256c2a0ce77b093.png',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master 320kbps',
    genres: ['Street Anthem', 'Afrobeats', 'Ugandan Hits', 'Wakanda DJs'],
    description: 'Top Featured Nonstop: STREET ANTHEM 90 by DJ EMMA PRO from Wakanda DJs & Divine Deejay UG Fire Flames DJs. High-energy street bangers, viral Ugandan hits, and non-stop hype transitions. Stream on site or download directly to your phone.',
    isTrending: true,
    topRank: 1
  },
  {
    id: 2,
    title: '2024 ATESO VIDEO MIX VOL 1 VS AFROBEATS & UGANDAN HITS',
    artist: 'DJ EMMA PRO',
    durationLabel: '50:15 Nonstop Mix',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953594/2024_ATESP_VIDEO_MIX_VOLUME_1_VS_AFROBEATS_AND_UGANDAN_HITS_BY_DJ_EMMA_PRO.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:2024_Ateso_Video_Mix_Vol_1_DJ_Emma_Pro/v1790953594/2024_ATESP_VIDEO_MIX_VOLUME_1_VS_AFROBEATS_AND_UGANDAN_HITS_BY_DJ_EMMA_PRO.mp3',
    filename: '2024_Ateso_Video_Mix_Vol_1_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master',
    genres: ['Ateso Nonstop', 'Afrobeats', 'Ugandan Hits'],
    description: '2024 Ateso Video Mix Volume 1 featuring the hottest Afrobeats and Ugandan club hits mixed live by DJ Emma Pro.',
    isTrending: true,
    topRank: 2
  },
  {
    id: 3,
    title: 'BEST OF ATESO GOSPEL VIDEO NONSTOP MIX • WAKANDA EDITION',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '46:30 Gospel Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953809/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO__WAKANDA__Christmas_480p.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Best_Of_Ateso_Gospel_Nonstop_DJ_Emma_Pro/v1790953809/BEST_OF_ATESO_GOSPEL_VIDEO_NONSTOP_MIX_BY_DJ_EMMA_PRO__WAKANDA__Christmas_480p.mp3',
    filename: 'Best_Of_Ateso_Gospel_Nonstop_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    matchScore: 98,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Ateso Gospel', 'Praise & Worship', 'Christmas Nonstop'],
    description: 'Uplifting and powerful Ateso gospel praise and worship video nonstop mix curated by DJ Emma Pro Wakanda.',
    isTrending: true,
    topRank: 3
  },
  {
    id: 4,
    title: 'ATESO NONSTOP SERIES • EPISODE 1',
    artist: 'DJ EMMA PRO',
    durationLabel: '42:15 Cultural Mix',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953809/ATESO_NONSTOP_SERRIES_BY_DJ_EMMA_PRO_1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Ateso_Nonstop_Series_Episode_1_DJ_Emma_Pro/v1790953809/ATESO_NONSTOP_SERRIES_BY_DJ_EMMA_PRO_1.mp3',
    filename: 'Ateso_Nonstop_Series_Episode_1_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Dolby Master 320k',
    genres: ['Ateso Series', 'Teso Traditional', 'Cultural Vibe'],
    description: 'Official Ateso Nonstop Series Episode 1 by DJ Emma Pro. Rich local cultural sounds and modern Teso rhythms.',
    isTrending: true,
    topRank: 4
  },
  {
    id: 5,
    title: 'NEW HITS VS OLD HITS • FULL MIXTAPE',
    artist: 'DJ EMMA PRO x DJ MOSES PRO (WAKANDA DJs)',
    durationLabel: '54:10 Throwback Mix',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954881/NEW_HITS_VS_OLD_HITS_TRIAL_FULL_MIXTAPE_BY_DJ_EMMA_PRO_x_DJ_MOSES_PRO__WAKANDA_DJS_PRESENTS_256k.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:New_Hits_Vs_Old_Hits_Mixtape_DJ_Emma_Pro/v1790954881/NEW_HITS_VS_OLD_HITS_TRIAL_FULL_MIXTAPE_BY_DJ_EMMA_PRO_x_DJ_MOSES_PRO__WAKANDA_DJS_PRESENTS_256k.mp3',
    filename: 'New_Hits_Vs_Old_Hits_Mixtape_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    matchScore: 98,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K',
    genres: ['New vs Old Hits', 'Throwback Hits', 'Club Banger'],
    description: 'Wakanda DJs presents: New Hits vs Old Hits full mixtape blended with master transitions by DJ Emma Pro & DJ Moses Pro.',
    isTrending: true,
    topRank: 5
  },
  {
    id: 6,
    title: 'LIVE MIXTAPE 2025 • KAMPALA UGANDA',
    artist: 'DJ EMMA PRO FT MC RICKY',
    durationLabel: '51:40 Live Party',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954721/LIVE_MIXTAPE_BY_DJ_EMMA_PRO_FT_MC_RICKY_2025_MIX_KAMPALA_UGANADA_1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Live_Mixtape_2025_Kampala_DJ_Emma_Pro_ft_MC_Ricky/v1790954721/LIVE_MIXTAPE_BY_DJ_EMMA_PRO_FT_MC_RICKY_2025_MIX_KAMPALA_UGANADA_1.mp3',
    filename: 'Live_Mixtape_2025_Kampala_DJ_Emma_Pro_ft_MC_Ricky.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    matchScore: 99,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K • Live Master',
    genres: ['Live Hype', 'Club Mixtape', 'Kampala Nightlife'],
    description: 'Electrifying live party mixtape from Kampala Uganda featuring MC Ricky and non-stop club bangers by DJ Emma Pro.',
    isTrending: true,
    topRank: 6
  },
  {
    id: 7,
    title: 'CHALLENGE SCRATCH • KING OF SCRATCH EDITION',
    artist: 'DJ EMMA PRO (THE TOMPAL KING OF SCRATCH)',
    durationLabel: '38:20 Battle Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953880/CHALLENGE_SCRATCH_HOT_JULLY_2022_MIXED_BY_DJ_EMMA_PRO_THE_TOMPAL_FROM_UGANDA_KING_OF_SCRATCH_0761542434_FOR_MORE_INFORM.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Challenge_Scratch_King_Of_Scratch_DJ_Emma_Pro/v1790953880/CHALLENGE_SCRATCH_HOT_JULLY_2022_MIXED_BY_DJ_EMMA_PRO_THE_TOMPAL_FROM_UGANDA_KING_OF_SCRATCH_0761542434_FOR_MORE_INFORM.mp3',
    filename: 'Challenge_Scratch_King_Of_Scratch_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 97,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Turntable Master',
    genres: ['Turntablism', 'Scratch Challenge', 'Ugandan Street'],
    description: 'Masterclass scratch and battle skills by DJ Emma Pro, the King of Scratch from Uganda.',
    isTrending: true,
    topRank: 7
  },
  {
    id: 8,
    title: 'WAKANDA DJZ CONNECTION MIXTAPE',
    artist: 'DJ KING G x DJ EMMA PRO',
    durationLabel: '47:50 Duo Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954191/Current_Djz_Wakanda_Djz_Connection_From_2022_To_2023_Mixtape_Dj_King_G_Dj_Emma_Pro._1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Wakanda_Djz_Connection_Mixtape_Dj_King_G_Dj_Emma_Pro/v1790954191/Current_Djz_Wakanda_Djz_Connection_From_2022_To_2023_Mixtape_Dj_King_G_Dj_Emma_Pro._1.mp3',
    filename: 'Wakanda_Djz_Connection_Mixtape_Dj_King_G_Dj_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    matchScore: 98,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K',
    genres: ['Wakanda Connection', 'Afrobeat Nonstop', 'East African Hits'],
    description: 'Wakanda Deejays Connection mixtape combining the heavy selection of DJ King G and DJ Emma Pro.',
    isTrending: true,
    topRank: 8
  },
  {
    id: 9,
    title: 'THE CHALLENGE SCRATCH 2 HIT SONGS',
    artist: 'DJ EMMA PRO (WAKANDA DJs)',
    durationLabel: '36:15 Battle Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953152/The_challenge_scratch_two_hit_songs__by_DJ_Emma_pro_from_wakanda_DJZ_480p.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:The_Challenge_Scratch_Two_Hit_Songs_DJ_Emma_Pro/v1790953152/The_challenge_scratch_two_hit_songs__by_DJ_Emma_pro_from_wakanda_DJZ_480p.mp3',
    filename: 'The_Challenge_Scratch_Two_Hit_Songs_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_000000007a30824389bfed070b58d613.png',
    matchScore: 97,
    year: 2024,
    ageRating: 'All Ages',
    quality: '480p Master Audio',
    genres: ['Scratch Battle', 'Hit Songs Mashup', 'Wakanda Style'],
    description: 'Challenge scratch volume 2 featuring rapid-fire vinyl scratching and chart-topping Ugandan hit songs.',
    isTrending: true,
    topRank: 9
  },
  {
    id: 10,
    title: 'LATEST UGANDAN MUSIC 2024 • HOT MIX',
    artist: 'DJ EMMA PRO x DJ DIVINE 256',
    durationLabel: '53:05 Hot Mix',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954327/LATEST_UGANDAN_MUSIC_2024_MIXED_BY_DJ_EMMA_PRO_X_DJ_DIVINE_256.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Latest_Ugandan_Music_2024_DJ_Emma_Pro_x_DJ_Divine_256/v1790954327/LATEST_UGANDAN_MUSIC_2024_MIXED_BY_DJ_EMMA_PRO_X_DJ_DIVINE_256.mp3',
    filename: 'Latest_Ugandan_Music_2024_DJ_Emma_Pro_x_DJ_Divine_256.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550683/file_00000000981482069a72d0e793ac5391.png',
    matchScore: 99,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Ugandan Hits 2024', 'Dancehall', 'Afropop'],
    description: 'The biggest and latest 2024 Ugandan songs mixed with surgical precision by DJ Emma Pro and DJ Divine 256.',
    isTrending: true,
    topRank: 10
  },
  {
    id: 11,
    title: 'ALIEN SKIN VS PALLASO • WAKANDA MIX',
    artist: 'DJ EMMA PRO (WAKANDA MIX)',
    durationLabel: '44:20 Clash Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954532/Latest_2023__ALIEN_SKIN_Vs_PALLASO__DJ_EMMA_PRO_WAKANDA_Mix_256k.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Alien_Skin_Vs_Pallaso_Wakanda_Mix_DJ_Emma_Pro/v1790954532/Latest_2023__ALIEN_SKIN_Vs_PALLASO__DJ_EMMA_PRO_WAKANDA_Mix_256k.mp3',
    filename: 'Alien_Skin_Vs_Pallaso_Wakanda_Mix_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550667/IMG-20260723-WA0032.jpg',
    matchScore: 98,
    year: 2024,
    ageRating: '16+',
    quality: 'Studio Master 256k',
    genres: ['Fangone Forest', 'Pallaso vs Alien Skin', 'Ugandan Dancehall'],
    description: 'The legendary musical clash: Alien Skin vs Pallaso in an explosive head-to-head Wakanda nonstop mix by DJ Emma Pro.',
    isTrending: true
  },
  {
    id: 12,
    title: 'DJ EMMA PRO • SURPRISE NONSTOP MIX',
    artist: 'DJ EMMA PRO',
    durationLabel: '49:15 Surprise Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954104/DJ_EMMA_PRO__SUPRISE__NONSTOP__2022_MIX_2.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:DJ_Emma_Pro_Surprise_Nonstop_Mix/v1790954104/DJ_EMMA_PRO__SUPRISE__NONSTOP__2022_MIX_2.mp3',
    filename: 'DJ_Emma_Pro_Surprise_Nonstop_Mix.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550669/IMG-20260713-WA0056.jpg',
    matchScore: 96,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'High Fidelity Master',
    genres: ['Surprise Nonstop', 'Club Party', 'All-Genre Hype'],
    description: 'An unpredictable, high-energy party mix packed with surprises, smooth blends, and club favorites.',
    isTrending: true
  },
  {
    id: 13,
    title: '2025 CLUB BANGERS MIXXX VOL 1',
    artist: 'DJ JOSH PRO OFISHOL x DJ EMMA PRO',
    durationLabel: '55:30 Club Banger',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790953611/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO_256k.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:2025_Club_Bangers_Mix_Vol_1_DJ_Josh_Pro_x_DJ_Emma_Pro/v1790953611/2025_mixtape_CLUB_BANGERS_MIXXX_VOL_1_DJ_JOSH_PRO_OFISHOL_X_DJ_EMMA_PRO_256k.mp3',
    filename: '2025_Club_Bangers_Mix_Vol_1_DJ_Josh_Pro_x_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    matchScore: 99,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K • 256kbps',
    genres: ['2025 Club Bangers', 'Amapiano / Afrobeats', 'Festival Hype'],
    description: '2025 Club Bangers Volume 1 — the ultimate weekend party weapon by DJ Josh Pro Ofishol and DJ Emma Pro.',
    isTrending: true
  },
  {
    id: 14,
    title: 'EPISODE 4 MIX SERIES • DJ EMMA PRO x MC SAMMY',
    artist: 'DJ EMMA PRO x MC SAMMY',
    durationLabel: '48:30 Hype Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954274/episode_four_mix_searies_dj_emma_pro_x_mc_sammy_1.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Episode_Four_Mix_Series_DJ_Emma_Pro_x_MC_Sammy/v1790954274/episode_four_mix_searies_dj_emma_pro_x_mc_sammy_1.mp3',
    filename: 'Episode_Four_Mix_Series_DJ_Emma_Pro_x_MC_Sammy.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 98,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Studio Master',
    genres: ['Live Hypeman', 'Club Series', 'Dancehall & Afro'],
    description: 'Episode 4 of the official DJ Emma Pro mix series with high-octane hype vocals from MC Sammy.',
    isTrending: true
  },
  {
    id: 15,
    title: 'DANCEHALL MIX VOL 19 • WAKANDA ACADEMY',
    artist: 'DJ NATHAN KIM SELECTOR FT DJ EMMA PRO',
    durationLabel: '52:00 Dancehall Nonstop',
    url: 'https://res.cloudinary.com/foscgxvd/video/upload/v1790954020/DANCEHALL_MIX_VOL_19_2023_MIXED_BY_DJ_NATHAN_KIM_SELECTOR_FT_DJ_EMMA_PRO_4RM_WAKANDA_DEEJAYS_ACADEMY_hearthis.at.mp3',
    downloadUrl: 'https://res.cloudinary.com/foscgxvd/video/upload/fl_attachment:Dancehall_Mix_Vol_19_DJ_Nathan_Kim_Selector_ft_DJ_Emma_Pro/v1790954020/DANCEHALL_MIX_VOL_19_2023_MIXED_BY_DJ_NATHAN_KIM_SELECTOR_FT_DJ_EMMA_PRO_4RM_WAKANDA_DEEJAYS_ACADEMY_hearthis.at.mp3',
    filename: 'Dancehall_Mix_Vol_19_DJ_Nathan_Kim_Selector_ft_DJ_Emma_Pro.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
    matchScore: 99,
    year: 2024,
    ageRating: 'All Ages',
    quality: 'HearThis Master',
    genres: ['Dancehall Vol 19', 'Jamaican Riddims', 'Wakanda Academy'],
    description: 'Heavyweight Caribbean dancehall riddims mixed by DJ Nathan Kim Selector featuring DJ Emma Pro from Wakanda Deejays Academy.',
    isTrending: true
  },
  {
    id: 16,
    title: 'ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO',
    artist: 'DJ EMMA PRO',
    durationLabel: 'YouTube Premiere Nonstop',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786241/ONE_DROP_REGGEA_MIX_VOL_ONE.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1/v1789786241/ONE_DROP_REGGEA_MIX_VOL_ONE.mp3',
    filename: 'DJ_Emma_Pro_One_Drop_Reggae_Mix_Vol_1.mp3',
    thumbnail: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    backdrop: 'https://i.ytimg.com/vi/TcVAuZcXB5U/hqdefault.jpg',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['One Drop Reggae', 'YouTube Premiere', 'Roots & Culture'],
    description: 'Official YouTube Video Premiere: ONE DROP REGGEA MIX VOL 1 BY DJ EMMA PRO. Smooth conscious reggae rhythms and heavy dub basslines. Anyone can play and stream directly from the website.',
    isTrending: true,
    isVideo: true,
    youtubeId: 'TcVAuZcXB5U',
    youtubeUrl: 'https://youtu.be/TcVAuZcXB5U?si=ABy2rdgBX0KBuf_Y',
    videoUrl: 'https://www.youtube.com/embed/TcVAuZcXB5U',
    topRank: 1
  },
  {
    id: 17,
    title: 'BEST OF ACHOLI NONSTOP TRADITIONAL',
    artist: 'DJ EMMA PRO',
    durationLabel: 'Traditional Nonstop',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789785554/best_of_acholi_nonstop_traditional.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Best_Of_Acholi_Nonstop_Traditional/v1789785554/best_of_acholi_nonstop_traditional.mp3',
    filename: 'Best_Of_Acholi_Nonstop_Traditional.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Studio Master',
    genres: ['Acholi Traditional', 'Roots & Culture'],
    description: 'The finest collection of Acholi traditional nonstop rhythms expertly curated by DJ Emma Pro.',
    isTrending: true,
    topRank: 2
  },
  {
    id: 18,
    title: 'BEST OF VYROOTA NONSTOP 2026 • DJ EMMA PRO',
    artist: 'DJ EMMA PRO',
    durationLabel: '52:18 Nonstop Mix',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786103/best_of_vyroota_full_mixtape.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Best_Of_Vyroota_Nonstop_2026/v1789786103/best_of_vyroota_full_mixtape.mp3',
    filename: 'Best_Of_Vyroota_Nonstop_2026.mp3',
    thumbnail: 'https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg',
    backdrop: 'https://i.ytimg.com/vi/17uskDXOuvY/hqdefault.jpg',
    matchScore: 99,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K • Spatial Audio',
    genres: ['Vyroota Nonstop', 'YouTube Premiere', 'Ugandan Hits', 'Afrobeats'],
    description: 'Official YouTube Nonstop Premiere: BEST OF VYROOTA NONSTOP 2026 (From New Songs to Old Songs Hot Mix) by DJ EMMA PRO. Continuous streaming of Vyroota acoustic gems, club bangers, and chart-topping Ugandan hits.',
    isTrending: true,
    isVideo: true,
    youtubeId: '17uskDXOuvY',
    youtubeUrl: 'https://youtu.be/17uskDXOuvY?si=vsg9XUaI1t83bI0L',
    videoUrl: 'https://www.youtube.com/embed/17uskDXOuvY',
    topRank: 2
  },
  {
    id: 19,
    title: 'EPISODE 2 DJ EMMA PRO FT MC RICKY',
    artist: 'DJ EMMA PRO FT MC RICKY',
    durationLabel: 'Live Club Hype',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786272/episode_2_dj_emma_pro_ft_mc_ricky.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_ft_MC_Ricky_Episode_2/v1789786272/episode_2_dj_emma_pro_ft_mc_ricky.mp3',
    filename: 'DJ_Emma_Pro_ft_MC_Ricky_Episode_2.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 98,
    year: 2026,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K',
    genres: ['Club Mix', 'Hype'],
    description: 'Episode 2 featuring DJ Emma Pro and MC Ricky delivering non-stop hype and club bangers.',
    isTrending: true,
    topRank: 4
  },
  {
    id: 20,
    title: 'OLD SOUTH AFRICA MUSIC MC RICKY',
    artist: 'DJ EMMA PRO FT MC RICKY',
    durationLabel: 'Classic Kwaito Mix',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786279/Old_South_Africa_music_MC_RICKY.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Old_South_Africa_Music_MC_Ricky/v1789786279/Old_South_Africa_music_MC_RICKY.mp3',
    filename: 'Old_South_Africa_Music_MC_Ricky.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg',
    matchScore: 98,
    year: 2026,
    ageRating: '16+',
    quality: 'Dolby Atmos 5.1',
    genres: ['Kwaito', 'House', 'South African Classics'],
    description: 'A nostalgic journey through classic South African club hits hosted by MC Ricky and mixed live by DJ Emma Pro.',
    isTrending: true,
    topRank: 5
  },
  {
    id: 21,
    title: 'EPISODE 1 BY MC RICKY FT DJ EMMA PRO',
    artist: 'MC RICKY FT DJ EMMA PRO',
    durationLabel: 'Episode 1 Hype',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786346/episode1_by_mc_ricky_ft_dj_emma_pro.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:MC_Ricky_ft_DJ_Emma_Pro_Episode_1/v1789786346/episode1_by_mc_ricky_ft_dj_emma_pro.mp3',
    filename: 'MC_Ricky_ft_DJ_Emma_Pro_Episode_1.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 99,
    year: 2025,
    ageRating: 'TV-MA',
    quality: 'Ultra HD 4K • Studio Master',
    genres: ['Hype & Dancehall', 'Club Banger'],
    description: 'Episode 1 featuring MC Ricky hype master and DJ Emma Pro on the turntables.',
    isTrending: true,
    topRank: 6
  },
  {
    id: 22,
    title: 'FULL ATESO MIXTAPE 2026',
    artist: 'DJ EMMA PRO',
    durationLabel: 'Ateso Nonstop',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789786374/full_ateso_mixtape_2026.mp3',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_EMMA_PRO_Full_Ateso_Mixtape_2026/v1789786374/full_ateso_mixtape_2026.mp3',
    filename: 'DJ_EMMA_PRO_Full_Ateso_Mixtape_2026.mp3',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 97,
    year: 2026,
    ageRating: 'TV-MA',
    quality: 'HD Lossless',
    genres: ['Ateso Cultural', 'Eastern Uganda', 'Party Mix'],
    description: 'The absolute best Ateso cultural and modern club mixtape of 2026 curated by DJ Emma Pro.',
    isTrending: true,
    topRank: 7
  },
  {
    id: 23,
    title: 'DJ EMMA PRO INTRO DUBPLATE',
    artist: 'DJ EMMA PRO',
    durationLabel: 'Intro Dubplate',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789682618/INTRO_EMMA_PRO.mp4',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:DJ_Emma_Pro_Intro/v1789682618/INTRO_EMMA_PRO.mp4',
    filename: 'DJ_Emma_Pro_Intro.mp4',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 95,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Studio Master',
    genres: ['Dubplate', 'Intro'],
    description: 'Exclusive custom DJ Emma Pro intro dubplate.',
    isTrending: false,
    topRank: 8
  },
  {
    id: 24,
    title: 'ATESO VIBES EXCLUSIVE',
    artist: 'DJ EMMA PRO',
    durationLabel: 'Exclusive Mix',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789682622/ATESO.mp4',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Ateso_Vibes_Exclusive/v1789682622/ATESO.mp4',
    filename: 'Ateso_Vibes_Exclusive.mp4',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 96,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'HD Lossless',
    genres: ['Ateso', 'Exclusive'],
    description: 'High-energy Ateso vibes curated by DJ Emma Pro.',
    isTrending: true,
    topRank: 9
  },
  {
    id: 25,
    title: 'AMITO STELLA MIX',
    artist: 'DJ EMMA PRO',
    durationLabel: 'Special Mix',
    url: 'https://res.cloudinary.com/hbyqk5y0/video/upload/v1789682628/AMITO_STELLA_MIX.mp4',
    downloadUrl: 'https://res.cloudinary.com/hbyqk5y0/video/upload/fl_attachment:Amito_Stella_Mix/v1789682628/AMITO_STELLA_MIX.mp4',
    filename: 'Amito_Stella_Mix.mp4',
    thumbnail: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    backdrop: 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
    matchScore: 97,
    year: 2026,
    ageRating: 'All Ages',
    quality: 'Ultra HD 4K',
    genres: ['Amito Stella', 'Special Mix'],
    description: 'Amito Stella special musical journey mixed by DJ Emma Pro.',
    isTrending: true,
    topRank: 10
  }
];

interface AudioContextType {
  tracks: AudioTrack[];
  recentTracks: AudioTrack[];
  currentTrackIndex: number;
  currentTrack: AudioTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  downloadStatus: string | null;
  togglePlay: () => void;
  playTrack: (index: number) => void;
  playTrackById: (id: number) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolume: (volume: number) => void;
  adjustVolume: (delta: number) => number;
  toggleMute: () => boolean;
  formatTime: (seconds: number) => string;
  downloadTrack: (track: AudioTrack) => void;
  addTrack: (track: AudioTrack) => void;
  deleteTrack: (id: number) => void;
  resetTracks: () => void;
  togglePiP: () => void;
  favorites: number[];
  favoriteTracks: AudioTrack[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  audioRef: RefObject<HTMLAudioElement | null>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const TRACKS_STORAGE_KEY = 'dj_emma_audio_tracks_v22_street_anthem_art';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem(TRACKS_STORAGE_KEY);
      if (saved) {
        const parsed: AudioTrack[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored tracks don't have Street Anthem 90 with new art, reset to new AUDIO_TRACKS
          const hasStreetAnthemTop = parsed[0]?.url?.includes('STREET_ANTHEM_90') || parsed[0]?.title?.includes('STREET ANTHEM 90');
          const hasNewArt = parsed[0]?.thumbnail?.includes('file_00000000956c82439256c2a0ce77b093');
          const hasAllNonstops = parsed.length >= 15;
          if (!hasStreetAnthemTop || !hasAllNonstops || !hasNewArt) {
            localStorage.removeItem(TRACKS_STORAGE_KEY);
            return AUDIO_TRACKS;
          }
          return parsed.map((t, idx) => ({
            ...t,
            id: t.id || (idx + 1),
            title: t.title || 'Nonstop Mixtape',
            artist: t.artist || 'DJ EMMA PRO',
            url: t.url || (t as any).audioUrl || '',
            downloadUrl: t.downloadUrl || t.url || '',
            filename: t.filename || `${t.title || 'track'}.mp3`,
            genres: Array.isArray(t.genres) ? t.genres : ['Nonstop Mix'],
            durationLabel: t.durationLabel || 'Nonstop',
            thumbnail: t.thumbnail || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
            backdrop: t.backdrop || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1790550689/file_00000000bda08211910e147fbb531635.png',
            matchScore: t.matchScore || 99,
            year: t.year || 2026,
            ageRating: t.ageRating || 'All Ages',
            quality: t.quality || 'Studio Master',
            description: t.description || 'Mastered studio nonstop mixtape by DJ Emma Pro.'
          }));
        }
      }
    } catch (e) {
      console.warn('Failed reading tracks from storage:', e);
    }
    return AUDIO_TRACKS;
  });

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const prevVolumeRef = useRef(0.85);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const [recentTracks, setRecentTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_recent_tracks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load recent tracks:', e);
    }
    return [];
  });

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not load favorites:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      if (Array.isArray(favorites)) {
        localStorage.setItem('dj_emma_favorites', JSON.stringify(favorites));
      }
    } catch (e) {
      console.warn('Could not save favorites:', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const list = Array.isArray(prev) ? prev : [];
      if (list.includes(id)) {
        return list.filter(item => item !== id);
      } else {
        return [...list, id];
      }
    });
  };

  const isFavorite = (id: number) => Boolean(Array.isArray(favorites) && favorites.includes(id));

  const favoriteTracks = useMemo(() => {
    if (!Array.isArray(favorites) || !Array.isArray(tracks)) return [];
    return tracks.filter(t => t && favorites.includes(t.id));
  }, [tracks, favorites]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playbackRate, setPlaybackRateState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dj_emma_playback_rate');
      if (saved) return parseFloat(saved) || 1;
    } catch (e) {}
    return 1;
  });

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    try {
      localStorage.setItem('dj_emma_playback_rate', rate.toString());
    } catch (e) {}
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.warn('Could not save tracks to storage:', e);
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem('dj_emma_recent_tracks', JSON.stringify(recentTracks));
    } catch (e) {
      console.warn('Could not save recent tracks:', e);
    }
  }, [recentTracks]);

  // Ensure index is valid
  const safeIndex = tracks.length > 0 ? Math.min(currentTrackIndex, tracks.length - 1) : 0;
  const currentTrack: AudioTrack = tracks[safeIndex] || AUDIO_TRACKS[0];

  const addTrack = (newTrack: AudioTrack) => {
    if (!newTrack) return;
    const sanitized: AudioTrack = {
      ...newTrack,
      id: newTrack.id || Date.now(),
      title: newTrack.title || 'Nonstop Mixtape',
      artist: newTrack.artist || 'DJ EMMA PRO FX',
      url: newTrack.url || (newTrack as any).audioUrl || '',
      downloadUrl: newTrack.downloadUrl || newTrack.url || '',
      filename: newTrack.filename || `${newTrack.title || 'mixtape'}.mp3`,
      genres: Array.isArray(newTrack.genres) ? newTrack.genres : ['Nonstop Mix'],
      durationLabel: newTrack.durationLabel || 'Nonstop',
      thumbnail: newTrack.thumbnail || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
      backdrop: newTrack.backdrop || 'https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png',
      matchScore: newTrack.matchScore || 99,
      year: newTrack.year || 2026,
      ageRating: newTrack.ageRating || 'All Ages',
      quality: newTrack.quality || 'Studio Master',
      description: newTrack.description || 'Mastered studio nonstop mixtape by DJ Emma Pro FX.'
    };
    setTracks(prev => [sanitized, ...(Array.isArray(prev) ? prev : [])]);
  };

  const deleteTrack = (id: number) => {
    setTracks(prev => {
      const updated = prev.filter(t => t.id !== id);
      return updated.length > 0 ? updated : AUDIO_TRACKS.slice(0, 1);
    });
    if (currentTrack?.id === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      setCurrentTrackIndex(0);
    }
  };

  const resetTracks = () => {
    setTracks(AUDIO_TRACKS);
    localStorage.removeItem(TRACKS_STORAGE_KEY);
  };

  const togglePiP = async () => {
    if (audioRef.current && (document as any).pictureInPictureEnabled) {
      try {
        if ((document as any).pictureInPictureElement) {
          await (document as any).exitPictureInPicture();
        } else if (typeof (audioRef.current as any).requestPictureInPicture === 'function') {
          await (audioRef.current as any).requestPictureInPicture();
        }
      } catch (error) {
        console.error('Failed to enter/exit PIP:', error);
      }
    }
  };

  const downloadTrack = (track: AudioTrack) => {
    setDownloadStatus(`Downloading "${track.title}" to your phone...`);
    const link = document.createElement('a');
    link.href = track.downloadUrl;
    link.setAttribute('download', track.filename);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadStatus(null);
    }, 4500);
  };

  // Initialize audio element once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.preload = 'auto';
    audio.volume = volume;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % (tracks.length > 0 ? tracks.length : AUDIO_TRACKS.length));
    };

    const onError = (e: Event) => {
      const target = e.target as HTMLAudioElement | null;
      const mediaError = target?.error;
      // Code 1: MEDIA_ERR_ABORTED, Code 2: MEDIA_ERR_NETWORK, Code 3: MEDIA_ERR_DECODE, Code 4: MEDIA_ERR_SRC_NOT_SUPPORTED
      if (mediaError && (mediaError.code === 1 || mediaError.code === 4)) {
        // Aborted or format error on empty src - ignore
        return;
      }
      console.warn('Audio playback error code:', mediaError?.code, 'message:', mediaError?.message);
      // Attempt recovery
      setTimeout(() => {
        if (audioRef.current && currentTrack?.url) {
          try {
            audioRef.current.load();
            if (isPlaying) {
              audioRef.current.play().catch(() => {});
            }
          } catch {
            // ignore
          }
        }
      }, 1500);
    };

    const onStalled = () => {
      console.warn('Playback stalled, attempting recovery...');
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('stalled', onStalled);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('stalled', onStalled);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const safePlay = async (audio: HTMLAudioElement) => {
    try {
      audio.playbackRate = playbackRate;
      audio.volume = isMuted ? 0 : volume;
      await audio.play();
      setIsPlaying(true);
      if (typeof window !== 'undefined' && currentTrack) {
        window.dispatchEvent(new CustomEvent('app:track-played', { detail: currentTrack }));
      }
    } catch (err: any) {
      if (
        err &&
        (err.name === 'AbortError' ||
          err.code === 20 ||
          err.message?.includes('interrupted by a new load request') ||
          err.message?.includes('aborted'))
      ) {
        // Interrupted by new load request - normal when switching tracks fast, ignore
        return;
      }
      console.warn('Playback error:', err);
      setIsPlaying(false);
    }
  };

  // Sync track URL change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const wasPlaying = isPlaying;
    audio.src = currentTrack.url;
    audio.load();

    if (wasPlaying) {
      safePlay(audio);
    }

    setRecentTracks(prev => {
      const filtered = prev.filter(t => t.id !== currentTrack.id);
      return [currentTrack, ...filtered].slice(0, 5);
    });
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src === '') {
        audio.src = currentTrack.url;
      }
      safePlay(audio);
    }
  };

  const playTrack = (index: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (index === currentTrackIndex) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        safePlay(audio);
      }
      return;
    }

    setCurrentTrackIndex(index);
    if (tracks[index]) {
      audio.src = tracks[index].url;
      audio.load();
      safePlay(audio);
    }
  };

  const playTrackById = (id: number) => {
    const idx = tracks.findIndex(t => t.id === id);
    if (idx !== -1) {
      playTrack(idx);
    } else {
      const fallbackIdx = AUDIO_TRACKS.findIndex(t => t.id === id);
      if (fallbackIdx !== -1) {
        const targetTrack = AUDIO_TRACKS[fallbackIdx];
        setTracks(prev => [targetTrack, ...prev]);
        setTimeout(() => {
          playTrack(0);
        }, 50);
      }
    }
  };

  const pauseTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIdx);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrack(prevIdx);
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(duration || audio.duration || seconds, seconds));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const seekRelative = (deltaSeconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const cur = audio.currentTime || currentTime || 0;
    const maxDur = duration || audio.duration || 0;
    const target = Math.max(0, maxDur > 0 ? Math.min(maxDur, cur + deltaSeconds) : cur + deltaSeconds);
    seek(target);
  };

  const setVolume = (val: number) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audio) {
      audio.volume = clamped;
    }
  };

  const adjustVolume = (delta: number): number => {
    const nextVal = Math.max(0, Math.min(1, Math.round((volume + delta) * 100) / 100));
    setVolume(nextVal);
    return nextVal;
  };

  const toggleMute = (): boolean => {
    if (isMuted || volume === 0) {
      const restored = prevVolumeRef.current > 0 ? prevVolumeRef.current : 0.85;
      setVolume(restored);
      setIsMuted(false);
      return false; // not muted
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
      return true; // muted
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AudioContext.Provider
      value={{
        tracks,
        recentTracks,
        currentTrackIndex,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        downloadStatus,
        togglePlay,
        playTrack,
        playTrackById,
        pauseTrack,
        nextTrack,
        prevTrack,
        seek,
        seekRelative,
        setVolume,
        adjustVolume,
        toggleMute,
        formatTime,
        downloadTrack,
        addTrack,
        deleteTrack,
        resetTracks,
        togglePiP,
        favorites,
        favoriteTracks,
        toggleFavorite,
        isFavorite,
        playbackRate,
        setPlaybackRate,
        audioRef
      }}
    >
      {children}
      
      {/* Global Audio Player - preload none to save mobile bandwidth */}
      <audio 
        ref={audioRef}
        preload="none"
      />

      {/* Phone Download Notification Toast */}
      {downloadStatus && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-[#090909]/95 text-white border border-[#00ffcc] p-4 rounded-xl shadow-[0_0_30px_rgba(0,255,204,0.4)] backdrop-blur-xl flex items-center gap-3 animate-bounce font-mono">
          <div className="w-8 h-8 rounded-full bg-[#00ffcc]/20 border border-[#00ffcc] flex items-center justify-center shrink-0">
            <span className="text-[#00ffcc] text-sm font-bold">⬇</span>
          </div>
          <div className="text-xs">
            <div className="text-[#00ffcc] font-bold uppercase tracking-wider">SAVING TO DEVICE</div>
            <div className="text-zinc-300 mt-0.5">{downloadStatus}</div>
          </div>
        </div>
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
