import { Outlet } from "react-router-dom";
import Navbar from "./components/Header/Navbar";
import { Footer } from "./components/Footer/Footer";

const App = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Outlet />
      <footer>
        <Footer/>
      </footer>
    </>
  );
};
export default App;
