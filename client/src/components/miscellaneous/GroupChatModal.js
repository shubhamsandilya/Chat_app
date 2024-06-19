import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";
import UserListItem from "../../UserAvatar/UserListItem";

export default function GroupChatModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/user?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert(`Error Occured: ${error.message} in GroupChatModal`);
      setLoading(false);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User Already Added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please Fill all the fields");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      alert("New Group Chat Created");
    } catch (error) {
      alert("Failed to create the Chat");
    }
  };

  const handleDelete = (userToDelete) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== userToDelete._id)
    );
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl w-11/12 md:w-1/2 lg:w-1/3">
            <div className="px-6 py-4">
              <div className="text-2xl font-semibold text-center mb-4">
                Create Group Chat
              </div>
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Chat Name"
                  className="w-full px-3 py-2 border rounded-md mb-3 text-base"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Add Users eg: John, Piyush, Jane"
                  className="w-full px-3 py-2 border rounded-md text-base"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap mb-4 text-sm">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              {loading ? (
                <div>Loading</div>
              ) : (
                searchResult
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </div>
            <div className="px-6 py-4 flex justify-end">
              <button
                className="bg-blue-500 text-sm text-white px-4 py-2 rounded-md"
                onClick={handleSubmit}
              >
                Create
              </button>
              <button
                className="bg-gray-300 text-sm text-black px-4 py-2 ml-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
