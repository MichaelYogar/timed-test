"use client";

import { useSpring, animated } from "@react-spring/web";
import { memo, useState } from "react";
import { useEffect, useRef } from "react";
import useMeasure from "react-use-measure";
import * as Icons from "./icons";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const Frame = ({ children }) => {
  return (
    <div
      className="
        relative 
        py-1 
        truncate 
        align-middle 
        text-gray-900
      "
    >
      {children}
    </div>
  );
};

const Tree = memo<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    name: string | JSX.Element;
  }
>(function Greeting({ children, name, style, defaultOpen = false }) {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  });
  const Icon =
    Icons[`${children ? (isOpen ? "Minus" : "Plus") : "Close"}SquareO`];

  <Frame>
    <div onClick={() => setOpen(!isOpen)}>
      <Icon />
    </div>
  </Frame>;

  return <h1>Hello, {name}!</h1>;
});

export default function MyComponent() {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
  }));

  const handleClick = () => {
    api.start({
      from: {
        x: 0,
      },
      to: {
        x: 100,
      },
    });
  };

  return (
    <animated.div
      onClick={handleClick}
      style={{
        width: 80,
        height: 80,
        background: "#ff6d6d",
        borderRadius: 8,
        ...springs,
      }}
    />
  );
}
