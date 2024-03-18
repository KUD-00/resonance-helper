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
import { linuxTimeToMinutesAgo, trendArrow } from "@/utils/utils"
import { filteredStationsDict, getStationName } from "@/config/stations"
import { getGoodName } from "@/config/goods"

export const columns: ColumnDef<ProfitTableCell, any>[] = [
  // TODO: fix english column description to cn 
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
    id: "goodId",
    accessorKey: "goodId",
    header: "商品名称",
    cell: ({ row }) => (
      <div className="capitalize">{getGoodName(row.getValue("goodId"))}</div>
    ),
  },
  {
    id: "targetStationId",
    accessorKey: "targetStationId",
    header: "贩卖站点",
    cell: ({ row }) => (
      <div className="capitalize">{getStationName(row.getValue("targetStationId"))}</div>
    ),
  },
  {
    id: "buyPrice",
    accessorKey: "buyPrice",
    header: "买价",
    cell: ({ row }) => {
      const arrow = trendArrow(row.getValue("buyPriceTrend"));
      const buyPercent = row.getValue("buyPercent") as number; // Add type assertion
      return (
        <div className="flex-col justify-center">
          <div className="capitalize">{`${row.getValue("buyPrice")}${arrow}`}</div>
          {buyPercent > 100 ? (
            <div className="capitalize text-sm text-green-600">{`(${buyPercent}%)`}</div>
          ) :
            <div className="capitalize text-sm text-red-600">{`(${buyPercent}%)`}</div>
          }
        </div>
      );
    },
  },
  {
    id: "sellPrice",
    accessorKey: "sellPrice",
    header: "卖价",
    cell: ({ row }) => {
      const arrow = trendArrow(row.getValue("sellPriceTrend"));
      const sellPercent = row.getValue("sellPercent") as number; // Add type assertion
      return (
        <div className="flex-col justify-center">
          <div className="capitalize">{`${row.getValue("sellPrice")}${arrow}`}</div>
          {sellPercent > 100 ? (
            <div className="capitalize text-sm text-red-600">{`(${sellPercent}%)`}</div>
          ) :
            <div className="capitalize text-sm text-green-600">{`(${sellPercent}%)`}</div>
          }
        </div>
      );
    },
  },
  {
    id: "perProfit",
    accessorKey: "perProfit",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
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
    id: "allProfit",
    accessorKey: "allProfit",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            总利润
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("allProfit")}</div>
    ),
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "更新时间",
    cell: ({ row }) => (
      <div className="capitalize">{linuxTimeToMinutesAgo(row.getValue("updatedAt"))}</div>
    ),
  },
  {
    id: "buyPriceTrend",
    accessorKey: "buyPriceTrend",
    header: "成本趋势",

    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("buyPriceTrend"))}</div>
    ),
  },
  {
    id: "sellPriceTrend",
    accessorKey: "sellPriceTrend",
    header: "贩卖趋势",

    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("sellPriceTrend"))}</div>
    ),
  },
  {
    id: "buyPercent",
    accessorKey: "buyPercent",
    header: "成本百分比",

    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("buyPercent"))}</div>
    ),
  },
  {
    id: "sellPercent",
    accessorKey: "sellPercent",
    header: "成本百分比",

    cell: ({ row }) => (
      <div className="capitalize">{(row.getValue("sellPercent"))}</div>
    ),
  },
]

export function ProfitTable({ profitTable }: { profitTable: StationProfitTable }) {
  const [selectedStationId, setSelectedStationId] = React.useState("83000014")
  const [selectedTargetStationId, setSelectedTargetStationId] = React.useState("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      select: true,
      goodId: true, //hide this column by default
      buyPrice: true,
      sellPrice: true,
      perProfit: true,
      allProfit: true,
      updatedAt: true,
      buyPriceTrend: false,
      sellPriceTrend: false,
      buyPercent: false,
      sellPercent: false
    },
    )
  const [rowSelection, setRowSelection] = React.useState({})
  const [dataTable, setDataTable] = React.useState(profitTable[selectedStationId])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 } as any)

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
      rowSelection,
      columnVisibility,
      pagination    
    },
  })

  const allProfitTableDatas = Object.values(profitTable).reduce((acc, value) => [...acc, ...value], []);
  console.log(allProfitTableDatas)

  React.useEffect(() => {
    if (selectedStationId == "all" && selectedTargetStationId == "all") { //两个都是所有城市
      setDataTable(allProfitTableDatas);
    }  
    else if (selectedTargetStationId == "all") { // 终点是所有城市
      setDataTable(profitTable[selectedStationId] || []);
    } 
    else if (selectedStationId == "all") { // 起点是所有城市
      const filteredData = allProfitTableDatas.filter(item => item.targetStationId == selectedTargetStationId);
      setDataTable(filteredData || []);
    } 
    else {
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
            <SelectItem key={"all"} value={"all"}>
              所有城市
            </SelectItem>
            {Object.entries(filteredStationsDict).map(([stationId, { name }]) => (
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
            {Object.entries(filteredStationsDict).map(([stationId, { name }]) => (
              <SelectItem key={stationId} value={stationId}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              可见列 <ChevronDownIcon className="ml-2 h-4 w-4" />
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
            onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex - 1 })}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination({ ...pagination, pageIndex: pagination.pageIndex + 1 })}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}