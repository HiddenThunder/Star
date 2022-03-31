import { useSelector } from 'react-redux';

const Chat = () => {
  const messages = useSelector((state) => state.chat);

  // const now = () => +new Date();

  return (
    <div id="chat" className="inline">
      <h3 className="header">Messages</h3>
      <ul className="no-bullets">
        {messages.map((message: any, index: any) => {
          return (
            <li className="item" key={index}>
              {message}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Chat;
