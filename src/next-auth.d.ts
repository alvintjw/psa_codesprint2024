import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      teamNumber?: number | null;
      role?: string | null;
    }& DefaultUser;
  }

  interface User {
    id: string;
    role: string; // Add role here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;  // Add role here
  }
}