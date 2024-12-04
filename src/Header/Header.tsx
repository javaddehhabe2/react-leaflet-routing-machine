import * as React from "react";
import { CiSearch } from "react-icons/ci";
import { LuDatabaseBackup, LuFileX } from "react-icons/lu";
import { RiSettings5Line } from "react-icons/ri";
import { MdDateRange } from "react-icons/md";
export default function Header() {
  return (
    <header className="w-[75%] top-0 left-0 absolute ">
      <div className="bg-white border-gray-200 px-1 py-2.5 ">
        <div className="flex flex-wrap justify-between items-center mx-auto ">
          <span className="flex flex-row">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-5 sm:h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              درنا
            </span>
          </span>
          <div className="flex items-center lg:order-2">
            <div className="w-[8vw] mx-1">
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <CiSearch />
                </div>
                <input
                  type="search"
                  className="block w-full p-[0.25rem] ps-10 text-xs text-gray-700 border border-gray-300 rounded-lg bg-gray-200"
                  required
                />
              </div>
            </div>
            <div className="w-[8vw]  mx-1">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xxs px-4 py-[0.5rem]"
              >
                ذخیره همه مسیرها
              </button>
            </div>
            <div className="w-[8vw]  mx-1">
              <div className="relative max-w-sm">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <MdDateRange />
                </div>
                <input
                  type="text"
                  className=" border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-[0.25rem] "
                  placeholder="1403/09/12"
                />
              </div>
            </div>
            <div className="inline-block mr-1">
              <LuDatabaseBackup size={15} />
            </div>
            <div className="border-r inline-block  pr-1 mr-1 border-gray-500">
              <LuFileX size={15} />
            </div>
            <div className="border-r inline-block  pr-1 mr-1 border-gray-500">
              <RiSettings5Line size={15} />
            </div>
            <div className="w-[8vw] mx-1">
              <select
                id="small"
                className="block w-full p-[0.25rem]  text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  "
                defaultValue="1"
              >
                <option value="1">محمد شهریاری</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
