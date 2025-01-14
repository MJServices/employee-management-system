import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  password: string;
  role: string;
  username: string
}

const Logincomponent: React.FC = () => {
  const [user, setUser] = useState<User>({ email: "", password: "", role: "", username: ""});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    gsap.to("form", {
      duration: 1,
      opacity: 1,
      delay: 0.5,
      y: -20,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    setButtonDisabled(!user.email || !user.password);
  }, [user]);

  const onLogin = async () => {
    setLoading(true);
    setErrorMsg(""); 
    try {
      const response = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data.data);
        if(data.data.user.role === "admin") {
          navigate("/dashboard");
        }else{
          navigate("/home");
        }
      } else {
        console.error("Login failed", data.message);
        setErrorMsg(data.message || "An error occurred during login.");
      }
    } catch (error: any) {
      console.error("Login error", error.message);
      setErrorMsg("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-screen max-w-screen items-center justify-center bg-zinc-900 overflow-hidden text-zinc-300">
    <form className="h-screen w-screen md:h-[90vh] md:w-[35vw] bg-zinc-800 rounded-lg p-5 flex flex-col justify-center opacity-100" style={{opacity: 1}}>
    <div className="input-container">
        <input
          placeholder="Enter Username"
          className="input-field  opacity-100"
          type="text"
          value={user.username}
          onChange={(e) => setUser({...user, username:e.target.value})}
        />
        <label htmlFor="input-field" className="input-label  opacity-100">
          Enter Username
        </label>
        <span className="input-highlight"></span>
      </div>
      <div className="input-container" style={{ marginTop: "2vw" }}>
        <input
          placeholder="Enter Email"
          className="input-field  opacity-100"
          type="email"
          value={user.email}
          onChange={(e) => setUser({...user, email:e.target.value})}
        />
        <label htmlFor="input-field" className="input-label text-white  opacity-100">
          Enter Email
        </label>
        <span className="input-highlight"></span>
      </div>
      <div className="input-container">
        <input
          placeholder="Enter Password"
          className="input-field  opacity-100"
          type="password"
          value={user.password}
          onChange={(e) => setUser({...user, password:e.target.value})}
        />
        <label htmlFor="input-field" className="input-label  opacity-100">
          Enter Password
        </label>
        <span className="input-highlight"></span>
      </div>
      <div className="input-container">
        <input
          placeholder="Enter Role"
          className="input-field  opacity-100"
          type="text"
          value={user.role}
          onChange={(e) => setUser({...user, role:e.target.value})}
        />
        <label htmlFor="input-field" className="input-label  opacity-100">
          Enter Role
        </label>
        <span className="input-highlight"></span>
      </div>
      <div className="btn-cont mt-16 flex flex-col gap-2 opacity-100">
      <p className="error-msg text-red-500 ml-16">{errorMsg}</p>
      <div>{loading ? "Loading ..." : <button className="button  opacity-100" type="button" onClick={onLogin} disabled={buttonDisabled}>LOGIN</button>}</div>
      
      </div>
    </form>
  </section>
  );
};

export default Logincomponent;

