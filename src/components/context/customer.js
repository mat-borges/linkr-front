import { createContext } from 'react';
import { useState } from 'react';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [userImage, setUserImage] = useState('');
  const [following, setFollowing] = useState([]);

  return (
    <CustomerContext.Provider value={{ token, setToken, userId, setUserId, userImage, setUserImage, setFollowing, following }}>
      {children}
    </CustomerContext.Provider>
  );
};
