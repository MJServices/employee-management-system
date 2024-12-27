function Navbar() {
  return (
    <nav className="navbar w-full h-20 flex justify-between px-6 items-center ">
      <section className="logo">
        <h1 className="leading-3">
          <div className="text-3xl">MINI</div>
          <div className="text-xl -mt-2">.solutions</div>
        </h1>
      </section>
      <section className="btn-cont">
        <button>Login</button>
      </section>
    </nav>
  );
}
export default Navbar;
