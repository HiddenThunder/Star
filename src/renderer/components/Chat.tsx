import { useSelector } from 'react-redux';

const Chat = () => {
  const messages = useSelector((state) => state.chat);
  const channel = useSelector((state) => state.channel);

  return (
    <div id="chat" className="inline">
      <h3 className="header">Messages</h3>
      <ul className="no-bullets">
        {messages
          .filter((message: any) => message.channel == channel.topic)
          .map((message: any, index: any) => {
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
