import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import UserListItem from "../../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

export default function SideDrawer() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert(`Error Occured- ${error.message}`);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      alert(`Error Occured- ${error.message} in side Drawer`);
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div className="flex justify-around items-center bg-white w-full p-2 border-b-2">
        <button className="flex items-center" onClick={() => setIsOpen(true)}>
          <i className="fas fa-search"></i>
          <span className="hidden md:flex px-4">Chat with user</span>
        </button>

        <span className="text-3xl font-sans">Chat App</span>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="flex items-center"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              <img
                className="w-8 h-8 rounded-full"
                src={
                  user.pic ||
                  "https://img.freepik.com/premium-vector/target-audience-icon_1134231-5972.jpg?w=740"
                }
                alt={user.name}
              />
              <ChevronDownIcon />
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <ProfileModal user={user}>
                  <button className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
                    My Profile
                  </button>
                </ProfileModal>
                <hr className="border-gray-200" />
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-30 overflow-hidden">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-xl">Search Users</h2>
              <div className="flex mt-2">
                <input
                  className="flex-1 p-2 border border-gray-300 rounded-l-md"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="p-2 bg-blue-500 text-white rounded-r-md"
                  onClick={handleSearch}
                >
                  Go
                </button>
              </div>
            </div>
            <div className="p-4">
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && (
                <div className="flex justify-center">
                  <div className="loader"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
