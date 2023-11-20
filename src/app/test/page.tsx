"use client";
import { Tree } from "@/src/components/Tree";
const Page = () => {
  return (
    <div>
      <Tree content="top">
        <Tree content="asdf" />
        <Tree content="asdf" />
        <Tree content="asdf" />
        <Tree content="asdf2">
          <Tree content="asdf3" />
        </Tree>
        <Tree content="asdf2">
          <Tree content="asdf3" />
        </Tree>
        <Tree content="asdf3" />
        <Tree content="asdf3" />
      </Tree>
    </div>
  );
};

export default Page;
