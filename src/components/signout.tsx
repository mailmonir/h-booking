"use client";

import { logoutAction } from "@/lib/server/auth";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const Signout = () => {
  const router = useRouter();
  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = await logoutAction();
    console.log(msg);
    if (msg.message === "success") {
      router.push("/signin");
    }
  };
  return (
    <form onSubmit={handleLogout}>
      <button>Sign out</button>
    </form>
  );
};

export default Signout;
