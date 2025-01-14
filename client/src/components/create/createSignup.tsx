import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  password: string;
  role: string;
  username: string;
  avatar: string | null; // URL for profile image
  coverImage: string | null; // URL for cover image
}

const SignUpComponent: React.FC = () => {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    role: "",
    username: "",
    avatar: null,
    coverImage: null,
  });
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

  const onCreation = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Using FormData to send both the form data and files
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("role", user.role);

      // Append images if they exist
      if (user.avatar) formData.append("avatar", user.avatar);
      if (user.coverImage) formData.append("coverImage", user.coverImage);

      const response = await fetch("/api/v1/user/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Creation successful", data.data.role);
          navigate("/dashboard");
      } else {
        console.error("Creation failed", data.message);
        setErrorMsg(data.message || "An error occurred during Creation.");
      }
    } catch (error: any) {
      console.error("Creation error", error.message);
      setErrorMsg("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile image change
  const handleavatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUser((prevUser: any) => ({ 
        ...prevUser,
        avatar: file,
      }));
    }
  };

  // Handle cover image change
  const handlecoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUser((prevUser: any) => ({
        ...prevUser,
        coverImage: file,
      }));
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-300">
      <form
        className="w-full sm:w-4/5 md:w-[35vw] lg:w-[35vw] my-20 bg-zinc-800 rounded-lg p-5 flex flex-col gap-6 opacity-100"
        style={{ opacity: 1 }}
      >
         <div
          className="cover-image-container w-full h-48 sm:h-56 md:h-64 bg-gray-300 rounded-lg relative cursor-pointer"
          onClick={() => document.getElementById("coverImageInput")?.click()}
        >
          {user.coverImage ? (
            <img
              src={URL.createObjectURL(user.coverImage)}
              alt="Cover"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <span className="text-xl text-gray-500 flex items-center justify-center w-full h-full">+</span>
          )}
        </div>
        {/* Profile Image Section */}
        <div className="profile-section -mt-36 flex flex-col items-center gap-4">
          <div
            className="profile-image-container relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 bg-gray-300 overflow-hidden cursor-pointer"
            onClick={() => document.getElementById("avatarInput")?.click()}
          >
            {user.avatar ? (
              <img
                src={URL.createObjectURL(user.avatar)}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xl text-gray-500 flex items-center justify-center w-full h-full">+</span>
            )}
          </div>
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleavatarChange}
          />
        </div>

        {/* Cover Image Section */}
       
        <input
          type="file"
          id="coverImageInput"
          accept="image/*"
          className="hidden"
          onChange={handlecoverImageChange}
        />

        {/* Username Input */}
        <div className="input-container">
          <input
            placeholder="Enter Username"
            className="input-field opacity-100"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <label htmlFor="input-field" className="input-label opacity-100">
            Enter Username
          </label>
          <span className="input-highlight"></span>
        </div>

        <div className="input-container">
          <input
            placeholder="Enter Email"
            className="input-field opacity-100"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <label htmlFor="input-field" className="input-label opacity-100">
            Enter Email
          </label>
          <span className="input-highlight"></span>
        </div>
        {/* Password Input */}
        <div className="input-container">
          <input
            placeholder="Enter Password"
            className="input-field opacity-100"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <label htmlFor="input-field" className="input-label opacity-100">
            Enter Password
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Role Input */}
        <div className="input-container">
          <input
            placeholder="Enter Role"
            className="input-field opacity-100"
            type="text"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          />
          <label htmlFor="input-field" className="input-label opacity-100">
            Enter Role
          </label>
          <span className="input-highlight"></span>
        </div>

        {/* Error Message */}
        <div className="btn-cont mt-16 flex flex-col gap-2 opacity-100">
          <p className="error-msg text-red-500 ml-16">{errorMsg}</p>

          {/* Submit Button */}
          <div>
            {loading ? (
              "Loading ..."
            ) : (
              <button
                className="button opacity-100"
                type="button"
                onClick={onCreation}
                disabled={buttonDisabled}
              >
                Create
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

export default SignUpComponent;
