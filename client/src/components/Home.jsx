import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const teachers = [
    { name: "Jenny Mam — Physics", path: "/alakh" },
    { name: "Rahul Sir — Mathematics", path: "/rahul" },
    { name: "Priya Mam — Chemistry", path: "/priya" },
    { name: "Amit Sir — Biology", path: "/amit" },
    { name: "Sneha Mam — English", path: "/sneha" },
    { name: "Vikram Sir — Computer Science", path: "/vikram" },
    { name: "Anita Mam — History", path: "/anita" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white font-inter flex flex-col items-center justify-center p-8">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-md">
        Choose Your AI Tutor
      </h1>

      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {teachers.map((teacher, idx) => (
          <div
            key={idx}
            onClick={() => navigate(teacher.path)}
            className="group relative bg-gradient-to-br from-[#1b1b2f] to-[#2b2b45] p-8 rounded-3xl shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-indigo-700/40"
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>

            {/* Content */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                {teacher.name.split(" ")[0][0]}
              </div>
              <h2 className="text-xl md:text-2xl font-semibold">
                {teacher.name}
              </h2>
              <p className="text-gray-400 text-sm">
                Click to start learning with {teacher.name.split(" ")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-gray-500 text-sm text-center">
        © 2025 Diviltuttor — Your Smart AI Learning Assistant
      </div>
    </div>
  );
}
