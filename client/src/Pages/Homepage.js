import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

export default function Homepage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div
      className="flex items-center justify-center mx-auto min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?size=626&ext=jpg&ga=GA1.1.1141335507.1718755200&semt=sph')`,
        width: "100%",
      }}
    >
      <div className="w-[450px] max-w-6xl p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex justify-center p-3 mb-4 bg-white rounded-t-lg">
          <h1 className="text-4xl font-sans text-black">Chat App</h1>
        </div>
        <div className="flex justify-center mb-4">
          <ul className="flex w-full gap-2">
            <li className="w-1/2">
              <button
                className={`w-full py-2 text-center rounded-t-lg ${
                  selectedTab === "login" ? "bg-green-200" : "bg-green-100"
                }`}
                onClick={() => setSelectedTab("login")}
              >
                Login
              </button>
            </li>
            <li className="w-1/2">
              <button
                className={`w-full py-2 text-center rounded-t-lg ${
                  selectedTab === "signup" ? "bg-green-200" : "bg-green-100"
                }`}
                onClick={() => setSelectedTab("signup")}
              >
                Sign up
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4">
          {selectedTab === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
}
