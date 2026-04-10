import AddStudentDialog from "@/components/AddNewStudentPage";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVerticalIcon } from "lucide-react";
// import DropDownIntern from "@/components/DropDownIntern";
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [open, setOpen] = useState(false);
  const [allInterns, setAllInterns] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        setAllInterns(data.data);
      } catch (error) {
        console.error("Error fetching interns:", error);
      }
    };

    fetchInterns();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Intern Management</h1>

        <AddStudentDialog open={open} setOpen={setOpen} />
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <Table>
          <TableCaption>A list of your intern.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">GitHub</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInterns?.map((intern) => (
              <TableRow
                key={intern._id || intern.id}
                className="hover:bg-gray-50"
              >
                <TableCell
                  className="font-medium capitalize"
                  onClick={() =>
                    navigate(`/students/${intern._id || intern.id}`)
                  }
                >
                  {intern.name}
                </TableCell>
                <TableCell>{intern.email}</TableCell>
                <TableCell>{intern.status || "Active"}</TableCell>
                <TableCell>{intern.role}</TableCell>
                <TableCell className="text-right">
                  <a
                    href={intern.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View GitHub
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  {/* <DropDownIntern
                    internId={intern._id || intern.id}
                    onClick={(e) => e.stopPropagation()} // STOP ROW NAVIGATION
                  /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentPage;
