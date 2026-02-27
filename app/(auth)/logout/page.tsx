"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LogoutPage = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Logout</CardTitle>
          <CardDescription>
            Are you sure you want to logout from your account?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="flex-1">
            {isLoggingOut ? "Logging out..." : "Yes, Logout"}
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutPage;
