"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type DataPopulasiBanjarbaru = {
  id: string;
  year: string;
  province: string;
  vegetable: string;
  production: number;
};

export const columns: ColumnDef<DataPopulasiBanjarbaru>[] = [
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
    accessorKey: "province",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Provinsi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const province = row.getValue<string>("province");
      return <div className="text-left ml-4 font-medium">{province}</div>;
    },
  },

  {
    accessorKey: "year",
    header: "Tahun",
    cell: ({ row }) => {
      const year = row.getValue<string>("year");
      return <div className="text-left">{year}</div>;
    },
  },

  {
    accessorKey: "vegetable",
    header: "Jenis Sayuran",
    cell: ({ row }) => {
      const vegetable = row.getValue<string>("vegetable");
      return <div className="text-left">{vegetable}</div>;
    },
  },

  {
    accessorKey: "production",
    header: "Jumlah Produksi",
    cell: ({ row }) => {
      const production = row.getValue<number>("production");
      return <div className="text-left">{production}</div>;
    },
  },
];
