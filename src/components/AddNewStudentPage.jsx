import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const AddStudentDialog = ({open,setOpen}) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [github, setGithub] = useState("");

  const handleSubmitStudents = async (e) => {
    e.preventDefault();

    const newStudent = {
      name,email,role,github
    }


    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      setName("");
      setEmail("");
      setRole("");
      setGithub("");

      setOpen(false);
      navigate(0); 
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ✅ Trigger Button */}
      <DialogTrigger asChild>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add Student
        </button>
      </DialogTrigger>

      {/* ✅ Modal Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitStudents} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 border rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Role"
            className="w-full px-3 py-2 border rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            type="text"
            placeholder="GitHub"
            className="w-full px-3 py-2 border rounded-lg"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Save Student
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;