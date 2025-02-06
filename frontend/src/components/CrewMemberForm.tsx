import { createCrewMember } from "../services/api";
import { useState } from "react";
import DropdownInput from "../components/DropdownInput";

export const CrewMemberForm = ({
  closeCrewModal,
  fetchData,
}: {
  closeCrewModal: () => void;
  fetchData: () => void;
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Captain");
  const roles = ["Captain", "First Officer", "Flight Attendant"];

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await createCrewMember(name, role);
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
