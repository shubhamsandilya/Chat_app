import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";

export default function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full h-[91.5vh] p-2.5">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
}
