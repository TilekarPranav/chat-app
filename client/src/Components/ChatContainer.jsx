import { useRef, useEffect, useContext, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageDate } from '../Lib/Utils';
import { ChatContext } from '../../Context/ChatContext';
import { AuthContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } = useContext(ChatContext);
  const { authUser, onlineUser } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === "") return null;
    await sendMessages({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await sendMessages({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.profile_martin} alt="Profile" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Chat Icon"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="Help Icon" className="max-md:hidden max-w-5" />
      </div>

      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {(messages || []).filter(m => m && m.senderId).map((message, index) => {
          const isSender = message.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-6 ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 rounded-full"
                />
              )}
              {message.image ? (
                <img
                  src={message.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
                    isSender
                      ? "bg-violet-500/70 rounded-br-none"
                      : "bg-gray-700/50 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </p>
              )}
              {isSender && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-7 rounded-full"
                />
              )}
              <div className="text-center text-xs text-gray-500 ml-2">
                <p>{formatMessageDate(message.createdAt)}</p>
                {isSender &&
                  index === messages.length - 1 && ( // only last sent message
                    <span>
                      {message.seen ? "✔✔ Seen" : "✔ Delivered"}
                    </span>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={scrollEnd}></div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder:text-gray-400"
          />
          <input onChange={handleSendImage} type="file" id="image" accept="image/png,image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Gallery Icon" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="Send Icon" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="Logo Icon" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
