import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedTo: string[];
}
interface User {
  _id: string;
  username: string;
}
const Home = () => {
 const [task, setTask] = useState([])
 const [user, setUser] = useState()
  useEffect(() => {
    const fetchTasksAndUsers = async () => {
      try {
       const res = await fetch("/api/v1/user/getcookie");
       const data = await res.json();
       console.log(data.data)
       setUser(data.data);
      } catch (error) {
        console.error("Error fetching tasks or users:", error);
      }
    };

    fetchTasksAndUsers();
  }, []);
  return <div>Home</div>;
};
export default Home;
