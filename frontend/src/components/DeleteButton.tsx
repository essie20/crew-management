import { Trash2 } from "lucide-react";

export const DeleteButton = ({
  onDeleteClick,
}: {
  onDeleteClick: () => void;
}) => {
  return (
    <div className="">
      <button
        onClick={onDeleteClick}
        className="text-gray-600 hover:text-red-600 flex item-center"
      >
        <span className="mt-0.5">Delete</span>
        <Trash2 className="h-6 w-6 mr-1" />
      </button>
    </div>
  );
};
