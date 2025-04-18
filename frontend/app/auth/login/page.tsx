"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaArrowRight, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Attempting to authenticate user...');
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log('Auth response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      localStorage.setItem('jwt', data.jwt);
      console.log('JWT token stored');
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role?.name || '');
        
        if (data.user.role?.name === 'Instructor') {
          router.push('/dashboard/instructor');
        } else if (data.user.role?.name === 'Student') {
          router.push('/dashboard/student');
        } else {
          router.push('/');
        }
        return;
      }
      
      console.log('Fetching user data...');
      const userResponse = await fetch('http://localhost:1337/api/users/me?populate=role', {
        headers: {
          'Authorization': `Bearer ${data.jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!userResponse.ok) {
        console.warn('Could not fetch user data, proceeding with limited information');
        router.push('/');
        return;
      }

      const userData = await userResponse.json();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role?.name || '');
      
      if (userData.role?.name === 'Instructor') {
        router.push('/dashboard/instructor');
      } else if (userData.role?.name === 'Student') {
        router.push('/dashboard/student');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">EduHub</h1>
          <p className="text-gray-600">Welcome back to your learning journey</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaSignInAlt className="mr-2 text-indigo-600" />
              Sign In
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border-l-4 border-red-500 rounded">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Email or Username"
                  value={form.identifier}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <a 
                  href="/auth/forgot-password" 
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <a 
                  href="/auth/register" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors duration-200"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;