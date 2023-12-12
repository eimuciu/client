/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { groupHub } from '../../hub/groupsHubConfig';

function ChatPage({ selectedGroup, user, prevGroupSelection }) {
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  // const [whoJoined, setWhoJoined] = useState([]);

  const msgBoxRef = useRef(null);

  useEffect(() => {
    if (selectedGroup && user) {
      const hubConnection = async () => {
        groupHub.createConnection(user.nickname, selectedGroup.name);
        await groupHub.connect();
        groupHub.connection.on('OnUserConnectionToGroup', (message) => {
          setMessages(message.groupMessages);
          setUsersOnline(message.usersInGroup);
        });
        groupHub.connection.invoke(
          'ConnectUserToGroup',
          user.nickname,
          selectedGroup.name,
          prevGroupSelection.current ? prevGroupSelection.current.name : '',
        );
        groupHub.connection.on('NewMessage', (res) => {
          setMessages((prev) => [...prev, res]);
        });
      };

      hubConnection();
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (messages.length || usersOnline.length) {
      groupHub.connection.on('OnUserJoinGroup', (userObj) => {
        const updatedUsers = [...usersOnline, userObj.nickname];
        setUsersOnline([...new Set(updatedUsers)]);
        // setMessages((prev) => [...prev, { joined: userObj.nickname }]);
      });

      groupHub.connection.on('OnUserDisconnecting', (userNickName) => {
        const filteredUsers = usersOnline.filter((x) => x !== userNickName);
        setUsersOnline(filteredUsers);
      });

      groupHub.connection.on('OnUserChangingGroup', (usersArr) => {
        setUsersOnline(usersArr);
      });

      if (
        selectedGroup &&
        prevGroupSelection.current &&
        selectedGroup.name !== prevGroupSelection.current.name
      ) {
        groupHub.connection.invoke(
          'ChangeUserGroup',
          prevGroupSelection.current.name,
        );
      }
      if (msgBoxRef.current) {
        msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight;
      }
    }
  }, [messages, usersOnline]);

  // useEffect(() => {
  //   if (
  //     selectedGroup &&
  //     prevGroupSelection.current &&
  //     selectedGroup.name !== prevGroupSelection.current.name
  //   ) {
  //     console.log('Changing group');
  //     groupHub.connection.invoke('ChangeUserGroup', prevGroupSelection.name);
  //   }
  // }, [selectedGroup]);

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
    <div className="flex flex-col h-[75vh]">
      <div className="flex flex-row w-[100%]">
        <div className="w-10/12 p-2 bg-[#20BF55] ">
          <b>{selectedGroup.name}:</b> <i>{selectedGroup.description}</i>
        </div>
        <div className="w-2/12 p-2 bg-[#20BF55] flex items-center">
          <b>Online</b>
        </div>
      </div>
      <div className="w-[100%] flex flex-row">
        <div className="w-10/12 h-[75vh] relative pb-20">
          <div ref={msgBoxRef} className="p-2 h-full overflow-y-scroll">
            {messages.map((msg) => {
              {
                if (msg.content) {
                  return (
                    <div key={msg.id}>
                      <i>
                        {msg.messageSent[msg.messageSent.length - 1] === 'Z'
                          ? new Date(msg.messageSent)
                              .toLocaleString()
                              .toLocaleLowerCase()
                          : new Date(msg.messageSent + 'Z')
                              .toLocaleString()
                              .toLocaleLowerCase()}{' '}
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
          <div
            className="flex gap-2 absolute w-full bottom-0 p-2 pb-3"
            style={{ borderBottom: '1px solid #CCCCCC' }}
          >
            <input
              className="w-[85%] p-2 bg-[#f8f8f8]  outline-0 text-[black] placeholder:text-[black]"
              placeholder="Send a message"
              type="text"
              value={msgInput}
              onChange={inputChangeHandler}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  sendGroupMessage();
                }
              }}
            />
            <button
              className="w-[15%] bg-[#CCCCCC] p-2"
              onClick={() => {
                sendGroupMessage();
              }}
            >
              Send
            </button>
          </div>
        </div>
        <div className="w-2/12">
          <div className="h-[75vh]">
            <div
              className="p-2 h-full overflow-y-scroll pb-3"
              style={{ borderBottom: '1px solid #CCCCCC' }}
            >
              {usersOnline.map((user) => (
                <div key={user}>{user}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
