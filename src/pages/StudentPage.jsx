import React from "react";
import { Link } from "react-router-dom";

const interns = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Frontend",
    status: "Active",
    github: "https://github.com/johndoe",
    project: "Project Alpha"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Backend",
    status: "Inactive",
    github: "https://github.com/janesmith",
    project: "Project Alpha"

  },
];

const StudentPage = () => {

 

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Intern Management</h1>

        <Link to={'/new'} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Intern
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Git Hub</th>
              <th className="p-4">Project</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {interns.map((intern) => (
              <tr key={intern.id} className=" hover:bg-gray-50">
                <td className="p-4">{intern.name}</td>
                <td className="p-4">{intern.email}</td>
                <td className="p-4">{intern.role}</td>
                <td className="p-4">{intern.github}</td>
                <td className="p-4">{intern.project}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      intern.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {intern.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPage;

