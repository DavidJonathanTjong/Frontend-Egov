import { DataTable } from "./data-table";
import { DataPopulasiBanjarbaru, columns } from "./columns";
import Cookies from "js-cookie";
import Image from "next/image";

const CropsListPage = () => {
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Daftar Crops</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <span>
            <b>Add or Update Crops</b>
          </span>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image
                src="/images/plus-icon.png"
                alt=""
                width={30}
                height={30}
              />
            </button>
          </div>
        </div>
      </div>
      <DataTable columns={columns} />
    </div>
  );
};

export default CropsListPage;
