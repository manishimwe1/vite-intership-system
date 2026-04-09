
import mongoose from "mongoose";

const internSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true },
        role: { type: String, required: true },
        github: { type: String, required: true },
        // project: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model("Intern", internSchema);