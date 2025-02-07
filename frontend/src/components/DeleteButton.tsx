import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const DeleteButton = ({
  onDeleteClick,
}: {
  onDeleteClick: () => void;
}) => {
  return (
    <div>
      <button
        onClick={() => {
          onDeleteClick();
          toast.error("Removed successfully!");
        }}
        className="text-gray-600 hover:text-red-600 flex item-center"
      >
        <Trash2 className="h-6 w-6 mr-1" />
      </button>
    </div>
  );
};
