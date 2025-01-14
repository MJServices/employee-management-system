export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-y-4 border-t border-gray-700 bg-gray-900 py-8 text-center md:flex-row md:justify-between md:gap-y-0 md:px-6  z-10">
      <p className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
        &copy; Mini solutions
      </p>
      <ul className="flex flex-wrap items-center gap-y-4 gap-x-6">
        {["About Us", "License", "Contribute", "Contact Us"].map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-sm font-normal text-gray-400 hover:text-blue-400 transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
