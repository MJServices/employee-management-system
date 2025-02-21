import React, { useEffect, useState } from "react";


interface Task {
  _id: string;
  title: string;
  description: string;
  selectedUsers: string[]; 
}

interface TaskCardProps {
  task: {
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
  };
  users: { _id: string; username: string }[]; 
}

const TaskCard: React.FC<TaskCardProps> = ({ task, users}) => {
  const [assignedUsernames, setAssignedUsernames] = useState<string[]>([]);

  useEffect(() => {
    const usernames = task.selectedUsers.map(
      (userID) => users.find((user) => user._id === userID)?.username || "Unknown User"
    );
    setAssignedUsernames(usernames);
  }, [task.selectedUsers, users]);

  const priorityColors: { [key: string]: string } = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
  };

  return (
    <section className="flex flex-wrap gap-8">
      <span className="bg-zinc-800 rounded-lg shadow-lg p-6 border-2 border-zinc-100  w-full md:w-[28vw] mx-5 md:mx-0">
        <h4 className="text-2xl font-bold text-white mb-2">{task.title}</h4>
        <p className="text-gray-300 mb-4">{task.description}</p>
        <div className="flex justify-between mb-4">
          <span
            className={`text-xs font-semibold text-white px-2 py-1 rounded ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
          <span
            className={`text-xs font-semibold text-white px-2 py-1 rounded ${
              task.status === "COMPLETED" ? "bg-green-600" : "bg-yellow-600"
            }`}
          >
            {task.status}
          </span>
        </div>

        <div className="text-gray-400 mb-2">
          Assigned to:
          <ul className="list-disc pl-5">
            {assignedUsernames.map((username, index) => (
              <li key={index} className="text-gray-300">
                {username}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-500 text-sm">
          Last Updated: {new Date(task.updatedAt).toLocaleString()}
        </p>
      </span>
    </section>
  );
};

interface TaskListProps {
  tasks: Task[]; 
  users: { _id: string; username: string }[]; 
}

interface TaskListProps {
  tasks: Task[]; 
  users: { _id: string; username: string }[]; 
}

const TaskList: React.FC<TaskListProps> = ({ tasks, users }) => {
  return (
    <div className="flex flex-wrap gap-12 mt-10">
      {tasks
        .slice() 
        .reverse() 
        .map((task: Task, index: number) => (
          <TaskCard
            key={index}
            task={task as any}
            users={users}
          />
        ))}
    </div>
  );
};

export default TaskList;

