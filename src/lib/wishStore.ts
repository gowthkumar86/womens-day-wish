import { supabase } from "./supabase";

export interface WishData {
  id: string;
  name: string;
  nickname: string;
  senderName: string;
  photo: string | null;
  message: string;
  complimentStyle: "warm" | "fun" | "elegant" | "powerful";
  relationship: "Friend" | "Sister" | "Mom" | "Colleague" | "Special Person";
  appreciationImages?: string[];
  createdAt: number;
}

/* ---------------- AUTH (local only) ---------------- */

const AUTH_KEY = "womens_day_auth";
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export function login(password: string): boolean {
  if (password === PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true")
    return true
  }
  return false
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/* ---------------- WISHES (Supabase) ---------------- */

export const getWishes = async (): Promise<WishData[]> => {

  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
};

export const getWishById = async (id: string) => {

  const { data, error } = await supabase
    .from("wishes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    nickname: data.nickname,
    senderName: data.sender_name,
    photo: data.photo,
    message: data.message,
    complimentStyle: data.compliment_style,
    relationship: data.relationship,
    appreciationImages: data.appreciation_images || [],
    createdAt: data.created_at
  }
}

export const saveWish = async (wish: WishData) => {

  const { data, error } = await supabase
    .from("wishes")
    .upsert(
      {
        id: wish.id,
        name: wish.name,
        nickname: wish.nickname,
        sender_name: wish.senderName,
        photo: wish.photo,
        message: wish.message,
        compliment_style: wish.complimentStyle,
        relationship: wish.relationship,
        appreciation_images: wish.appreciationImages || [],
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" } // tells Supabase to update if id exists
    )

  if (error) {
    console.error(error)
    throw error
  }

  return data
}

export const deleteWish = async (id: string) => {

  const { error } = await supabase
    .from("wishes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
};

export const getImageUrl = (path: string) => {
  const { data } = supabase.storage
    .from("wishes")
    .getPublicUrl(path)

  return data.publicUrl
}

/* ---------------- ID GENERATOR ---------------- */

export function generateId(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z]/g, "");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${clean}${random}`;
}