// server-init.ts - Sanitize environment variables before third-party SDKs load

export function sanitizeEnvironment(): void {
  // Fix CLOUDINARY_URL if it has prefix 'CLOUDINARY_URL=' or is invalid placeholder
  if (process.env.CLOUDINARY_URL) {
    let url = process.env.CLOUDINARY_URL.trim();
    if (url.startsWith('CLOUDINARY_URL=')) {
      url = url.slice('CLOUDINARY_URL='.length).trim();
    }
    if (
      !url.toLowerCase().startsWith('cloudinary://') ||
      url.includes('<your_api_key>') ||
      url.includes('<your_api_secret>')
    ) {
      if (
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME
      ) {
        process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`;
      } else {
        delete process.env.CLOUDINARY_URL;
      }
    } else {
      process.env.CLOUDINARY_URL = url;
    }
  } else if (
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME
  ) {
    process.env.CLOUDINARY_URL = `cloudinary://${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}@${process.env.CLOUDINARY_CLOUD_NAME}`;
  }
}

sanitizeEnvironment();
