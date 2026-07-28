"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import { ReactNode } from "react";

/**
 * Providers: Client Component wrapper yang membungkus seluruh aplikasi
 * dengan GoogleOAuthProvider dan AuthProvider.
 *
 * Dipisah dari layout.tsx (Server Component) agar layout tetap bisa
 * menggunakan metadata dan optimisasi Next.js lainnya.
 */
export function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
