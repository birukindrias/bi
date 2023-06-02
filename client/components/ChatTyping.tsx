const ChatTyping = () => {
  return (
    <div className="inline-block py-2 px-6 bg-hive_gray_blue rounded-3xl rounded-bl-sm">
      <div className="typing flex items-center h-4">
        <div className="dot bg-white"></div>
        <div className="dot  bg-white"></div>
        <div className="dot  bg-white"></div>
      </div>
    </div>
  );
};

export default ChatTyping;
