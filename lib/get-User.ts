// lib/getUser.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUser(): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}
