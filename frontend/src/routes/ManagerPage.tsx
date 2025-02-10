import { useEffect, useState } from "react";
import {
  getAllFlightsWithCrew,
  getAllCrewMembers,
  assignCrewMember,
} from "../services/api";

import { CrewFlight } from "../types/CrewFlight.ts";
import { CrewMember } from "../types/CrewMember.ts";

import FlightResult from "../components/FlightResult.tsx";
import CrewMemberList from "../components/CrewMemberList.tsx";
import { Modal } from "../components/Modal.tsx";
import { FlightForm } from "../components/FlightForm.tsx";
import { CrewMemberForm } from "../components/CrewMemberForm.tsx";

import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { LoaderCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

function ManagerPage() {
  const [flights, setFlights] = useState<CrewFlight[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);

  const [flightId, setFlightId] = useState<number>(0);
  const [editedFlightNum, setEditedFlightNum] = useState("");
  const [editedFlightTime, setEditedFlightTime] = useState("");

  const [cmId, setCmId] = useState<number>(0);
  const [editedCmName, setEditedCmName] = useState("");
  const [editedCmRole, setEditedCmRole] = useState("");

  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const openFlightModal = () => setIsFlightModalOpen(true);
  const closeFlightModal = () => {
    setIsFlightModalOpen(false);
    setIsEditMode(false);
  };

  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const openCrewModal = () => setIsCrewModalOpen(true);
  const closeCrewModal = () => {
    setIsCrewModalOpen(false);
    setIsEditMode(false);
  };

  const [draggedItem, setDraggedItem] = useState<CrewMember>();

  const [loading, setLoading] = useState(true);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const crewMemberId = active.id as number;
    const targetId = over.id as number;
    const crewMember = crewMembers.find((cm) => cm.id === crewMemberId);

    if (!crewMember) return;

    await assignCrewMember(crewMemberId, targetId);
    fetchData();
    toast.success("Assigned successfully!");
  };

  async function fetchData() {
    setFlights(await getAllFlightsWithCrew());
    setCrewMembers(await getAllCrewMembers());
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
      <Modal isOpen={isFlightModalOpen}>
        <FlightForm
          closeFlightModal={closeFlightModal}
          fetchData={fetchData}
          flightId={flightId}
          editedFlightNum={editedFlightNum}
          editedFlightTime={editedFlightTime}
          isEditMode={isEditMode}
        />
      </Modal>
      <Modal isOpen={isCrewModalOpen}>
        <CrewMemberForm
          closeCrewModal={closeCrewModal}
          fetchData={fetchData}
          cmId={cmId}
          editedCmName={editedCmName}
          editedCmRole={editedCmRole}
          isEditMode={isEditMode}
        />
      </Modal>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex items-center justify-center">
            <LoaderCircle className="animate-spin" />
          </div>
          <p className="text-center mt-4">Loading...</p>
        </div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-4">
            <div className="col-span-3">
              <FlightResult
                flights={flights}
                crewMembers={crewMembers}
                hideDelete={false}
                fetchAllData={fetchData}
                openModal={openFlightModal}
                hideAddButton={false}
                draggedItem={draggedItem}
                handleDragEnd={handleDragEnd}
                setFlightId={setFlightId}
                setEditedFlightNum={setEditedFlightNum}
                setEditedFlightTime={setEditedFlightTime}
                setIsEditMode={setIsEditMode}
              />
            </div>
            <div className="m-10">
              <CrewMemberList
                crewMembers={crewMembers}
                hideDelete={false}
                fetchAllData={fetchData}
                openModal={openCrewModal}
                onDragStart={setDraggedItem}
                onDragEnd={setDraggedItem}
                setCmId={setCmId}
                setEditedCmName={setEditedCmName}
                setEditedCmRole={setEditedCmRole}
                setIsEditMode={setIsEditMode}
              />
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default ManagerPage;
