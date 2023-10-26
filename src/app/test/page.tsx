"use client";
import { useEffect, useRef, useState } from "react";
import * as Icons from "./icons";
import { a, useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}

const Page = () => {
  const [open, setOpen] = useState(false);
  const previous = usePrevious(open);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: open ? viewHeight : 0,
      opacity: open ? 1 : 0,
      y: open ? 0 : 20,
    },
  });

  const Icon = Icons[`${open ? "Minus" : "Plus"}SquareO`];

  return (
    <div className="w-[100px]">
      <div className="flex items-center">
        <Icon
          onClick={() => setOpen((prev) => !prev)}
          style={{
            height: "1em",
            width: "1em",
            marginRight: 10,
            cursor: "pointer",
            verticalAlign: "middle",
          }}
        />
        <span>Main</span>
      </div>
      <animated.div
        style={{
          opacity,
          height: open && previous === open ? "auto" : height,
          willChange: "transform, opacity, height",
          marginLeft: "6px",
          padding: "0px 0px 0px 14px",
          borderLeft: "1px dashed rgba(255, 255, 255, 0.4)",
          overflow: "hidden",
        }}
      >
        <a.div ref={ref} style={{ y }}>
          <div className="flex items-center">
            <Icon
              onClick={() => setOpen((prev) => !prev)}
              style={{
                height: "1em",
                width: "1em",
                marginRight: 10,
                cursor: "pointer",
                verticalAlign: "middle",
              }}
            />
            <span>Main 2</span>
          </div>
        </a.div>
      </animated.div>
    </div>
  );
};

export default Page;
