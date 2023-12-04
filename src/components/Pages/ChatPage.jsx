import { Navigate } from 'react-router-dom';

function ChatPage({ onlineUsers, selectedGroup }) {
  return !selectedGroup ? (
    <Navigate to="/" replace={true} />
  ) : (
    <div className="flex bg-[red] ">
      <div className="w-10/12">
        <div className="p-2">{selectedGroup}</div>
        <div className="h-[80vh] bg-[green] relative pb-10">
          <div className="p-2 h-full overflow-y-scroll">
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
            <div>Chating... </div>
          </div>
          <div className="bg-[yellow] absolute w-full bottom-0 p-2">Input</div>
        </div>
      </div>
      <div className="w-2/12">
        <div className="p-2">Users</div>
        <div className="h-[80vh] bg-[brown]">
          <div className="p-2 h-full overflow-y-scroll">
            {onlineUsers.map((user) => (
              <div key={user}>{user}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
