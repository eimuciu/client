import { useEffect } from 'react';
import './style.css';
import * as signalR from '@microsoft/signalr';

var connection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5085/chatHub')
  .build();

async function connect() {
  await connection.start().catch((err) => console.log(err));
}

function App() {
  useEffect(() => {
    connect();

    connection.on('ReceiveMessage', (user, message) => {
      console.log(user);
      console.log(message);
    });
  }, []);

  const sendMessage = () => {
    connection.invoke('SendMessage', 'Peter', 'I am saying hello to you');
    connection.invoke(
      'SecondMessage',
      'OtherPeter',
      'NowAnotherFunction invoked',
    );
  };

  return (
    <div style={{ margin: '0 auto', textAlign: 'center' }}>
      <h1>hello there</h1>
      <button onClick={sendMessage}>Send message</button>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </div>
  );
}

export default App;
