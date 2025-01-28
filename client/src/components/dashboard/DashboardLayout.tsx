// components/Layout/DashboardLayout.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart2, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  let count = 0
    const onclick = () => {
    if(count == 0){
      setIsOpen(true)
      count = 1
    }
    else{
      setIsOpen(false)
      count = 0
    }
  }
  const menuItems = [
    { path: '/dashboard', icon: <Home size={20} />, title: 'Dashboard' },
    { path: '/progress', icon: <BarChart2 size={20} />, title: 'Progress' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-900">
      {/* Sidebar */}
      <button
          onClick={() => onclick()}
          className="fixed left-[24px] bottom-2 bg-zinc-950 p-2 rounded-full hover:bg-zinc-700 transition-colors z-30 flex justify-center items-center text-zinc-400 h-12 w-12"
        >
          <Menu size={25} />
        </button>
      <motion.aside
        initial={{ width: isOpen ? 240 : 70 }}
        animate={{ width: isOpen ? 240 : 70 }}
        className={`${isOpen ? "block" : "hidden"} fixed left-0 top-0 h-full bg-zinc-900 text-zinc-400 border-r border-zinc-800 z-20 `}
      >
       

        <div className="p-4">
          <motion.div
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="text-xl font-bold mb-8 pl-2"
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
                <span className="min-w-[20px]">{item.icon}</span>
                {isOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out `}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;