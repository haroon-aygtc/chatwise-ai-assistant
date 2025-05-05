import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusIconProps {
  status: string;
}

const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status?.toLowerCase()) {
    case "active":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "inactive":
      return <XCircle className="h-4 w-4 text-gray-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

export default StatusIcon;
