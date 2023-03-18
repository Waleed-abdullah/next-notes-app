import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

type emailContextType = {
  userEmail: string;
  updateEmail?: (email: string) => void;
};

const emailContextDefaultValues: emailContextType = {
  userEmail: '',
};

export const emailContext = createContext<emailContextType>(
  emailContextDefaultValues
);

export function useEmail() {
  return useContext(emailContext);
}

type Props = {
  children: ReactNode;
};

export function EmailProvider({ children }: Props) {
  const [userEmail, setUserEmail] = useState<string>('');
  const updateEmail = (email: string) => {
    setUserEmail(email);
  };
  const value = { userEmail, updateEmail };

  return (
    <>
      <emailContext.Provider value={value}>{children}</emailContext.Provider>
    </>
  );
}
