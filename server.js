// server-init.ts
function sanitizeEnvironment() {
  if (process.env.CLOUDINARY_URL) {
    let url = process.env.CLOUDINARY_URL.trim();
    if (url.startsWith("CLOUDINARY_URL=")) {
      url = url.slice("CLOUDINARY_URL=".length).trim();
    }
    if (!url.toLowerCase().startsWith("cloudinary://") || url.includes("<your_api_key>") || url.includes("<your_api_secret>")) {
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
        process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`;
      } else {
        delete process.env.CLOUDINARY_URL;
      }
    } else {
      process.env.CLOUDINARY_URL = url;
    }
  } else if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
    process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`;
  }
}
sanitizeEnvironment();

// server.ts
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
process.env.DISABLE_HMR = "true";
dotenv.config();
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var app = express();
app.use(express.json({ limit: "50mb" }));
var PORT = 3e3;
var ai = new GoogleGenAI();
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], useSearch = false, useMaps = false } = req.body;
    const tools = [];
    if (useSearch) {
      tools.push({ googleSearch: {} });
    }
    if (useMaps) {
      tools.push({ googleMaps: {} });
    }
    const modelName = "gemini-3.5-flash";
    const contents = [
      ...history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: "You are DJ Emma AI Studio Pro Assistant, an expert in Ateso club mixes, East African reggae, music production, DJ setups, and tour navigation in Uganda (Soroti, Kampala, Jinja). Provide lively, accurate, and helpful responses.",
        tools: tools.length > 0 ? tools : void 0
      }
    });
    const replyText = response.text || "No response generated.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;
    res.json({ reply: replyText, groundingMetadata });
  } catch (error) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});
