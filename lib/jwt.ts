// lib/jwt.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "change_this_secret";

export function signJwt(payload: object, expiresIn: string | number = "7d") {
  const options: SignOptions = {
    expiresIn: expiresIn as any   // FINAL FIX 🔥
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET as Secret) as T;
}
