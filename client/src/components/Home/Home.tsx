import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  selectedUsers: User[];
  assignedBy: User;
  status: string;
}

interface User {
  _id: string;
  username: string;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const submitTask =  async (id: string) => {
    if (!id) {
      console.log("User not available yet");
      return;
    }
    const res = await fetch(`/api/v1/tasks/submitTask?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log("Task submitted:", data.data);
  }
  const findTasks = async () => {
    if (!user?._id) {
      console.log("User not available yet");
      return;
    }

    try {
      const res = await fetch(`/api/v1/tasks/g?id=${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched Tasks:", data.data);
      if (Array.isArray(data.data)) {
        // Filter out null or invalid tasks before setting state
        const validTasks = data.data.filter(
          (task: Task | null) => task !== null
        );
        setTasks(validTasks);
      } else {
        console.error("Tasks data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTasksAndUsers = async () => {
    try {
      const res = await fetch("/api/v1/user/getcookie", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Fetched User:", data.data?.user);
      setUser(data.data?.user || null);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("User is set, fetching tasks...");
      findTasks();
    }
  }, [user]);

  const getPriorityBadgeColor = (priority: string): string => {
    switch (priority) {
      case "HIGH":
        return "bg-red-600 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-black";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <section className="min-h-screen bg-zinc-900 p-10">
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-4xl md:text-5xl text-zinc-400 font-semibold text-center mb-10 md:mb-16">Task List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks
            .slice() 
            .reverse() 
            .map((task) => (
              <div
                key={task._id}
                className="bg-zinc-800 rounded-lg shadow-xl p-6 hover:scale-105 transition-transform transform duration-200 ease-in-out"
              >
                <h2 className="text-2xl font-semibold text-white mb-3">
                  {task.title}
                </h2>
                <p className="text-gray-400 mb-4 max-w-full h-auto">
                  {task.description}
                </p>
                <p className="text-[royalblue] my-2">Task Status: {task.status}</p>
                <p>
                  {task.selectedUsers.map((user) => (
                    <div className="inline-block mb-2 text-zinc-300">
                      Assigned to: {user.username}
                    </div>
                  ))}
                </p>

                <p className="block mb-2 text-zinc-300">
                  Assigned By: {task.assignedBy.username}
                </p>

                <div className="cont flex justify-between mt-4 relative">
                  <div
                    className={`font-medium py-1 rounded-full flex justify-center items-center px-5 text-sm ${getPriorityBadgeColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </div>
                  <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out" onClick={() => submitTask(task._id)}>
                    Submit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-3">
              No tasks available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
