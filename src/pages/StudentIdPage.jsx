import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const StudentIdPage = () => {
  const { id } = useParams(); // destructure directly
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student");
        }
        const data = await response.json();
        setStudent(data.data); // assuming your API returns { data: student }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <p className="p-6">Loading student details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!student) return <p className="p-6">No student found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{student.name}</h1>
      <p>
        <span className="font-semibold">Email:</span> {student.email}
      </p>
      <p>
        <span className="font-semibold">Role:</span> {student.role}
      </p>
      <p>
        <span className="font-semibold">GitHub:</span>{' '}
        <a
          href={student.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {student.github}
        </a>
      </p>
    </div>
  );
};

export default StudentIdPage;