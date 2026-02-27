import React from "react";
import { SignUpForm } from "./components/SignUpForm";

const page = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg mx-auto">
        <SignUpForm />
      </div>
    </div>
  );
};

export default page;
