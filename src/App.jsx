import { useState } from 'react';
import './style.css';
// Libraries
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
// Components
import NavBar from './components/NavBar';
import ChatPage from './components/Pages/ChatPage';
import GroupsPage from './components/Pages/GroupsPage';

const cookieName = 'kjsdnfkjsdnfkjskafldmnaflkasmdfkls';

function getCookie() {
  const cookie = Cookies.get(cookieName);

  if (cookie) return cookie;
  return '';
}

function App() {
  // const [user, setUser] = useState(getCookie());
  const [user, setUser] = useState('hellas');
  const [onlineUsers, setOnlineUsers] = useState(['peter', 'john', 'lamba']);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupsList, setGroupsList] = useState([
    'Music',
    'Movies',
    'Programming',
    'Hiking',
  ]);

  const onGroupConnect = (groupName) => {
    setSelectedGroup(() => groupName);
  };

  if (!user) {
    const username = prompt('Your username');
    if (username) {
      Cookies.set(cookieName, username);
      setUser(username);
    }
  }
  if (user)
    return (
      <RouterProvider
        router={router({
          onlineUsers,
          selectedGroup,
          groupsList,
          onGroupConnect,
        })}
      />
    );
}

function router({ onlineUsers, selectedGroup, groupsList, onGroupConnect }) {
  return createBrowserRouter([
    {
      path: '/',
      element: <NavBar selectedGroup={selectedGroup} />,
      children: [
        {
          path: '/',
          element: (
            <GroupsPage
              groupsList={groupsList}
              onGroupConnect={onGroupConnect}
              selectedGroup={selectedGroup}
            />
          ),
        },
        {
          path: '/chat',
          element: (
            <ChatPage selectedGroup={selectedGroup} onlineUsers={onlineUsers} />
          ),
        },
        {
          path: '/create',
          element: <div>Create</div>,
        },
        {
          path: '*',
          element: (
            <div className="flex justify-center items-center	h-screen">
              404 Error
            </div>
          ),
        },
      ],
    },
  ]);
}

export default App;
