import { NavLink, Outlet } from 'react-router-dom';

const NavLinkItem = ({ children, ...rest }) => {
  const styling = 'text-white px-8 py-3';

  return (
    <NavLink
      {...rest}
      className={({ isActive }) =>
        isActive ? styling + ' bg-[#111111]' : styling
      }
    >
      {children}
    </NavLink>
  );
};

function NavBar({ selectedGroup }) {
  return (
    <>
      <div className="bg-[#333333] flex justify-center">
        {selectedGroup && <NavLinkItem to="/chat">Chat</NavLinkItem>}
        <NavLinkItem to="/">Groups</NavLinkItem>
        <NavLinkItem to="/create">Create</NavLinkItem>
      </div>
      <div className="sm:w-11/12 md:w-9/12 xs:w-11/12 mx-auto mt-[25px]">
        <Outlet />
      </div>
    </>
  );
}

export default NavBar;
