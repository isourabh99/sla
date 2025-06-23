import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

const TermsConditionsSettings = ({ termsContent, handleChange }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showTableInput, setShowTableInput] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg shadow-md",
        },
      }),
      Subscript,
      Superscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing your terms and conditions here...",
      }),
    ],
    content: termsContent || "",
    onUpdate: ({ editor }) => {
      // Create a synthetic event to maintain compatibility with existing handleChange
      const syntheticEvent = {
        target: {
          name: "terms_content",
          value: editor.getHTML(),
        },
      };
      handleChange(syntheticEvent);
    },
  });

  // Update editor content when termsContent prop changes
  useEffect(() => {
    if (editor && termsContent !== editor.getHTML()) {
      editor.commands.setContent(termsContent || "");
    }
  }, [termsContent, editor]);

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .run();
    setShowTableInput(false);
  };

  const addRow = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const addColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const setTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",
    "#dd7e6b",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#a4c2f4",
    "#b4a7d6",
    "#d5a6bd",
  ];

  if (!editor) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-1 bg-[#387DB2] rounded-full"></div>
        <h1 className="text-xs md:text-xl font-semibold text-gray-500">
          Terms and Conditions
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Professional Single-Row Toolbar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Text Style Dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value === "paragraph") {
                  editor.chain().focus().setParagraph().run();
                } else if (e.target.value.startsWith("heading")) {
                  const level = parseInt(e.target.value.replace("heading", ""));
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
              value={
                editor.isActive("paragraph")
                  ? "paragraph"
                  : editor.isActive("heading", { level: 1 })
                  ? "heading1"
                  : editor.isActive("heading", { level: 2 })
                  ? "heading2"
                  : editor.isActive("heading", { level: 3 })
                  ? "heading3"
                  : "paragraph"
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#387DB2] focus:border-transparent"
            >
              <option value="paragraph">Paragraph</option>
              <option value="heading1">Heading 1</option>
              <option value="heading2">Heading 2</option>
              <option value="heading3">Heading 3</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Bold, Italic, Underline */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("bold")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("italic")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("underline")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Text Alignment */}
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Align Left"
            >
              ⬅
            </button>
            <button
              type="button"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Align Center"
            >
              ↔
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Align Right"
            >
              ➡
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Lists */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("bulletList")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Bullet List"
            >
              •
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("orderedList")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Numbered List"
            >
              1.
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("taskList")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Task List"
            >
              ☐
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Advanced Formatting */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("strike")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Strikethrough"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("highlight")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Highlight"
            >
              <span className="bg-yellow-300 px-1 rounded">H</span>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("code")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Inline Code"
            >
              {"</>"}
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("codeBlock")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Code Block"
            >
              {"{ }"}
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300"
                title="Text Color"
              >
                🎨
              </button>
              {showColorPicker && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg p-3 shadow-xl z-10">
                  <div className="grid grid-cols-10 gap-1 w-80">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setTextColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Links and Media */}
            <button
              type="button"
              onClick={addLink}
              className={`p-2 rounded-md transition-all duration-200 ${
                editor.isActive("link")
                  ? "bg-[#387DB2] text-white shadow-md"
                  : "bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              title="Add Link"
            >
              🔗
            </button>
            <button
              type="button"
              onClick={addImage}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              title="Insert Image"
            >
              🖼️
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              title="Upload Image"
            >
              📁
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Table and Special Elements */}
            <button
              type="button"
              onClick={() => setShowTableInput(!showTableInput)}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              title="Insert Table"
            >
              ⊞
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              title="Horizontal Rule"
            >
              ─
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* History */}
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-md transition-all duration-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              ↪
            </button>
          </div>

          {/* Table Management Buttons (when in table) */}
          {editor.isActive("table") && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 mr-2">Table Tools:</span>
              <button
                type="button"
                onClick={addRow}
                className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Add Row"
              >
                + Row
              </button>
              <button
                type="button"
                onClick={deleteRow}
                className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Delete Row"
              >
                - Row
              </button>
              <button
                type="button"
                onClick={addColumn}
                className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                title="Add Column"
              >
                + Col
              </button>
              <button
                type="button"
                onClick={deleteColumn}
                className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Delete Column"
              >
                - Col
              </button>
              <button
                type="button"
                onClick={deleteTable}
                className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                title="Delete Table"
              >
                Delete Table
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Professional Editor Content */}
        <div className="bg-white">
          <EditorContent
            editor={editor}
            className="min-h-[500px] px-6 py-4 focus:outline-none prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-l-4 prose-blockquote:border-[#387DB2] prose-blockquote:pl-4 prose-blockquote:italic prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
          />
        </div>
      </div>

      {/* Table Input Modal */}
      {showTableInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Insert Table
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Rows:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Columns:
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#387DB2] focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={insertTable}
                  className="flex-1 px-4 py-2 bg-[#387DB2] text-white rounded-lg hover:bg-[#2d6a9a] transition-colors duration-200 font-medium"
                >
                  Insert Table
                </button>
                <button
                  type="button"
                  onClick={() => setShowTableInput(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-3 text-center">
        Professional text editor with advanced formatting, tables, images, and
        more. Create rich, well-formatted terms and conditions with ease.
      </p>
    </div>
  );
};

export default TermsConditionsSettings;
