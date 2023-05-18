"use client";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Hello() {
  const { data: session, status } = useSession();

  if (!session) return;

  return (
    <h2
      //   drag={"x"}
      //   dragConstraints={{ top: 0, bottom: -100, left: -100, right: 100 }}
      className="underline decoration-sky-900 text-2xl"
    >
      Hello, {session?.user?.name}
    </h2>
  );
}
