interface Props {
  status: "Pending" | "Approved" | "Rejected" | string;
}

export const LeaveStatusBadge = ({ status }: Props) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  const currentStyle = styles[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${currentStyle}`}>
      {status}
    </span>
  );
};