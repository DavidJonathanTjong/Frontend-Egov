"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import api from "@/hooks/apiService";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type DataPegawaiKedinasan = {
  kodePegawai: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export const columns = (
  fetchData: () => void
): ColumnDef<DataPegawaiKedinasan>[] => [
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
    accessorKey: "kodePegawai",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode Pegawai
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const kodePegawai = row.getValue<string>("kodePegawai");
      return <div className="text-left ml-4 font-medium">{kodePegawai}</div>;
    },
  },

  {
    accessorKey: "name",
    header: "Nama Pegawai",
    cell: ({ row }) => {
      const name = row.getValue<string>("name");
      return <div className="text-left">{name}</div>;
    },
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue<string>("email");
      return <div className="text-left">{email}</div>;
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue<string>("createdAt");
      return <div className="text-left">{createdAt}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const updatedAt = row.getValue<string>("updatedAt");
      return <div className="text-left">{updatedAt}</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original;
      const handleDelete = async () => {
        if (confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
          try {
            await api.delete(`/users/delete/${user.kodePegawai}`);
            alert("Pegawai berhasil dihapus!");
            fetchData(); // Memperbarui data setelah penghapusan
          } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menghapus pegawai.");
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.kodePegawai)}
            >
              Salin Kode Pegawai
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete}>
              Hapus Pegawai
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
