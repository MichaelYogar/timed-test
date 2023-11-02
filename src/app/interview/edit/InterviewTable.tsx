"use client";

import { Prisma } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
import { parseDuration } from "@/src/lib/utils";

const question = Prisma.validator<Prisma.QuestionDefaultArgs>()({});

type Question = Prisma.QuestionGetPayload<typeof question>;

const columnHelper = createColumnHelper<Question>();

export const InterviewTable = ({ data, onRowSelectStateChange }) => {
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
  const { getState, reset, ...table } = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: () => true,
  });

  useEffect(() => {
    onRowSelectStateChange(getState().rowSelection);
  }, [getState()]);

  useEffect(() => {
    reset();
  }, [reset, data]);

  return (
    <div style={{ gridTemplateColumns: "1fr" }} className="grid h-full">
      <div className="grid grid-cols-1 justify-items-center items-center">
        {data && (
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

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
