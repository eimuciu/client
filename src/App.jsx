/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
// Styles
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Libraries
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
// Components
import NavBar from './components/NavBar';
import ChatPage from './components/Pages/ChatPage';
import GroupsPage from './components/Pages/GroupsPage';
import Modal from './components/Modal/Modal';
// Hub
import { hubConn } from './hub/hubConfig';
// Custom hooks
import { useModalController } from './components/Modal/useModalController';
// Api calls
import { getGroupsList } from './api/apiCalls';

// >>>>>>>>>>
// Cookies section
const cookieName = 'kjsdnfkjsdnfkjskafldmnaflkasmdfkls';

function getCookie() {
  const cookie = Cookies.get(cookieName);

  if (cookie) return cookie;
  return '';
}

function registrationConn(setUserFn) {
  hubConn.connection.on('UserRegistration', (message) => {
    console.log(message);
    if (!message.connected) {
      alert(message.message);
      Cookies.remove(cookieName);
      setUserFn('');
      return;
    }
    console.log('Successfull login');
    Cookies.set(cookieName, JSON.stringify(message.user));
    setUserFn(message.user);
  });
}

function App() {
  // const [user, setUser] = useState(getCookie());
  const [user, setUser] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(['peter', 'john', 'lamba']);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupsList, setGroupsList] = useState([]);

  const { isModalOpen, openModal, closeModal } = useModalController();

  const prevGroupSelection = useRef(null);

  const onGroupConnect = (group) => {
    if (selectedGroup) {
      prevGroupSelection.current = selectedGroup;
    }
    setSelectedGroup(() => group);
  };

  const logUserIn = async (userData) => {
    hubConn.createConnection(userData);
    await hubConn.connect();
    hubConn.connection.invoke('RegisterUser', userData);
    registrationConn(setUser);
    closeModal();
    const groupsData = await getGroupsList();
    setGroupsList(groupsData);
  };

  useEffect(() => {
    if (!getCookie() && !user) {
      openModal();
      return;
    }
    if (getCookie()) {
      logUserIn(JSON.parse(getCookie()).nickname);
    }
  }, []);

  if (!user) {
    return (
      <div>
        <Modal
          showModal={isModalOpen}
          handleClose={closeModal}
          logUserIn={logUserIn}
        />
      </div>
    );
  }

  if (user)
    return (
      <RouterProvider
        router={router({
          onlineUsers,
          selectedGroup,
          groupsList,
          onGroupConnect,
          user,
          prevGroupSelection,
        })}
      />
    );
}

function router({
  onlineUsers,
  selectedGroup,
  groupsList,
  onGroupConnect,
  user,
  prevGroupSelection,
}) {
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
            <ChatPage
              selectedGroup={selectedGroup}
              onlineUsers={onlineUsers}
              user={user}
              prevGroupSelection={prevGroupSelection}
            />
          ),
        },
        {
          path: '/create',
          element: (
            <div className="flex justify-center h-[80vh] items-center">
              Under construction
            </div>
          ),
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
