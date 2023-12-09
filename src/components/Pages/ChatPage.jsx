import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { groupHub } from '../../hub/groupsHubConfig';

function ChatPage({ onlineUsers, selectedGroup, user, prevGroupSelection }) {
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);

  useEffect(() => {
    if (selectedGroup && user) {
      const hubConnection = async () => {
        groupHub.createConnection(user.nickname, selectedGroup.name);
        await groupHub.connect();
        console.log(prevGroupSelection.current);
        groupHub.connection.invoke(
          'ConnectUserToGroup',
          user.nickname,
          selectedGroup.name,
          prevGroupSelection.current ? prevGroupSelection.current.name : '',
        );
        groupHub.connection.on('OnUserConnectionToGroup', (message) => {
          console.log(message);
          setMessages(message.groupMessages);
          setUsersOnline(message.usersInGroup);
        });
      };
      hubConnection();
    }
  }, []);

  //   {
  //     "id": 1,
  //     "content": "My message",
  //     "senderId": 1,
  //     "senderNickname": "Peter",
  //     "groupId": 1,
  //     "groupName": "Music",
  //     "messageSent": "2023-12-06T14:33:20.5490206"
  // }

  return !selectedGroup ? (
    <Navigate to="/" replace={true} />
  ) : (
    <div className="flex bg-[red] ">
      <div className="w-10/12">
        <div className="p-2">{selectedGroup.name}</div>
        <div className="h-[80vh] bg-[green] relative pb-10">
          <div className="p-2 h-full overflow-y-scroll">
            {messages.map((msg) => (
              <div key={msg.id}>
                <b>
                  <i>
                    {new Date(msg.messageSent).toLocaleString()}{' '}
                    <span className='text-[blue]'>{msg.senderNickname}</span>:
                  </i>
                </b>{' '}
                {msg.content}
              </div>
            ))}
          </div>
          <div className="bg-[yellow] absolute w-full bottom-0 p-2">Input</div>
        </div>
      </div>
      <div className="w-2/12">
        <div className="p-2">Online</div>
        <div className="h-[80vh] bg-[brown]">
          <div className="p-2 h-full overflow-y-scroll">
            {usersOnline.map((user) => (
              <div key={user}>{user}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
