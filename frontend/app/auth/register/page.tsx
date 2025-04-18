"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChalkboardTeacher, FaUserGraduate, FaArrowLeft, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Submitting registration with data:', { ...form, role });
      
      const response = await fetch("http://localhost:1337/api/auth/local/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        alert("Registration successful!");
        router.push("/auth/login");
      } else {
        console.error('Registration failed:', data);
        alert(data.error?.message || data.message || "Registration failed!");
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">EduHub</h1>
          <p className="text-gray-600">Join our learning community</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {!role ? (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join as</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelection("Instructor")}
                  className="w-full flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 group-hover:bg-indigo-200 transition-all duration-300">
                      <FaChalkboardTeacher size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Instructor</h3>
                      <p className="text-sm text-gray-500">Teach and share your knowledge</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleRoleSelection("Student")}
                  className="w-full flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 group-hover:bg-green-200 transition-all duration-300">
                      <FaUserGraduate size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">Student</h3>
                      <p className="text-sm text-gray-500">Learn and grow your skills</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => setRole(null)} 
                  className="p-2 rounded-full hover:bg-gray-100 mr-2 transition-colors duration-200"
                >
                  <FaArrowLeft className="text-gray-500" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  Register as {role === 'Student' ? 'Student' : 'Instructor'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
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
                      Processing...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a 
                    href="/auth/login" 
                    className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors duration-200"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Register;