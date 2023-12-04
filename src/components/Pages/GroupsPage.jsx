import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupsPage({ groupsList, onGroupConnect }) {
  const [selected, setSelected] = useState('');

  const navigate = useNavigate();

  return (
    <div className="flex justify-center flex-col items-center w-full">
      {groupsList.map((group) => (
        <div
          className={`cursor-default p-2 w-[50%] flex justify-center ${
            selected === group && ' bg-[green]'
          }`}
          onClick={() => setSelected(group)}
          key={group}
        >
          {group}
        </div>
      ))}
      <button
        onClick={() => {
          if (selected) onGroupConnect(selected);
          navigate('/chat');
        }}
        className="p-2 w-full mt-2 bg-[lightgrey]"
      >
        Connect
      </button>
    </div>
  );
}

export default GroupsPage;
