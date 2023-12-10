import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { groupHub } from '../../hub/groupsHubConfig';

function ChatPage({ selectedGroup, user, prevGroupSelection }) {
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [whoJoined, setWhoJoined] = useState([]);

  useEffect(() => {
    if (selectedGroup && user) {
      const hubConnection = async () => {
        groupHub.createConnection(user.nickname, selectedGroup.name);
        await groupHub.connect();
        groupHub.connection.invoke(
          'ConnectUserToGroup',
          user.nickname,
          selectedGroup.name,
          prevGroupSelection.current ? prevGroupSelection.current.name : '',
        );
        groupHub.connection.on('OnUserConnectionToGroup', (message) => {
          setMessages(message.groupMessages);
          setUsersOnline(message.usersInGroup);
        });
        groupHub.connection.on('NewMessage', (res) => {
          setMessages((prev) => [...prev, res]);
        });
      };

      hubConnection();
    }
  }, []);

  useEffect(() => {
    if (messages.length && usersOnline.length) {
      groupHub.connection.on('OnUserJoinGroup', (userObj) => {
        const updatedUsers = [...usersOnline, userObj.nickname];
        setUsersOnline([...new Set(updatedUsers)]);
        // setMessages((prev) => [...prev, { joined: userObj.nickname }]);
      });

      groupHub.connection.on('OnUserDisconnecting', (userNickName) => {
        console.log('Disconnecting');
        const filteredUsers = usersOnline.filter((x) => x !== userNickName);
        setUsersOnline(filteredUsers);
      });
    }
  }, [messages]);

  const sendGroupMessage = () => {
    if (msgInput) {
      const msg = {
        content: msgInput,
        senderId: user.id,
        senderNickname: user.nickname,
        groupId: selectedGroup.id,
        groupName: selectedGroup.name,
      };

      groupHub.connection.invoke('SendGroupMessage', msg);

      setMsgInput('');
    }
  };

  const inputChangeHandler = (e) => {
    setMsgInput(e.target.value);
  };

  // public string Content { get; set; }
  // public int SenderId { get; set; }
  // public string SenderNickname { get; set; }
  // public int GroupId { get; set; }
  // public string GroupName { get; set; }

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
            {messages.map((msg) => {
              {
                if (msg.content) {
                  return (
                    <div key={msg.id}>
                      <i>
                        {new Date(msg.messageSent).toLocaleString()}{' '}
                        <span className="text-[blue]">
                          {msg.senderNickname}
                        </span>
                        :{' '}
                      </i>
                      {msg.content}
                    </div>
                  );
                }
                if (msg.joined) {
                  return (
                    <div key={msg.joined}>
                      <i>
                        <span className="text-[blue]">{msg.joined}</span>
                      </i>{' '}
                      joined
                    </div>
                  );
                }
              }
            })}
          </div>
          <div className="flex bg-[yellow] absolute w-full bottom-0 p-2">
            <input
              className="w-[85%] p-2"
              placeholder="message..."
              type="text"
              value={msgInput}
              onChange={inputChangeHandler}
            />
            <button
              className="w-[15%] bg-[grey] p-2"
              onClick={() => {
                sendGroupMessage('I am new message');
              }}
            >
              Send
            </button>
          </div>
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
