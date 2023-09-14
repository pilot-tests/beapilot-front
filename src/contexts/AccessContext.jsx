import { createContext, useContext } from 'react';

const AccessContext = createContext();

export const useAccess = () => {
    return useContext(AccessContext);
};

export default AccessContext;