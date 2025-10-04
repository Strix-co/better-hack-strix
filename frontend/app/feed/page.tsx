"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const router = useRouter()
  const handleLogout = async () => {
    console.log("logging out");
    try {
      await authClient.signOut();
      console.log("logged out");
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Button onClick={handleLogout}>Bye Bye</Button>
      <h1>hello</h1>
    </div>
  );
}