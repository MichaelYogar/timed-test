import { createContext } from "react";

export type NextContextType = {
  handleNext: () => void;
};

export const NextContext = createContext<NextContextType>({
  handleNext: () => {},
});
