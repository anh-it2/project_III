import axios from "axios";

const API = "https://api.giphy.com/v1/gifs";
const KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY ?? "";

export interface GiphyGif {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
  width: number;
  height: number;
}

interface RawGif {
  id: string;
  title: string;
  images: {
    fixed_height: { url: string; width: string; height: string };
    original: { url: string };
  };
}

function mapGif(g: RawGif): GiphyGif {
  return {
    id: g.id,
    title: g.title,
    previewUrl: g.images.fixed_height.url,
    fullUrl: g.images.original.url,
    width: Number(g.images.fixed_height.width),
    height: Number(g.images.fixed_height.height),
  };
}

export async function fetchTrendingGifs(limit = 24): Promise<GiphyGif[]> {
  if (!KEY) return [];
  try {
    const res = await axios.get<{ data: RawGif[] }>(`${API}/trending`, {
      params: { api_key: KEY, limit, rating: "pg-13" },
    });
    return res.data.data.map(mapGif);
  } catch {
    throw new Error("Giphy trending failed");
  }
}

export async function searchGifs(
  query: string,
  limit = 24,
): Promise<GiphyGif[]> {
  if (!KEY || !query.trim()) return [];
  try {
    const res = await axios.get<{ data: RawGif[] }>(`${API}/search`, {
      params: { api_key: KEY, q: query, limit, rating: "pg-13" },
    });
    return res.data.data.map(mapGif);
  } catch {
    throw new Error("Giphy search failed");
  }
}

export const HAS_GIPHY_KEY = Boolean(KEY);
