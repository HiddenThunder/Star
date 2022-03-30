import { useSelector } from 'react-redux';

const Chat = () => {
  const messages = useSelector((state) => state.chat);

  // const now = () => +new Date();

  return (
    <div id="chat" className="inline">
      <div className="messages-container">
        {messages.map((message: any, index: any) => {
          return (
            <div className="no-bullets" key={index}>
              {message}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
