import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  role: string;
}

function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("/api/v1/user/getcookie")
      .then((response: { data: any }) => {
        setUser(response.data.data.user); 
      })
      .catch((error: any) => {
        console.error("Error fetching user data:", error);
        setUser(null); 
      });
  }, []);

  const handleLogout = () => {
    axios
      .get("/api/v1/user/logout")
      .then(() => {
        setUser(null); 
      })
      .catch((error: any) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <nav className="navbar w-full h-20 flex justify-between items-center px-8 bg-zinc-900 text-gray-100 shadow-md">
      <section className="logo">
        <h1 className="leading-tight">
          <div className="text-3xl font-bold text-blue-400">MINI</div>
          <div className="text-xl -mt-1 font-light text-gray-300">.solutions</div>
        </h1>
      </section>

      <section className="btn-cont flex items-center space-x-4">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/create">
                <button className="text-zinc-300 hover:text-white hover:border-none overflow-hidden text-xl border relative border-zinc-200 bg py-2 px-8 rounded-3xl before:content-[''] before:h-full before:w-full before:absolute before:bg-blue-500 before:left-0 before:top-[110%] before:rounded-3xl before:transition-all before:duration-300 hover:before:top-0 hover:before:rounded-[0] ml-16">
                  <div className="flex justify-center items-center relative z-[20]">
                    Create
                  </div>
                </button>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-zinc-300 hover:text-white hover:border-none overflow-hidden text-xl border relative border-zinc-200 bg py-2 px-8 rounded-3xl before:content-[''] before:h-full before:w-full before:absolute before:bg-blue-500 before:left-0 before:top-[110%] before:rounded-3xl before:transition-all before:duration-300 hover:before:top-0 hover:before:rounded-[0] ml-16">
              <div className="flex justify-center items-center relative z-[20]">
                    Logout
                  </div>
            </button>
          </>
        ) : (
          <Link to="/">
            <button className="text-zinc-300 hover:text-white hover:border-none overflow-hidden text-xl border relative border-zinc-200 bg py-2 px-8 rounded-3xl before:content-[''] before:h-full before:w-full before:absolute before:bg-blue-500 before:left-0 before:top-[110%] before:rounded-3xl before:transition-all before:duration-300 hover:before:top-0 hover:before:rounded-[0] ml-16">
            <div className="flex justify-center items-center relative z-[20]">
                   Login
                  </div>
            </button>
          </Link>
        )}
      </section>
    </nav>
  );
}

export default Navbar;