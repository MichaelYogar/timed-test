import { PlusIcon, DashboardIcon } from "@radix-ui/react-icons";

const Page = () => {
  return (
    <div className="flex h-full items-stretch">
      <div className="basis-[260px] grow-0 flex-shrink-0 overflow-x-hidden bg-gray-900">
        <div className="h-full w-[260px]">
          <div className="flex flex-col h-full min-h-0">
            <div className="h-full w-full flex-1 items-start">
              <nav className="flex flex-col h-full w-full p-2">
                <div className="mb-1 flex flex-row gap-2">
                  <a className="flex flex-grow px-3 min-h-[44px] py-1 items-center gap-3 text-white border-white rounded-md text-sm cursor-pointer border">
                    <PlusIcon /> <span>New Test</span>
                  </a>
                  <span>
                    <a className="flex justify-center items-center p-3 min-h-[44px] py-1 gap-3 text-sm border border-white rounded-md cursor-pointer ">
                      <DashboardIcon color="white" />
                    </a>
                  </span>
                </div>
                <div className="flex-col flex-1 hover:overflow-y-auto text-white hover:max-h-screen">
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>Test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                  <div>test</div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-0 grow-[999]">Main content</div>
    </div>
  );
};

export default Page;
