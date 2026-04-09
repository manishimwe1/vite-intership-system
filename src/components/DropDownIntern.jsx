import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DropDownIntern = ({ internId }) => {
  const navigate = useNavigate();
  const deleteStudentById = async (id) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE", // DELETE method
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete student");

      const data = await response.json();
      console.log(data.message); // "Intern deleted successfully"
      navigate("/student"); // Redirect to student list after deletion
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // ✅ Important!
            setOpen(!open);
          }}
        >
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Intern Actions</DropdownMenuLabel>
          <DropdownMenuItem className="hover:bg-blue-100 cursor-pointer">
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:bg-red-100 cursor-pointer"
            variant="destructive"
            onClick={() => deleteStudentById(internId)}
          >
            Delete
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
          {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownIntern;
