// components/Progress/ProgressPage.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  timeRemaining: number;
}

const ProgressPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/v1/user/getAllUsers');
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Set up polling for real-time updates
    const interval = setInterval(fetchUsers, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateProgress = (timeRemaining: number) => {
    const maxTime = 28800; // 8 hours in seconds
    const progress = ((maxTime - timeRemaining) / maxTime) * 100;
    return Math.min(Math.max(progress, 0), 100); // Ensure between 0 and 100
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-emerald-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">User Progress</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 bg-zinc-800 rounded-lg text-zinc-200 outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const progress = calculateProgress(user.timeRemaining);
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
                    className={`text-2xl font-bold ${getProgressColor(progress)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {Math.round(progress)}%
                  </motion.div>
                </div>

                <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute left-0 top-0 h-full ${getProgressColor(progress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <div className="mt-4 text-sm text-zinc-400">
                  Time Remaining: {Math.floor(user.timeRemaining / 3600)}h {Math.floor((user.timeRemaining % 3600) / 60)}m
                </div>
              </motion.div>
            )}
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;