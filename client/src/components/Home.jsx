// src/components/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const teachers = [
    { name: "Alakh Sir", path: "/alakh" },
    // Add more teachers here
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Choose a Teacher</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teachers.map((teacher, idx) => (
          <div
            key={idx}
            onClick={() => navigate(teacher.path)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold">{teacher.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
