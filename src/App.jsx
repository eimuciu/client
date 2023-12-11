/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
// Styles
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Libraries
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
import { userCookieName, getCookie, groupCookieName } from './helpers/cookies';
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

function registrationConn(setUserFn) {
  hubConn.connection.on('UserRegistration', (message) => {
    if (!message.connected) {
      alert(message.message);
      Cookies.remove(userCookieName);
      setUserFn('');
      return;
    }
    Cookies.set(userCookieName, JSON.stringify(message.user));
    setUserFn(message.user);
  });
}

function App() {
  const [user, setUser] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupsList, setGroupsList] = useState([]);

  const { isModalOpen, openModal, closeModal } = useModalController();

  const prevGroupSelection = useRef(null);

  const onGroupConnect = (group) => {
    if (selectedGroup) {
      prevGroupSelection.current = selectedGroup;
    }
    Cookies.set(groupCookieName, JSON.stringify(group));
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
    if (!getCookie(userCookieName) && !user) {
      openModal();
      return;
    }
    if (getCookie(userCookieName)) {
      logUserIn(JSON.parse(getCookie(userCookieName)).nickname);
    }
    if (getCookie(groupCookieName)) {
      setSelectedGroup(JSON.parse(getCookie(groupCookieName)));
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
