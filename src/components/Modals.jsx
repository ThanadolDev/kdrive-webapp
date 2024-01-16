import React from 'react'

export const Modals = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-800 opacity-75 " onClick={onClose}></div>
            <div className="z-10 bg-white p-4 rounded-lg  m-16  min-w-[300px] items-center justify-center">{children}</div>
        </div>
    )
}
