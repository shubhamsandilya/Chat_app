import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const notify = (message, type) => {
    toast(message, { type, position: "bottom-center", autoClose: 3000 });
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      notify("Please fill in all fields", "warning");
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
        `${process.env.REACT_APP_BASE_URL}/api/user/login`,
        { email, password },
        config
      );
      notify("Login Successful", "success");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error);
      notify(error.response.data.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-[350px]">
      <ToastContainer />
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
          required
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="Enter Your Email"
          value={email}
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
            required
            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Enter Your Password"
            value={password}
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

      <button
        onClick={submitHandler}
        className={`w-full py-2 mt-3 text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  );
}
