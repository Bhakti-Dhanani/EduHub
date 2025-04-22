"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaChalkboardTeacher, FaBook, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import CourseForm from '@/components/dashboard/instructor/CourseForm';
import CourseCard from '../../../components/dashboard/instructor/CourseCard';

// Define the Course type at the top of the file
interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
}

// Update the API endpoint to use an environment variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

const InstructorDashboard = () => {
  const router = useRouter();
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]); // Define the type for courses

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      router.push('/auth/login');
    } else {
      // Fetch courses for the instructor
      fetch(`${apiUrl}/instructor/courses`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(
                `Error ${response.status}: ${error.message || 'An error occurred while fetching courses'}`
              );
            });
          }
          return response.json();
        })
        .then((data) => setCourses(data.courses || []))
        .catch((error) => {
          console.error('Error fetching courses:', error.message);
          alert(`Failed to fetch courses: ${error.message}`);
        });
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-700">Instructor Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => setIsCourseFormOpen(true)}
          >
            Create Course
          </button>
          <button
            className="text-red-600 hover:text-red-800 font-medium"
            onClick={() => {
              localStorage.removeItem('jwt');
              localStorage.removeItem('user');
              localStorage.removeItem('role');
              router.push('/auth/login');
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow p-8">
        {isCourseFormOpen ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CourseForm onClose={() => setIsCourseFormOpen(false)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;