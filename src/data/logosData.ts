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

export const LOGO_ITEMS_DATA: LogoItem[] = [];
