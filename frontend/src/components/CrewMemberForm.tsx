import { createCrewMember, updateCrewMember } from "../services/api";
import { useState, useEffect } from "react";
import DropdownInput from "../components/DropdownInput";
import toast from "react-hot-toast";

export const CrewMemberForm = ({
  closeCrewModal,
  fetchData,
  cmId,
  editedCmName,
  editedCmRole,
  isEditMode,
}: {
  closeCrewModal: () => void;
  fetchData: () => void;
  cmId: number;
  editedCmName: string;
  editedCmRole: string;
  isEditMode: boolean;
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Captain");
  const roles = ["Captain", "First Officer", "Flight Attendant"];

  useEffect(() => {
    if (isEditMode) {
      setName(editedCmName);
      setRole(editedCmRole);
    } else {
      setName("");
      setRole("Captain");
    }
  }, [isEditMode, editedCmName, editedCmRole]);

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (isEditMode) {
            await updateCrewMember(cmId, name, role);
            toast.success("Updated successfully!");
          } else {
            await createCrewMember(name, role);
            toast.success("Added successfully!");
          }
          closeCrewModal();
          fetchData();
        }}
        className="mb-6 space-y-4"
      >
        <div>
          <label
            htmlFor="crewMemberName"
            className="block text-sm font-medium text-gray-700"
          >
            Crew member name
          </label>
          <input
            type="text"
            name="crewMemberName"
            id="crewMemberName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="crewMemberRole"
            className="block text-sm font-medium text-gray-700"
          >
            Crew member role
          </label>
          <DropdownInput options={roles} setRole={setRole} />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={async () => {
              closeCrewModal();
              setName("");
              setRole("");
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
