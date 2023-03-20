import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

type searchContextType = {
  searchString: string;
  updateSearch?: (searchStr: string) => void;
};

const searchContextDefaultValues: searchContextType = {
  searchString: '',
};

export const searchContext = createContext<searchContextType>(
  searchContextDefaultValues
);

export function useSearch() {
  return useContext(searchContext);
}

type Props = {
  children: ReactNode;
};

export function SearchProvider({ children }: Props) {
  const [searchString, setSearchString] = useState<string>('');
  const updateSearch = (searchStr: string) => {
    setSearchString(searchStr);
  };
  const value = { searchString: searchString, updateSearch: updateSearch };

  return (
    <>
      <searchContext.Provider value={value}>{children}</searchContext.Provider>
    </>
  );
}
