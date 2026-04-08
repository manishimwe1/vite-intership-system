import React from "react";
import { useState } from "react";
// import { useRoutes } from "react-router-dom";

const AddNewStudentPage = () => {
    // const router =  useRoutes();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [github, setGithub] = useState('');
    const [project, setProject] = useState('');


  const handleSubmitStudents = async(e) => {
    e.preventDefault();
    const newStudent = {
      name,
      email,
      role,
      github,
      project
    };

    try {
      const response = await fetch('http://127.0.0.1:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent)
      });
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      
      // router.navigation('/student');

    } catch (error) {
        console.log(error);
        
    }

    // console.log(newStudent);
  };
  return (
    <div className="flex items-center justify-center overflow-y-scroll py-10">
      <form
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        onSubmit={handleSubmitStudents}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Role</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Git hub</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">project Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
        </div>
        {/* <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>Role</label>
            <input type='text' className='w-full px-3 py-2 border rounded-lg' />
        </div> */}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddNewStudentPage;
