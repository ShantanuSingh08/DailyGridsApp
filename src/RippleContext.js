// RippleContext.js
import React, { createContext, useContext, useState } from 'react';

const RippleContext = createContext();

export const RippleProvider = ({ children }) => {
  const [isRippleEnabled, setIsRippleEnabled] = useState(false); // Default to true

  return (
    <RippleContext.Provider value={{ isRippleEnabled, setIsRippleEnabled }}>
      {children}
    </RippleContext.Provider>
  );
};

export const useRipple = () => useContext(RippleContext);
