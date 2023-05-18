"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function IsAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <li onClick={() => signIn()}>Login</li>;
  }

  return <li onClick={() => signOut()}>{session?.user?.name}</li>;
}
