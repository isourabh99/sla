import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const ReplyModal = ({
  isOpen,
  onClose,
  onSubmit,
  replyText,
  onReplyTextChange,
  selectedQuery,
  loading,
  error,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-gray-400" size={24} />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {selectedQuery.name}
              </h2>
              <p className="text-xs text-gray-500">{selectedQuery.contact}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-start gap-3">
            <FaUserCircle className="text-gray-300" size={32} />
            <div className="bg-blue-500 text-white p-3 rounded-lg rounded-tl-none max-w-xs">
              <p className="text-sm font-semibold mb-1">
                {selectedQuery.subject}
              </p>
              <p className="text-sm">{selectedQuery.description}</p>
            </div>
          </div>
        </div>

        {/* Reply Box */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
          <div className="flex items-center gap-3">
            <textarea
              className="w-full bg-gray-100 border-transparent rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              rows={2}
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              disabled={loading}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSubmit}
              disabled={loading || replyText.trim() === ""}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                <FiSend size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
