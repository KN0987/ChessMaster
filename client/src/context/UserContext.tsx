import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the user type
interface User {
  name: string;
  email: string;
  created_at: string;
  elo: number;
  num_draws: number;
  num_losses: number;
  num_wins: number;
  total_games: number;
  uid: string;
}

interface UserContextType {
  user: User | null;
  setUserInfo: (userInfo: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); 

  const setUserInfo = (userInfo: User | null) => {
    setUser(userInfo); 
  };

  return (
    <UserContext.Provider value={{ user, setUserInfo }}>
      {children} 
    </UserContext.Provider>
  );
};

// Custom hook to access user context in any component
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
