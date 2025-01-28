import { CrewMember } from "../types/CrewMember.ts";
import { DeleteButton } from "./DeleteButton.tsx";
import { deleteCrewMember } from "../services/api.ts";
import { User } from "lucide-react";

function CrewMemberList({
  crewMembers,
  hideDelete,
  fetchAllData,
  openModal,
  onDragStart,
  onDragEnd,
}: {
  crewMembers: CrewMember[];
  hideDelete: boolean;
  fetchAllData: () => void;
  openModal: () => void;
  onDragStart: (cm: CrewMember) => void;
  onDragEnd: (cm?: CrewMember) => void;
}) {
  async function handleDeleteCrewMember(id: number) {
    await deleteCrewMember(id);
    fetchAllData();
  }
  return (
    <div>
      <ul>
        {crewMembers.map((crewMember: CrewMember) => (
          <li
            key={crewMember.id}
            draggable
            onDragStart={() => onDragStart(crewMember)}
            onDragEnd={() => onDragEnd()}
            className="flex items-center space-x-3 text-sm w-full justify-between rounded-full bg-white p-3 m-3 cursor-move" //cursor-move added
          >
            <span>
              <span className="inline-flex items-center text-center px-2.5 py-0.5 rounded-full text-xs font-sm capitalize bg-blue-100 text-blue-800 border border-blue-300">
                {crewMember.role}
              </span>
              <span className="text-slate-900 ml-3">{crewMember.name} </span>
            </span>

            <div className="ml-2">
              {!hideDelete && (
                <DeleteButton
                  onDeleteClick={() => handleDeleteCrewMember(crewMember.id)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex w-full justify-end">
        <button
          onClick={openModal}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 "
        >
          <User className="h-4 w-4 mr-1" />
          Add crew member
        </button>
      </div>
    </div>
  );
}

export default CrewMemberList;
