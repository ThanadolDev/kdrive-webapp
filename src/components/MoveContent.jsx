import React, { useState, useEffect } from 'react';
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { CiFolderOn } from 'react-icons/ci';

const Folder = ({ id, name, children = [], level = 0, selectedId, setSelectedId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = async (e) => {
    e.stopPropagation();
    setSelectedId(id);
  };

  return (
    <div style={{ paddingLeft: `${level}rem` }} onClick={handleSelect}>
      <div className={`flex items-center gap-2 ${selectedId === id ? 'bg-blue-200' : ''}`} >
        {/* {children.length > 0 && ( */}
          <div className="hover:bg-gray-300 rounded-full" onClick={handleToggle}>
            {isOpen ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div>
        {/* )} */}
        <div className="flex items-center gap-2">
          <div>
            <CiFolderOn />
          </div>
          <div>{name}</div>
        </div>
      </div>
      {isOpen && children.map(child => 
        <Folder key={child.id} {...child} level={level + 1} selectedId={selectedId} setSelectedId={setSelectedId} />
      )}
    </div>
  );
};

export const MoveContent = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch the root folders when the component mounts
    fetchRootFolders().then(setFolders);
  }, []);

  useEffect(() => {
    if (selectedId !== null) {
      // Fetch the subfolders of the selected folder when selectedId changes
      fetchSubfolders(selectedId).then(subfolders => {
        setFolders(folders.map(folder => 
          folder.id === selectedId ? {...folder, children: subfolders} : folder
        ));
      });
    }
  }, [selectedId]);

  return (
    <div className="w-full h-[350px] rounded-xl overflow-x-auto bg-gray-200 p-4">
      {folders.map(folder => (
        <Folder key={folder.id} {...folder} selectedId={selectedId} setSelectedId={setSelectedId} />
      ))}
    </div>
  );
};

// Replace these with your actual functions
async function fetchRootFolders() {
  // Fetch the root folders from your database
  return [{id: 1, name: 'folder1'},{id: 4, name: 'folder4'}];
}

async function fetchSubfolders(parentId) {
  // Fetch the subfolders of the folder with id parentId from your database
  if (parentId === 1) {
    return [{id: 2, name: 'folder2', parentfolder: '1'}];
  }
  return [];
}
