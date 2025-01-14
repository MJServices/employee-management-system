import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar w-full h-20 flex justify-between items-center px-8 bg-zinc-900 text-gray-100 shadow-md">
      {/* Logo Section */}
      <section className="logo">
        <h1 className="leading-tight">
          <div className="text-3xl font-bold text-blue-400">MINI</div>
          <div className="text-xl -mt-1 font-light text-gray-300">.solutions</div>
        </h1>
      </section>

      {/* Button Section */}
      <section className="btn-cont">
      {/* <Link to="/dashboard">  
                <button className="text-zinc-300 hover:text-white hover:border-none overflow-hidden text-xl border relative border-zinc-200 bg py-2 px-8 rounded-3xl before:content-[''] before:h-full before:w-full before:absolute before:bg-blue-500 before:left-0 before:top-[110%] before:rounded-3xl before:transition-all before:duration-300 hover:before:top-0 hover:before:rounded-[0] ml-16">
                  <div className="flex justify-center items-center relative z-[20]">
                    Log In
                  </div>
                </button>
              </Link> */}
      </section>
    </nav>
  );
}

export default Navbar;
