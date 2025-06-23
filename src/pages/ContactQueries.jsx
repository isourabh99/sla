import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getContactQueries,
  replyToContactQuery,
} from "../services/contactQueriesController";
import Loader from "../components/Loader";
import ErrorDisplay from "../components/ErrorDisplay";
import DataTable from "../components/DataTable";
import { toast } from "sonner";
import ReplyModal from "../components/ReplyModal";

const ContactQueries = () => {
  const { token } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyLoading, setReplyLoading] = useState(null);
  const [replyError, setReplyError] = useState({});
  const [replyText, setReplyText] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await getContactQueries(token);
        setQueries(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchQueries();
    }
  }, [token]);

  const handleReplyClick = (query) => {
    setSelectedQuery(query);
    setReplyText("");
    setReplyError({});
  };

  const handleSendReply = async () => {
    if (!selectedQuery || replyText.trim() === "") return;

    setReplyLoading(selectedQuery.id);
    setReplyError({});
    try {
      await replyToContactQuery(token, selectedQuery.id, replyText);
      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id ? { ...q, admin_reply: replyText } : q
        )
      );
      toast.success("Reply sent successfully!");
      setSelectedQuery(null);
      setReplyText("");
    } catch (err) {
      setReplyError({ [selectedQuery.id]: err.message });
      toast.error(err.message || "Failed to send reply.");
    } finally {
      setReplyLoading(null);
    }
  };

  if (error && !queries.length) {
    return <ErrorDisplay message={error} />;
  }

  const columns = [
    {
      key: "sno",
      label: "S.No.",
      render: (row, index) => <span>{index + 1}</span>,
    },
    {
      key: "name",
      label: "From",
      render: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.contact}</div>
        </div>
      ),
    },
    { key: "subject", label: "Subject" },
    {
      key: "created_at",
      label: "Date",
      render: (row) => (
        <span>{new Date(row.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.admin_reply
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.admin_reply ? "Replied" : "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) =>
        !row.admin_reply && (
          <button
            onClick={() => handleReplyClick(row)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-1 rounded"
          >
            Reply
          </button>
        ),
    },
  ];

  return (
    <>
      <DataTable
        title="Contact Queries"
        subtitle="List of user queries"
        columns={columns}
        data={queries}
        loading={loading}
        error={error}
      />
      <ReplyModal
        isOpen={!!selectedQuery}
        onClose={() => setSelectedQuery(null)}
        onSubmit={handleSendReply}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        selectedQuery={selectedQuery}
        loading={replyLoading === (selectedQuery && selectedQuery.id)}
        error={replyError[selectedQuery && selectedQuery.id]}
      />
    </>
  );
};

export default ContactQueries;
