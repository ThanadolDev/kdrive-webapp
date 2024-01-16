import React from "react";

export const Rightclickmodal = ({ isOpen, onClose, position, children }) => {
    if (!isOpen) return null;
  
    const { x, y } = position;
  
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={onClose}
        onContextMenu={onClose}
      >
        <div className="absolute inset-0 "></div>
        <div
          className="z-10 bg-white p-1 rounded-lg min-w-52 items-center justify-center drop-shadow-xl border-2 border-slate-200"
          style={{ position: 'absolute', top: `${y}px`, left: `${x}px` }}
        >
          {children}
        </div>
      </div>
    );
  };
