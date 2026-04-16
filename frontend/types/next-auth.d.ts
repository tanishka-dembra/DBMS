import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      designation?: string;
      companyName?: string;
      role?: "admin" | "company";
      apiToken?: string;
    };
  }

  interface User {
    designation?: string;
    companyName?: string;
    role?: "admin" | "company";
    apiToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    designation?: string;
    companyName?: string;
    role?: "admin" | "company";
    apiToken?: string;
  }
}
