import { BlacklistedToken } from "../types/vars";

const tokenBlacklist: BlacklistedToken[] = [];

export const addToBlacklist = (token: string, expiresAt: number) => {
  tokenBlacklist.push({ token, expiresAt });
};

export const isBlacklisted = (token: string) => {
  const now = Date.now() / 1000;

  for (let i = tokenBlacklist.length - 1; i >= 0; i--) {
    if (tokenBlacklist[i].expiresAt < now) {
      tokenBlacklist.splice(i, 1);
    }
  }

  return tokenBlacklist.some((t) => t.token === token);
};
