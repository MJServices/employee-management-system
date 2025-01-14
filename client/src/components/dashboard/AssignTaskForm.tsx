import axios from "axios";
import React, { useState } from "react";

interface Task {
  title: string;
  description: string;
  selectedUsers: string[]; 
  category: string;
  dueDate: string;
  priority: string;
}

interface AssignTaskFormProps {
  onSubmit: (task: Task) => void;
}

const AssignTaskForm: React.FC<AssignTaskFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState<string | null>(null); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || selectedUsers.length === 0 || !priority || !date) {
      setError("All fields are required!"); 
      return;
    }

    const task: Task = {
      title,
      description,
      selectedUsers, 
      category,
      dueDate: date,
      priority,
    };

    try {
      setError(null);
      console.log(task);

      const res = await axios.post("/api/v1/tasks/create", task);
      const data = res.data; 
      console.log("Task created successfully:", data);
      
      onSubmit(task);

      setTitle("");
      setDescription("");
      setSelectedUsers([]);  
      setCategory("");
      setDate("");
      setPriority("");
    } catch (error) {
      setError("Error creating task: " + (error instanceof Error ? error.message : "Unknown error"));
      console.error("Error creating task:", error);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const users = e.target.value.split(',').map(user => user.trim()).filter(user => user !== "");
    setSelectedUsers(users);
  };

  return (
    <div className="p-10 bg-zinc-900 mt-5 rounded-lg shadow-md text-zinc-300">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap md:flex-nowrap w-full gap-6"
      >
        <div className="flex flex-col gap-4 lg:w-1/2 w-full">
          <div>
            <label className="block text-lg text-zinc-300 mb-1">Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg py-3 px-4 w-full rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none"
              type="text"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-lg text-gray-300 mb-1">Due Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-lg py-3 px-4 w-full rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none"
              type="date"
            />
          </div>

          <div>
            <label className="block text-lg text-gray-300 mb-1">Assign To (comma separated)</label>
            <input
              value={selectedUsers.join(", ")} 
              onChange={handleUserChange}
              className="text-lg py-3 px-4 w-full rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none"
              type="text"
              placeholder="Employee names or IDs (comma separated)"
            />
          </div>

          <div>
            <label className="block text-lg text-gray-300 mb-1">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-lg py-3 px-4 w-full rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none"
              type="text"
              placeholder="E.g., Design, Development"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:w-1/2 w-full">
          <div>
            <label className="block text-lg text-gray-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-lg py-3 px-4 w-full rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none text-white"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-lg text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 text-lg py-3 px-3 rounded bg-zinc-800 border border-gray-700 focus:border-emerald-500 outline-none"
              placeholder="Provide a detailed description of the task"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div> 
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-green-400 py-5 px-6 rounded-lg text-xl text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-green-500 hover:shadow-xl transition-all duration-300 ease-in-out mt-3"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignTaskForm;
