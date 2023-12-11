import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GroupsPage({ groupsList, onGroupConnect, selectedGroup }) {
  const [selected, setSelected] = useState(selectedGroup);
  const navigate = useNavigate();

  const pushFeedbackGroup = (groupsArr) => {
    const copyArr = groupsArr.map((x) => x);
    const idx = copyArr.findIndex((x) => x.name === 'Feedback');
    const item = { ...copyArr[idx] };
    copyArr.splice(idx, 1);
    copyArr.unshift(item);
    return copyArr;
  };

  return (
    <div className="flex justify-start flex-col items-center w-full h-[80vh]">
      <div className="flex justify-start flex-col items-center w-full h-full overflow-y-scroll">
        {pushFeedbackGroup(groupsList).map((group) => (
          <div
            className={`cursor-default p-2 w-[50%] flex justify-center ${
              selected.name === group.name && ' bg-[#8D99AE]'
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
        className="p-2 w-full mt-2 bg-[#CCCCCC] mt-auto"
      >
        Connect
      </button>
    </div>
  );
}

export default GroupsPage;
