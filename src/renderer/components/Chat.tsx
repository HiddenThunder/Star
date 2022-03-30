import { useSelector } from 'react-redux';

const Chat = () => {
  const messages = useSelector((state) => state.chat);

  return (
    <div id="chat" className="inline">
      <ul>
        {messages.map((message: any, key: any) => {
          return <li key={key}>{message}</li>;
        })}
      </ul>
    </div>
  );
};

export default Chat;
