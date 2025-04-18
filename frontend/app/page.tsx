"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center space-x-4">
        <FaSpinner className="animate-spin text-indigo-600 text-2xl" />
        <p className="text-lg text-gray-700">Redirecting to Login...</p>
      </div>
      <p className="mt-4 text-sm text-gray-500">
        If redirection doesn't work, <a href="/auth/login" className="text-indigo-600 hover:underline">click here</a>
      </p>
    </div>
  );
}