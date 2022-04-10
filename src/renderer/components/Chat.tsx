import { useSelector } from 'react-redux';

const Chat = () => {
  const channel = useSelector((state) => state.channel);
  const topic = channel.topic ? channel.topic : 'lobby';
  const messages = useSelector((state) => state.chat[topic]);

  return (
    <div id="chat" className="inline">
      <h3 className="header">Messages</h3>
      <ul className="no-bullets">
        {messages.map((message: any, index: any) => {
          return (
            <li className="item" key={index}>
              {message.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Chat;
