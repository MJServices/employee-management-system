import React, { useEffect, useState } from "react";
import AssignTaskForm from "./AssignTaskForm";
import TaskList from "./TaskList";

interface Task {
  _id: string;
  title: string;
  description: string;
  selectedUsers: string[]; 
}

interface User {
  _id: string;
  username: string;
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchTasksAndUsers = async () => {
    try {
      const taskResponse = await fetch("/api/v1/tasks/getAll");
      if (!taskResponse.ok) {
        console.error("Failed to fetch tasks");
        return;
      }
      const taskData = await taskResponse.json();
      setTasks(taskData.data); 
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const usernameFinder = async () => {
    const userIDs = tasks.flatMap((task) => task.selectedUsers); 
    if (userIDs.length > 0) {
      const userResponse = await fetch("/api/v1/user/getuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userIDs }),
      });

      if (!userResponse.ok) {
        console.error("Failed to fetch users");
        return;
      }
      const userData = await userResponse.json();
      if (!userData?.data?.user) {
        console.error("Users not found");
        return;
      }

      setUsers(userData.data.user); 
    } else {
      console.log("No users found");
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      usernameFinder(); 
    }
  }, [tasks]);

  const handleAssignTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]); 
  };

  return (
      <div className="bg-zinc-800">
        <div className="container p-4 mx-auto">
          <AssignTaskForm onSubmit={handleAssignTask} />
          <TaskList tasks={tasks} users={users} />
        </div>
      </div>
  );
};

export default AdminDashboard;
