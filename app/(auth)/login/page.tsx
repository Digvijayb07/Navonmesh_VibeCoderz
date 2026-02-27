import React from "react";
import { LoginForm } from "./components/LoginForm";

const loginPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default loginPage;
