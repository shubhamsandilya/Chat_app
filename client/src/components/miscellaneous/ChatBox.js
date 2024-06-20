import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`${
        selectedChat ? "flex" : "hidden"
      } md:flex items-center flex-col p-3 bg-white w-full md:w-2/3 border ml-2 rounded-lg`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}
