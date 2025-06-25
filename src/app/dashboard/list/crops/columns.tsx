"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/hooks/apiService";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Row } from "@tanstack/react-table";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type DataPopulasiBanjarbaru = {
  id: string;
  year: string;
  province: string;
  vegetable: string;
  production: number;
  planted_area: number;
  harvested_area: number;
  fertilizer_type: number;
  fertilizer_amount: number;
};

function ActionsCell({ row }: { row: Row<DataPopulasiBanjarbaru> }) {
  const crops = row.original;
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) {
      try {
        const token = Cookies.get("token");
        const response = await api.delete(`/crops/${crops.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status >= 200 && response.status < 300) {
          alert("Data crops berhasil dihapus!");
          window.location.reload();
        } else {
          throw new Error("Gagal menghapus data crops");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menghapus crops.");
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
          onClick={() =>
            router.push(
              `/dashboard/list/crops/edit/${crops.id}?year=${
                crops.year
              }&province=${encodeURIComponent(
                crops.province
              )}&vegetable=${encodeURIComponent(crops.vegetable)}&production=${
                crops.production
              }`
            )
          }
        >
          Edit Data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete}>
          Hapus Data Crops
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
  {
    accessorKey: "planted_area",
    header: "Planted Area",
    cell: ({ row }) => {
      const planted_area = row.getValue<number>("planted_area");
      return <div className="text-left">{planted_area}</div>;
    },
  },
  {
    accessorKey: "harvested_area",
    header: "Harvested Area",
    cell: ({ row }) => {
      const harvested_area = row.getValue<number>("harvested_area");
      return <div className="text-left">{harvested_area}</div>;
    },
  },
  {
    accessorKey: "fertilizer_type",
    header: "Fertilizer Type",
    cell: ({ row }) => {
      const fertilizer_type = row.getValue<number>("fertilizer_type");
      return <div className="text-left">{fertilizer_type}</div>;
    },
  },
  {
    accessorKey: "fertilizer_amount",
    header: "Fertilizer Amount",
    cell: ({ row }) => {
      const fertilizer_amount = row.getValue<number>("fertilizer_amount");
      return <div className="text-left">{fertilizer_amount}</div>;
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: (props) => <ActionsCell {...props} />,
  },
];
