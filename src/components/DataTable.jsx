import React, { useState } from "react";
import { HiOutlineEmojiSad } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import Loader from "./Loader";

const DataTable = ({
  title,
  subtitle,
  columns,
  data,
  loading,
  error,
  onRowClick,
  className = "",
  searchable = true,
  searchPlaceholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const searchInObj = (item, term) => {
    const lowercasedTerm = term.toLowerCase();
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (typeof value === "object" && value !== null) {
          if (searchInObj(value, term)) {
            return true;
          }
        } else if (String(value).toLowerCase().includes(lowercasedTerm)) {
          return true;
        }
      }
    }
    return false;
  };

  const filteredData =
    searchable && searchTerm
      ? data.filter((item) => searchInObj(item, searchTerm))
      : data;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <HiOutlineEmojiSad className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Data Available
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {error || "There seems to be no data to display at the moment."}
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
        {title && (
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
            <h1 className="text-xs md:text-xl font-semibold text-gray-500">
              {title} <span className="">• {subtitle}</span>
            </h1>
          </div>
        )}
        {searchable && (
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tighter text-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row, index) => (
              <tr
                key={row._id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={`${row._id}-${column.key}`}
                    className="px-6 py-2 whitespace-nowrap text-xs text-gray-900"
                  >
                    {column.render
                      ? column.render(row, index)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-2 text-center text-xs text-gray-500"
                >
                  {searchTerm ? "No results found" : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
