import { Player } from "./supabase";

const SESSION_KEY = "wc2026_player";
const ADMIN_KEY = "wc2026_admin";
const ADMIN_PIN_KEY = "wc2026_admin_pin";

export function getSessionPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(SESSION_KEY);
  return value === "danya" || value === "dima" ? value : null;
}

export function setSessionPlayer(player: Player): void {
  sessionStorage.setItem(SESSION_KEY, player);
}

export function clearSessionPlayer(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function verifyPin(player: Player, pin: string): boolean {
  const expected =
    player === "danya"
      ? process.env.NEXT_PUBLIC_DANYA_PIN
      : process.env.NEXT_PUBLIC_DIMA_PIN;
  return pin === expected;
}

export function getIsAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function setIsAdmin(pin: string): void {
  sessionStorage.setItem(ADMIN_KEY, "true");
  sessionStorage.setItem(ADMIN_PIN_KEY, pin);
}

export function clearIsAdmin(): void {
  sessionStorage.removeItem(ADMIN_KEY);
  sessionStorage.removeItem(ADMIN_PIN_KEY);
}

export function verifyAdminPin(pin: string): boolean {
  return pin === process.env.NEXT_PUBLIC_ADMIN_PIN;
}