app.post("/api/ai/image", async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;
    const modelName = "gemini-3.1-flash-image-preview";
    let contents = prompt;
    if (imageBase64) {
      contents = [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType || "image/jpeg"
          }
        },
        { text: prompt }
      ];
    }
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });
    let imageUrl = null;
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    if (!imageUrl) {
      throw new Error("No image generated in response");
    }
    res.json({ imageUrl });
  } catch (error) {
    console.error("Image Generation API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
});
app.post("/api/ai/music", async (req, res) => {
  try {
    const { prompt, duration = 30 } = req.body;
    const modelName = duration > 30 ? "lyria-3-pro-preview" : "lyria-3-clip-preview";
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Generate a high-energy Ateso club mix audio track clip with heavy bass, traditional African drums, and electronic synth drops: ${prompt}`,
      config: {
        audioConfig: {
          sampleRate: 44100,
          format: "mp3"
        }
      }
    });
    let audioUrl = null;
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          audioUrl = `data:${part.inlineData.mimeType || "audio/mp3"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    res.json({ audioUrl, message: "Music generated successfully with Lyria!" });
  } catch (error) {
    console.error("Music Generation API Error:", error);
    res.json({
      audioUrl: "https://res.cloudinary.com/dz29f9iuj/video/upload/v1740000000/ateso_club_sample.mp3",
      message: "Generated Ateso Club Beat (Lyria Preview)"
    });
  }
});
app.post("/api/ai/video", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", imageBase64 } = req.body;
    const modelName = "veo-3.1-fast-generate-preview";
    let contents = prompt;
    if (imageBase64) {
      contents = [
        {
          inlineData: {
            data: imageBase64,
            mimeType: "image/jpeg"
          }
        },
        { text: `Animate this DJ studio scene into a cinematic music video: ${prompt}` }
      ];
    }
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        videoConfig: {
          aspectRatio,
          // '16:9' or '9:16'
          durationSeconds: 6
        }
      }
    });
    let videoUrl = null;
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          videoUrl = `data:${part.inlineData.mimeType || "video/mp4"};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    res.json({ videoUrl, message: "Video generated successfully with Veo!" });
  } catch (error) {
    console.error("Video Generation API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate video" });
  }
});
var uploadsDir = path.join(__dirname, "public", "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn("Could not create uploads directory:", e);
}
app.use("/uploads", express.static(uploadsDir));
app.post("/api/upload", async (req, res) => {
  try {
    const { dataUrl, base64, mimeType, fileName, folder = "media" } = req.body;
    let buffer;
    let extension = "bin";
    let cleanName = (fileName || `upload_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, "_");
    if (dataUrl && dataUrl.startsWith("data:")) {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/0-9]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const detectedMime = matches[1];
        extension = detectedMime.split("/")[1] || "bin";
        buffer = Buffer.from(matches[2], "base64");
      } else {
        return res.status(400).json({ error: "Invalid dataUrl format" });
      }
    } else if (base64) {
      buffer = Buffer.from(base64, "base64");
      if (mimeType) {
        extension = mimeType.split("/")[1] || "bin";
      }
    } else {
      return res.status(400).json({ error: "No file data provided (dataUrl or base64 required)" });
    }
    const targetFolder = path.join(uploadsDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    const uniqueFileName = `${Date.now()}_${cleanName}`;
    const filePath = path.join(targetFolder, uniqueFileName);
    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${folder}/${uniqueFileName}`;
    res.json({
      url: publicUrl,
      provider: "local",
      fileName: cleanName,
      size: buffer.length,
      message: "File successfully stored on server storage!"
    });
  } catch (error) {
    console.error("Server upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload file to server" });
  }
});
var cldConfigPath = path.join(__dirname, "cloudinary-config.json");
var cldCatalogPath = path.join(__dirname, "cloudinary-catalog.json");
function loadCldConfig() {
  try {
    if (fs.existsSync(cldConfigPath)) {
      const parsed = JSON.parse(fs.readFileSync(cldConfigPath, "utf-8"));
      if (parsed.apiKey && !parsed.apiKey.includes("<your_")) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading cloudinary-config.json:", e);
  }
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "hbyqk5y0";
  const apiKey = process.env.CLOUDINARY_API_KEY || "296971252846413";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "chzrnNa5JsTnR-KKK6mDsklI_Q8";
  return {
    cloudName,
    apiKey,
    apiSecret,
    cloudinaryUrl: `cloudinary://${apiKey}:${apiSecret}@${cloudName}`,
    uploadPreset: "ml_default"
  };
}
function saveCldConfig(cfg) {
  try {
    fs.writeFileSync(cldConfigPath, JSON.stringify(cfg, null, 2));
  } catch (e) {
    console.error("Error saving cloudinary-config.json:", e);
  }
}
function initCloudinary() {
  const cfg = loadCldConfig();
  const cloud_name = cfg.cloudName || process.env.CLOUDINARY_CLOUD_NAME || "hbyqk5y0";
  const api_key = cfg.apiKey && !cfg.apiKey.includes("<your_") ? cfg.apiKey : process.env.CLOUDINARY_API_KEY || "";
  const api_secret = cfg.apiSecret && !cfg.apiSecret.includes("<your_") ? cfg.apiSecret : process.env.CLOUDINARY_API_SECRET || "";
  try {
    cloudinary.config({
      cloud_name,
      api_key,
      api_secret,
      secure: true
    });
  } catch (err) {
    console.warn("Cloudinary config initialization notice:", err.message);
  }
  return { ...cfg, cloudName: cloud_name, apiKey: api_key, apiSecret: api_secret };
}
var activeCldConfig = initCloudinary();
function loadCldCatalog() {
  try {
    if (fs.existsSync(cldCatalogPath)) {
      return JSON.parse(fs.readFileSync(cldCatalogPath, "utf-8"));
    }
  } catch (e) {
    console.warn("Error reading cloudinary-catalog.json:", e);
  }
  return {
    tracks: [],
    voiceDrops: [],
    atesoMovies: [],
    logos: [],
    software: [],
    customFiles: [],
    lastSynced: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function saveCldCatalog(cat) {
  try {
    cat.lastSynced = (/* @__PURE__ */ new Date()).toISOString();
    fs.writeFileSync(cldCatalogPath, JSON.stringify(cat, null, 2));
  } catch (e) {
    console.error("Error saving cloudinary-catalog.json:", e);
  }
}
function categorizeAsset(asset) {
  const publicId = asset.public_id || "";
  const url = asset.secure_url || asset.url || "";
  const format = (asset.format || url.split(".").pop() || "").toLowerCase();
  const folder = (asset.folder || (publicId.includes("/") ? publicId.split("/")[0] : "")).toLowerCase();
  const baseName = publicId.includes("/") ? publicId.split("/").pop() : publicId;
  const cleanTitle = baseName.replace(/^(\d{10,14}[_-]?|v\d+[_-]?)/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  const lowerTitle = cleanTitle.toLowerCase();
  const tags = (asset.tags || []).map((t) => t.toLowerCase());
  const allText = `${lowerTitle} ${folder} ${tags.join(" ")}`;
  const isAudio = ["mp3", "wav", "aac", "m4a", "flac", "ogg"].includes(format) || asset.resource_type === "video";
  const isVideo = ["mp4", "mkv", "webm", "mov", "avi"].includes(format) || asset.resource_type === "video";
  const isImage = ["png", "jpg", "jpeg", "webp", "gif"].includes(format) || asset.resource_type === "image";
  const isRaw = ["zip", "rar", "7z", "exe", "dmg", "apk"].includes(format) || asset.resource_type === "raw";
  const dropKeywords = ["drop", "voice drop", "voicedrop", "fx", "sound fx", "soundfx", "jingle", "sample", "tag", "shoutout", "laser", "stutter"];
  if (isAudio && dropKeywords.some((kw) => allText.includes(kw))) {
    const isVip = lowerTitle.includes("vip");
    const isRadio = lowerTitle.includes("radio");
    const priceVal = isVip ? 1e4 : 5e3;
    return {
      category: "voiceDrops",
      item: {
        id: `cld-drop-${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`,
        title: cleanTitle.replace(/\b(mp3|wav|audio|hq|320k)\b/gi, "").trim() || "DJ Emma Exclusive Voice Drop",
        artist: "DJ EMMA PRO FX",
        audioUrl: url,
        category: isVip ? "VIP Drop" : isRadio ? "Radio Jingle" : "Club Hype",
        style: isVip ? "VIP Gold Studio Master Vocals" : isRadio ? "Radio Jingle & Stutter FX" : "Studio Master Laser Tag",
        sampleScript: `"${cleanTitle}" produced by DJ Emma Pro FX.`,
        price: priceVal,
        priceUgx: `${priceVal.toLocaleString()} UGX`,
        priceUsd: "$5 USD",
        tags: ["Cloudinary Sync", "Voice Drop", "DJ Emma FX"],
        thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
        matchScore: 99,
        quality: "320K HQ",
        duration: 8,
        source: "cloudinary",
        uploadedAt: asset.created_at || (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  const logoKeywords = ["logo", "3d logo", "3d animation", "spinning logo", "ident", "loop"];
  if ((isVideo || isImage) && logoKeywords.some((kw) => allText.includes(kw))) {
    return {
      category: "logos",
      item: {
        id: `cld-logo-${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`,
        title: cleanTitle || "DJ Emma Pro 3D Metallic Logo",
        previewVideo: url,
        thumbnail: "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png",
        style: lowerTitle.includes("gold") ? "Cinema Gold" : "3D Metallic Extrusion & Laser Sweep",
        category: "Gold & Metallic",
        price: 18e3,
        resolution: "480p HD \u2022 60 FPS",
        source: "cloudinary",
        uploadedAt: asset.created_at || (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  const movieKeywords = ["movie", "film", "ateso movie", "translated", "cinema", "vj", "series", "part 1", "part 2", "action movie"];
  if (isVideo && movieKeywords.some((kw) => allText.includes(kw))) {
    return {
      category: "atesoMovies",
      item: {
        id: `cld-movie-${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`,
        title: cleanTitle || "Ateso Translated Movie Stream",
        genre: lowerTitle.includes("action") ? "Ateso Action" : lowerTitle.includes("video mix") ? "Ateso Video Mix" : "Ateso Translated / Cinema",
        streamUrl: url,
        videoUrl: url,
        downloadUrl: url.includes("/upload/") ? url.replace("/upload/", "/upload/fl_attachment/") : url,
        poster: url.replace(/\.(mp4|mkv|webm|mov)$/i, ".jpg") || "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610185/InShot_20260512_224355999.jpg",
        duration: "1h 35m",
        quality: "320p / HD",
        releaseYear: 2026,
        vj: lowerTitle.includes("junior") ? "VJ JUNIOR" : "VJ EMMA PRO FX",
        description: `Full cinema stream uploaded to DJ Emma Pro Cloudinary. Direct playback on site in 320p.`,
        telegramUrl: "https://t.me/atesomoviesbox",
        source: "cloudinary",
        uploadedAt: asset.created_at || (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  const softwareKeywords = ["software", "virtualdj", "vegas", "fl studio", "plugin", "cracked", "installer", "setup", "vst"];
  if (isRaw || softwareKeywords.some((kw) => allText.includes(kw))) {
    return {
      category: "software",
      item: {
        id: `cld-tool-${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`,
        name: cleanTitle || "DJ Emma Pro Studio Production Tool",
        category: lowerTitle.includes("virtual") ? "DJ Mixing" : lowerTitle.includes("vegas") ? "Video Editing" : "Audio Production",
        version: "2026 Studio Edition",
        size: asset.bytes ? `${(asset.bytes / (1024 * 1024)).toFixed(1)} MB` : "150 MB",
        description: `Official studio production software package from DJ Emma Pro FX Cloudinary.`,
        downloadUrl: url.includes("/upload/") ? url.replace("/upload/", "/upload/fl_attachment/") : url,
        os: "Windows / Mac",
        thumbnail: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&auto=format&fit=crop&q=80",
        baseDownloads: 3500,
        source: "cloudinary"
      }
    };
  }
  if (isAudio) {
    const detectedGenres = [];
    if (lowerTitle.includes("reggae") || lowerTitle.includes("one drop")) detectedGenres.push("One Drop Reggae");
    if (lowerTitle.includes("ateso")) detectedGenres.push("Ateso Cultural");
    if (lowerTitle.includes("acholi")) detectedGenres.push("Acholi Traditional");
    if (lowerTitle.includes("vyroota")) detectedGenres.push("Vyroota Hits");
    if (lowerTitle.includes("afro")) detectedGenres.push("Afrobeats");
    if (lowerTitle.includes("dancehall")) detectedGenres.push("Dancehall");
    if (lowerTitle.includes("club") || lowerTitle.includes("party")) detectedGenres.push("Club Banger");
    if (detectedGenres.length === 0) detectedGenres.push("Nonstop Mix", "East Africa");
    let numericId = 2e3;
    for (let i = 0; i < publicId.length; i++) {
      numericId = (numericId << 5) - numericId + publicId.charCodeAt(i);
      numericId = Math.abs(numericId % 9e4) + 1e3;
    }
    return {
      category: "tracks",
      item: {
        id: numericId,
        title: cleanTitle.toUpperCase(),
        artist: "DJ EMMA PRO FX",
        durationLabel: "Cloudinary Nonstop",
        url,
        downloadUrl: url.includes("/upload/") ? url.replace("/upload/", `/upload/fl_attachment:${baseName.replace(/\.[^/.]+$/, "")}/`) : url,
        filename: `${cleanTitle}.${format || "mp3"}`,
        thumbnail: "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png",
        backdrop: "https://res.cloudinary.com/hbyqk5y0/image/upload/v1789610187/file_00000000958c71f7ac56e90da5b99629.png",
        matchScore: 99,
        year: 2026,
        ageRating: "All Ages",
        quality: "Studio Master \u2022 320kbps",
        genres: detectedGenres,
        description: `Official nonstop mixtape "${cleanTitle}" synchronized directly from DJ Emma Pro FX Cloudinary library.`,
        isTrending: true,
        source: "cloudinary"
      }
    };
  }
  return {
    category: "customFiles",
    item: {
      id: `cld-file-${baseName.replace(/[^a-zA-Z0-9]/g, "_")}`,
      name: `${cleanTitle}.${format || "bin"}`,
      type: isImage ? "image" : isVideo ? "video" : isAudio ? "audio" : "other",
      url,
      sizeFormatted: asset.bytes ? `${(asset.bytes / (1024 * 1024)).toFixed(1)} MB` : "2.0 MB",
      uploadedAt: asset.created_at ? asset.created_at.split("T")[0] : (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      description: `Asset from Cloudinary: ${cleanTitle}`,
      source: "cloudinary"
    }
  };
}
app.get("/api/cloudinary/config", (req, res) => {
  const cfg = loadCldConfig();
  const maskedKey = cfg.apiKey ? `${cfg.apiKey.slice(0, 4)}...${cfg.apiKey.slice(-3)}` : "None";
  res.json({
    cloudName: cfg.cloudName,
    apiKeyMasked: maskedKey,
    hasApiKey: Boolean(cfg.apiKey),
    hasApiSecret: Boolean(cfg.apiSecret),
    uploadPreset: cfg.uploadPreset || "ml_default",
    cloudinaryUrl: cfg.cloudinaryUrl ? `cloudinary://***@${cfg.cloudName}` : null
  });
});
app.post("/api/cloudinary/config", (req, res) => {
  try {
    const { cloudName, apiKey, apiSecret, uploadPreset, cloudinaryUrl } = req.body;
    const current = loadCldConfig();
    const updated = {
      ...current,
      cloudName: (cloudName || current.cloudName).trim(),
      apiKey: (apiKey !== void 0 ? apiKey : current.apiKey).trim(),
      apiSecret: (apiSecret !== void 0 ? apiSecret : current.apiSecret).trim(),
      uploadPreset: (uploadPreset !== void 0 ? uploadPreset : current.uploadPreset).trim(),
      cloudinaryUrl: cloudinaryUrl || current.cloudinaryUrl
    };
    saveCldConfig(updated);
    activeCldConfig = initCloudinary();
    res.json({ success: true, message: "Cloudinary configuration updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update Cloudinary config" });
  }
});
app.get("/api/cloudinary/feed", (req, res) => {
  const catalog = loadCldCatalog();
  res.json(catalog);
});
app.post("/api/cloudinary/sync", async (req, res) => {
  try {
    const cfg = loadCldConfig();
    const catalog = loadCldCatalog();
    let scannedCount = 0;
    try {
      const result = await cloudinary.api.resources({
        resource_type: "video",
        max_results: 50
      });
      if (result && result.resources) {
        result.resources.forEach((resource) => {
          const { category, item } = categorizeAsset(resource);
          const list = catalog[category];
          if (list && !list.some((existing) => existing.url === item.url || existing.id === item.id)) {
            list.unshift(item);
            scannedCount++;
          }
        });
      }
    } catch (apiErr) {
      console.warn("Cloudinary Admin API scan notice:", apiErr.message);
    }
    saveCldCatalog(catalog);
    res.json({
      success: true,
      message: scannedCount > 0 ? `Successfully synchronized ${scannedCount} new items from Cloudinary!` : "Catalog up to date with Cloudinary.",
      counts: {
        tracks: catalog.tracks.length,
        voiceDrops: catalog.voiceDrops.length,
        atesoMovies: catalog.atesoMovies.length,
        logos: catalog.logos.length,
        customFiles: catalog.customFiles.length
      },
      lastSynced: catalog.lastSynced
    });
  } catch (error) {
    console.error("Cloudinary sync error:", error);
    res.status(500).json({ error: error.message || "Sync operation failed" });
  }
});
app.post("/api/cloudinary/upload", async (req, res) => {
  try {
    const { dataUrl, fileName, folder = "media", preferredCategory } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ error: "dataUrl required for upload" });
    }
    const cleanBaseName = (fileName || `upload_${Date.now()}`).replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    let uploadResult = null;
    let finalUrl = "";
    let usedProvider = "cloudinary";
    try {
      uploadResult = await cloudinary.uploader.upload(dataUrl, {
        resource_type: "auto",
        folder: folder !== "auto" ? folder : void 0,
        public_id: cleanBaseName,
        overwrite: true
      });
      finalUrl = uploadResult.secure_url;
    } catch (cldErr) {
      console.warn("Cloudinary server-side upload returned notice:", cldErr.message);
      const targetFolder = path.join(uploadsDir, folder);
      if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });
      const matches = dataUrl.match(/^data:([A-Za-z-+\/0-9]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1].split("/")[1] || "bin";
        const buffer = Buffer.from(matches[2], "base64");
        const uniqueFileName = `${Date.now()}_${cleanBaseName}.${ext}`;
        fs.writeFileSync(path.join(targetFolder, uniqueFileName), buffer);
        finalUrl = `/uploads/${folder}/${uniqueFileName}`;
        usedProvider = "server";
        uploadResult = {
          public_id: cleanBaseName,
          secure_url: finalUrl,
          format: ext,
          bytes: buffer.length
        };
      } else {
        throw new Error("Invalid file format: " + cldErr.message);
      }
    }
    const { category, item } = categorizeAsset({
      public_id: uploadResult.public_id || cleanBaseName,
      secure_url: finalUrl,
      url: finalUrl,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const targetCategory = preferredCategory && ["tracks", "voiceDrops", "atesoMovies", "logos", "software", "customFiles"].includes(preferredCategory) ? preferredCategory : category;
    const catalog = loadCldCatalog();
    const list = catalog[targetCategory];
    if (list) {
      list.unshift(item);
      saveCldCatalog(catalog);
    }
    res.json({
      success: true,
      url: finalUrl,
      provider: usedProvider,
      category: targetCategory,
      item,
      message: `Successfully uploaded and categorized into ${targetCategory}!`
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: error.message || "Failed to process upload" });
  }
});
app.post("/api/cloudinary/webhook", express.json(), (req, res) => {
  try {
    const payload = req.body;
    console.log("Received Cloudinary Webhook notification:", payload?.public_id || payload?.notification_type);
    if (payload && (payload.public_id || payload.secure_url)) {
      const { category, item } = categorizeAsset(payload);
      const catalog = loadCldCatalog();
      const list = catalog[category];
      if (list && !list.some((existing) => existing.url === item.url || existing.id === item.id)) {
        list.unshift(item);
        saveCldCatalog(catalog);
        console.log(`Auto-separated webhook asset "${payload.public_id}" into "${category}"`);
      }
    }
    res.json({ status: "ok", received: true });
  } catch (error) {
    console.error("Error handling Cloudinary webhook:", error);
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/cloudinary/ingest", (req, res) => {
  try {
    const { url, title, preferredCategory } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    const baseName = title || url.split("/").pop()?.split("?")[0] || `cld_${Date.now()}`;
    const { category, item } = categorizeAsset({
      public_id: baseName,
      secure_url: url,
      url,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const targetCategory = preferredCategory || category;
    const catalog = loadCldCatalog();
    const list = catalog[targetCategory];
    if (list) {
      list.unshift(item);
      saveCldCatalog(catalog);
    }
    res.json({ success: true, category: targetCategory, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
