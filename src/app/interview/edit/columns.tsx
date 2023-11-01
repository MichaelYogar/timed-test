import { parseDuration } from "@/src/lib/utils";
import { Prisma } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { HTMLProps, useEffect, useMemo, useRef } from "react";

const question = Prisma.validator<Prisma.QuestionDefaultArgs>()({});

type Question = Prisma.QuestionGetPayload<typeof question>;

const columnHelper = createColumnHelper<Question>();

const columns = useMemo(
  () => [
    {
      id: "select",
      header: ({ table }) => <>Select</>,
      cell: ({ row, table }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: () => {
                table.toggleAllRowsSelected(false);
                row.toggleSelected(!row.isSelected);
              },
            }}
          />
        </div>
      ),
    },
    columnHelper.accessor("content", {
      header: () => <span>Title</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("duration", {
      id: "minites",
      header: () => <span>Minutes</span>,
      cell: (info) => {
        return (
          <div className="text-white">
            {parseDuration(info.getValue()).minutes}
          </div>
        );
      },
    }),
    columnHelper.accessor("duration", {
      id: "seconds",
      header: () => <span>Seconds</span>,
      cell: (info) => parseDuration(info.getValue()).seconds,
    }),
  ],
  []
);

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
