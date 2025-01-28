import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, List, BarChart2, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <Home size={20} />, title: 'Dashboard' },
    { path: '/tasks', icon: <List size={20} />, title: 'Tasks' },
    { path: '/progress', icon: <BarChart2 size={20} />, title: 'Progress' },
  ];

  return (
    <motion.div 
      initial={{ width: isOpen ? 240 : 70 }}
      animate={{ width: isOpen ? 240 : 70 }}
      className="h-screen fixed left-0 top-0 bg-zinc-900 text-zinc-400 border-r border-zinc-800 z-50 shadow-lg"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-[-12px] top-6 bg-zinc-800 p-2 rounded-full"
      >
        <Menu size={16} />
      </button>

      <div className="p-4">
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold mb-8"
        >
          MINI.solutions
        </motion.div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors ${
                location.pathname === item.path ? 'bg-zinc-800 text-emerald-500' : ''
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
