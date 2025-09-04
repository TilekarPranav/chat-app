import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // ✅ Get all users with unseen count
  const getUser = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUser(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch chat messages
  const getMessages = async () => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.get(`/api/messages/${selectedUser._id}`);
      if (data.success) {
        setMessages(data.messages);

        // reset unseen count for this user
        setUnseenMessages((prev) => ({ ...prev, [selectedUser._id]: 0 }));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Send message
  const sendMessages = async (messageData) => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );

      if (data.success) {
        // 👇 Fix: backend returns newMessage not newMessages
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data.newMessage, seen: true } // mark own msg seen
        ]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Listen for incoming messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // you are chatting with the sender → append and mark as seen
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // message from another user → increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    user,
    selectedUser,
    getUser,
    getMessages,
    sendMessages,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
