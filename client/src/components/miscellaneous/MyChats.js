import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "./GroupChatModal";

export default function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const fetchChats = async () => {
    setIsLoadingChat(true);
    const logdata = await JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(logdata);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      alert(`Error Occured- ${error.message} in Mychats`);
    }
    setIsLoadingChat(false);
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col items-center p-3 bg-white w-full md:w-1/3 h-[89vh] rounded-lg border border-gray-300`}
    >
      <div className="pb-3 px-3 text-2xl md:text-3xl font-sans flex w-full justify-between items-center">
        My Chats
        <GroupChatModal>
          <button className="flex items-center text-sm md:text-xs lg:text-sm bg-blue-500 text-white px-2 py-1 rounded-md">
            <AddIcon className="mr-1" />
            Create Group
          </button>
        </GroupChatModal>
      </div>

      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-hidden">
        {isLoadingChat ? (
          <ChatLoading />
        ) : (
          <div className="flex flex-col overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg mb-1 ${
                  selectedChat === chat
                    ? "bg-teal-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
