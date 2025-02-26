"use client";

import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-4">
      <p>Welcome, {session?.user?.name}</p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Sign Out
      </button>
    </div>
  );
}
