import React from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear user session or token here
    localStorage.removeItem('userToken');
    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <div className="logout-page">
      <h1>Logout</h1>
      <p>Are you sure you want to logout?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;