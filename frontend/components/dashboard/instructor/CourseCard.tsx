import React, { useState, useRef, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasErrored, setHasErrored] = useState(false); // Track if image failed
  const menuRef = useRef<HTMLDivElement>(null);

  // Debug thumbnailUrl
  console.log(`CourseCard ${course.id} thumbnailUrl:`, course.thumbnailUrl);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Placeholder functions for edit and delete actions
  const handleEdit = () => {
    console.log(`Editing course: ${course.id}`);
    setIsMenuOpen(false);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log(`Deleting course: ${course.id}`);
    setIsMenuOpen(false);
    // Add your delete logic here
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105">
      {/* Three-dot menu */}
      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          aria-label="Course options"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6h.01M12 12h.01M12 18h.01"
            />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={handleEdit}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Course
            </button>
            <button
              onClick={handleDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete Course
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail image */}
      {course.thumbnailUrl && !hasErrored ? (
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg mb-4"
          onError={(e) => {
            console.error(`Failed to load image for course ${course.id}: ${course.thumbnailUrl}`);
            setHasErrored(true); // Prevent infinite loop
          }}
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded-t-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500">No Thumbnail Available</span>
        </div>
      )}

      {/* Course details */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
        View Details
      </button>
    </div>
  );
};

export default CourseCard;