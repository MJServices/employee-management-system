import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  timeRemaining: string;
  progress: string;
}

const ProgressPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const resetProgress = async () => {
    try {
      const response = await fetch('/api/v1/timer/reset', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/v1/timer/getAll');
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateRemainingProgress = (progress: string) => {
    const maxTime = 28800;
    const progressInSeconds = parseInt(progress, 10);
    if (isNaN(progressInSeconds)) {
      console.warn('Invalid progress value:', progress);
      return 0;
    }
    const remainingProgress = 100 - ((progressInSeconds / maxTime) * 100);
    return Math.min(Math.max(remainingProgress, 0), 100);
  };

  const getProgressColor = () => {
    return 'bg-blue-500';
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-zinc-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">User Progress</h1>
          <div className="relative">
           <button onClick={()=>resetProgress()} className="text-zinc-300 hover:text-white hover:border-none overflow-hidden text-xl border relative border-zinc-200 bg py-2 px-8 rounded-lg before:content-[''] before:h-full before:w-full before:absolute before:bg-blue-500 before:left-0 before:top-[110%] before:rounded-3xl before:transition-all before:duration-300 hover:before:top-0 hover:before:rounded-[0] ml-16">
              <div className="flex justify-center items-center relative z-[20]">
                Reset
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const remainingProgress = calculateRemainingProgress(user.progress);
            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800 p-6 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-zinc-200">{user.username}</h3>
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {Math.round(remainingProgress)}%
                  </motion.div>
                </div>

                <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute left-0 top-0 h-full ${getProgressColor()}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${remainingProgress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="mt-4 text-sm text-zinc-400">
                  Time Remaining: {Math.floor(Number(user.progress) / 3600)}h {Math.floor((Number(user.progress) % 3600) / 60)}m
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
