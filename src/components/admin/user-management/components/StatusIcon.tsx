import { CheckCircle2, XCircle, Clock, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface StatusIconProps {
  status?: string;
  showText?: boolean;
}

const StatusIcon = ({ status, showText = true }: StatusIconProps) => {
  if (!status) {
    return showText ? (
      <div className="flex items-center">
        <HelpCircle className="h-4 w-4 text-gray-400 mr-1" />
        <span className="text-xs">Unknown</span>
      </div>
    ) : (
      <HelpCircle className="h-4 w-4 text-gray-400" />
    );
  }

  let icon, text, color;

  switch (status.toLowerCase()) {
    case "active":
      icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
      text = "Active";
      color = "bg-green-100 text-green-800 border-green-200";
      break;
    case "inactive":
      icon = <XCircle className="h-4 w-4 text-gray-500" />;
      text = "Inactive";
      color = "bg-gray-100 text-gray-800 border-gray-200";
      break;
    case "pending":
      icon = <Clock className="h-4 w-4 text-yellow-500" />;
      text = "Pending";
      color = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    default:
      icon = <HelpCircle className="h-4 w-4 text-gray-400" />;
      text = status.charAt(0).toUpperCase() + status.slice(1);
      color = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        {showText ? (
          <div className="flex items-center">
            {icon}
            <span className={`text-xs ml-1.5 px-1.5 py-0.5 rounded ${color}`}>{text}</span>
          </div>
        ) : (
          icon
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default StatusIcon;
