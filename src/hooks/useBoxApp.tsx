import React, { createContext, useState, useContext, useEffect } from 'react';

export type BoxAppContextType = {
  isAppModifying: boolean;
  isWindowMouseDown: boolean;
  setIsAppModifying: (value: boolean) => void;
} | null;

export const useBoxAppOrigin = () => {
  const [isAppModifying, setIsAppModifying] = useState<boolean>(false);
  const [isWindowMouseDown, setIsWindowMouseDown] = useState<boolean>(false);

  useEffect(() => {
    const onWindowMouseDown = () => {
      setIsWindowMouseDown(true);
    };

    const onWindowMouseUp = () => {
      setIsWindowMouseDown(false);
    };

    window.addEventListener('mousedown', onWindowMouseDown);
    window.addEventListener('mouseup', onWindowMouseUp);

    return () => {
      window.removeEventListener('mousedown', onWindowMouseDown);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, []);

  return {
    isAppModifying,
    isWindowMouseDown,
    setIsAppModifying,
  };
};

const BoxAppContext = createContext<BoxAppContextType>(null);

export const BoxAppProvider = ({ children, value }: { children: React.ReactNode; value: BoxAppContextType }) => {
  return <BoxAppContext.Provider value={value}>{children}</BoxAppContext.Provider>;
};

export const useBoxApp = () => useContext(BoxAppContext)!;
