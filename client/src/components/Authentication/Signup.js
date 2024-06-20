import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => {
    setShow(!show);
  };

  const notify = (message, type) => {
    toast(message, { type, position: "bottom-center", autoClose: 3000 });
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      notify("Please Select an Image", "warning");
      setLoading(false);
      return;
    }

    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("file", pics);
      data.append("upload_preset", "hirego");
      fetch("https://api.cloudinary.com/v1_1/dtcfxjepi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      notify("Please Select an Image", "warning");
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      notify("Please Fill all the Fields", "warning");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      notify("Passwords Do Not Match", "warning");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/user`,
        { name, email, password, pic },
        config
      );
      notify("Registration Successful", "success");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      notify(error.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <ToastContainer />
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            id="password"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleShow}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            id="confirm-password"
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleShow}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="pic"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Your Picture
        </label>
        <input
          type="file"
          id="pic"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </div>

      <button
        onClick={submitHandler}
        className={`w-full py-2 mt-3 text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "SignUp"}
      </button>
    </div>
  );
}
