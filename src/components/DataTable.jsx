import React from "react";
import { HiOutlineEmojiSad } from "react-icons/hi";

const DataTable = ({
  title,
  subtitle,
  columns,
  data,
  loading,
  error,
  onRowClick,
  className = "",
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
      {title && (
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
          <h1 className="text-xs md:text-xl font-semibold text-gray-500">
            {title} <span className="">• {subtitle}</span>
          </h1>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
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
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-2 text-center text-xs text-gray-500"
                >
                  No data available
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
