"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type DataPopulasiBanjarbaru = {
  kecamatan: string;
  jumlahPenduduk: number;
  lajuPertumbuhanPenduduk: number;
  persentasePenduduk: number;
  kepadatanPenduduk: number;
  rasioJenisKelamin: number;
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
    accessorKey: "kecamatan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kecamatan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const kecamatan = row.getValue<String>("kecamatan");
      return <div className="text-left ml-4 font-medium">{kecamatan}</div>;
    },
  },

  {
    accessorKey: "jumlahPenduduk",
    header: "Jumlah Penduduk",
    cell: ({ row }) => {
      const jumlahPenduduk = row.getValue<number>("jumlahPenduduk");
      return (
        <div className="text-left">
          {jumlahPenduduk.toLocaleString("id-ID")}
        </div>
      );
    },
  },

  {
    accessorKey: "lajuPertumbuhanPenduduk",
    header: "Laju Pertumbuhan Penduduk per Tahun",
    cell: ({ row }) => {
      const lajuPertumbuhanPenduduk = row.getValue<number>(
        "lajuPertumbuhanPenduduk"
      );
      return <div className="text-left">{lajuPertumbuhanPenduduk}</div>;
    },
  },

  {
    accessorKey: "persentasePenduduk",
    header: "Persentase Penduduk (%)",
    cell: ({ row }) => {
      const persentasePenduduk = row.getValue<number>("persentasePenduduk");
      return <div className="text-left">{persentasePenduduk}</div>;
    },
  },
  {
    accessorKey: "kepadatanPenduduk",
    header: "Kepadatan Penduduk per km persegi (km²)",
    cell: ({ row }) => {
      const kepadatanPenduduk = row.getValue<number>("kepadatanPenduduk");
      return (
        <div className="text-left">
          {kepadatanPenduduk.toLocaleString("id-ID")}
        </div>
      );
    },
  },
  {
    accessorKey: "rasioJenisKelamin",
    header: "Rasio Jenis Kelamin",
    cell: ({ row }) => {
      const rasioJenisKelamin = row.getValue<number>("rasioJenisKelamin");
      return (
        <div className="text-left">
          {rasioJenisKelamin.toLocaleString("id-ID")}
        </div>
      );
    },
  },
];
