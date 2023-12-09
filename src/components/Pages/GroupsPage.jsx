import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupsPage({ groupsList, onGroupConnect, selectedGroup }) {
  const [selected, setSelected] = useState(selectedGroup);
  const navigate = useNavigate();

  return (
    <div className="flex justify-start flex-col items-center w-full h-[80vh]">
      <div className="flex justify-start flex-col items-center w-full h-full overflow-y-scroll">
        {groupsList.map((group) => (
          <div
            className={`cursor-default p-2 w-[50%] flex justify-center ${
              selected.name === group.name && ' bg-[grey]'
            }`}
            onClick={() => setSelected(group)}
            key={group.name}
          >
            {group.name}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          if (selected) onGroupConnect(selected);
          navigate('/chat');
        }}
        className="p-2 w-full mt-2 bg-[lightgrey] mt-auto"
      >
        Connect
      </button>
    </div>
  );
}

export default GroupsPage;
