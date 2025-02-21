import React, { useEffect, useState } from "react";
import AssignTaskForm from "./AssignTaskForm";
import TaskList from "./TaskList";

// Define Task and User interfaces with all required properties
interface Task {
  _id: string;
  title: string;
  description: string;
  assignedBy: string;
  selectedUsers: string[];
  comments: string[];
  createdAt: string;
  dueDate: string;
  isCompleted: boolean;
  priority: string;
  status: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch tasks from the API
  const fetchTasksAndUsers = async () => {
    try {
      const taskResponse = await fetch("/api/v1/tasks/getAll");
      if (!taskResponse.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const taskData = await taskResponse.json();

      // Ensure the response contains the expected structure
      if (!taskData?.data || !Array.isArray(taskData.data)) {
        throw new Error("Invalid task data format");
      }

      setTasks(taskData.data);
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  // Fetch usernames based on selected users in tasks
  const usernameFinder = async () => {
    const userIDs = tasks.flatMap((task) => task.selectedUsers);

    if (userIDs.length === 0) {
      console.log("No users found");
      return;
    }

    try {
      const userResponse = await fetch("/api/v1/user/getuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userIDs }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await userResponse.json();

      // Ensure the response contains the expected structure
      if (!userData?.data?.user || !Array.isArray(userData.data.user)) {
        throw new Error("Invalid user data format");
      }

      setUsers(userData.data.user);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  // Fetch usernames whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      usernameFinder();
    }
  }, [tasks]);

  // Handle new task assignment
  const handleAssignTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-xl">
      <div className="container p-4 mx-auto">
        <AssignTaskForm onSubmit={handleAssignTask as any} />
        <TaskList tasks={tasks} users={users} />
      </div>
    </div>
  );
};

export default AdminDashboard;