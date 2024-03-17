"use client"

import * as React from "react"
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { linuxTimeToHoursAgo } from "@/utils/utils"
import { filteredStationsDict, getStationName } from "@/config/stations"
import { getGoodName } from "@/config/goods"

export const columns: ColumnDef<ProfitTableCell, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "goodId",
    header: "商品名称",
    cell: ({ row }) => (
      <div className="capitalize">{getGoodName(row.getValue("goodId"))}</div>
    ),
  },
  {
    accessorKey: "targetStationId",
    header: "贩卖站点",
    cell: ({ row }) => (
      <div className="capitalize">{getStationName(row.getValue("targetStationId"))}</div>
    ),
  },
  {
    accessorKey: "buyPrice",
    header: "买价",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("buyPrice")}</div>
    ),
  },
  {
    accessorKey: "sellPrice",
    header: "卖价",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("sellPrice")}</div>
    ),
  },
  {
    accessorKey: "perProfit",
    header: ({ column }) => {
      return (
        <div className="flex justify-center"> {/* 添加flex容器，并使其水平居中 */}
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            单体利润
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("perProfit")}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ row }) => (
      <div className="capitalize">{linuxTimeToHoursAgo(row.getValue("updatedAt"))}</div>
    ),
  },
]

export function DataTableDemo({ profitTable }: { profitTable: StationProfitTable }) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [selectedTargetStationId, setSelectedTargetStationId] = React.useState("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [dataTable, setDataTable] = React.useState(profitTable[selectedStationId])

  const table = useReactTable({
    data: dataTable,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      // pagination: { // TODO: Fix this
      //   pageIndex: 0, // Add the missing pageIndex property
      //   pageSize: 20,
      // }
    },
  })

  React.useEffect(() => {
    if (selectedTargetStationId == "all") {
      setDataTable(profitTable[selectedStationId] || []);
    } else {
      const filteredData = profitTable[selectedStationId].filter(item => item.targetStationId == selectedTargetStationId);
      setDataTable(filteredData || []);
    }
  }, [selectedStationId, selectedTargetStationId]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4 md:gap-20">
        {/*<Input
          placeholder="过滤商品"
          value={(table.getColumn("good_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("good_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        */}
        <Select onValueChange={(station_id) => { setSelectedStationId(station_id) }} defaultValue={selectedStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="起点" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(filteredStationsDict).map(([stationId, {name}]) => (
              <SelectItem key={stationId} value={stationId}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(station_id) => { setSelectedTargetStationId(station_id) }} defaultValue={selectedTargetStationId}>
          <SelectTrigger className="">
            <SelectValue placeholder="选择站点" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"all"} value={"all"}>
              所有城市
            </SelectItem>
            {Object.entries(filteredStationsDict).map(([stationId, {name}]) => (
              <SelectItem key={stationId} value={stationId}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}