import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getUserData } from '../api/user';
import {User} from '../types/user';


interface UserContextType {
  user: User | null;
  setUserInfo: (userInfo: User | null) => void;
  loading: boolean; // New loading state
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Set loading state

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionId');
    if (!sessionID) {
      setLoading(false); // Set loading to false if no sessionID
      return;
    }

    const verifySession = async () => {
      try {
        // Make an API call to check if the session is valid and get user data
        const response = await getUserData();
        if (response) {
          setUser(response);
        } else {
          setUser(null);
          localStorage.removeItem('sessionId');
        }
      } catch (error: any) {
        console.error('Error verifying session:', error);
        setUser(null);

        if (error.message && error.message.includes("Invalid or expired token")) {
          console.log("Session expired or invalid, removing sessionId");
          localStorage.removeItem('sessionId'); 
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const setUserInfo = (userInfo: User | null) => {
    setUser(userInfo);
    if (!userInfo) {
      localStorage.removeItem('sessionId'); // Remove sessionId if logging out
    }
  };

  return (
    <UserContext.Provider value={{ user, setUserInfo, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
