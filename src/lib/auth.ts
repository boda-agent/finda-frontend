import { api } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "CLIENT" | "MASTER" | "ADMIN";
  isGoogleLinked: boolean;
  createdAt: string;
}

let currentUser: User | null = null;

export async function login(email: string, password: string): Promise<User> {
  const result = await api.login(email, password);
  currentUser = result.user;
  if (typeof window !== "undefined") {
    localStorage.setItem("finda_user", JSON.stringify(result.user));
  }
  return result.user;
}

export async function register(
  email: string,
  name: string,
  password: string
): Promise<User> {
  const result = await api.register(email, name, password);
  currentUser = result.user;
  if (typeof window !== "undefined") {
    localStorage.setItem("finda_user", JSON.stringify(result.user));
  }
  return result.user;
}

export async function getMe(): Promise<User | null> {
  try {
    const user = await api.getMe();
    currentUser = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("finda_user", JSON.stringify(user));
    }
    return user;
  } catch {
    return null;
  }
}

export function logout() {
  api.logout();
  currentUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("finda_user");
  }
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("finda_user");
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!api.getToken();
}
