import React, {createContext, useContext, useState} from "react";

const StateContext = createContext()

const initalState = {
    
}

export const ContextProvider = ({children}) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(undefined);
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <StateContext.Provider
        value={{activeMenu,setActiveMenu,screenSize,setScreenSize,setModalOpen,isModalOpen,openModal,closeModal
        }}
        >
            {children}
        </StateContext.Provider>
    )
}
export const useStateContext = () => useContext(StateContext);