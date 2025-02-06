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

function ManagerPage() {
  const [flights, setFlights] = useState<CrewFlight[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);

  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const openFlightModal = () => setIsFlightModalOpen(true);
  const closeFlightModal = () => setIsFlightModalOpen(false);
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const openCrewModal = () => setIsCrewModalOpen(true);
  const closeCrewModal = () => setIsCrewModalOpen(false);

  const [draggedItem, setDraggedItem] = useState<CrewMember>();

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const crewMemberId = active.id as number;
    const targetId = over.id as number;
    const crewMember = crewMembers.find((cm) => cm.id === crewMemberId);

    if (!crewMember) return;

    await assignCrewMember(crewMemberId, targetId);
    fetchData();
  };

  async function fetchData() {
    setFlights(await getAllFlightsWithCrew());
    setCrewMembers(await getAllCrewMembers());
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex w-full justify-end"></div>
      <Modal isOpen={isFlightModalOpen}>
        <FlightForm closeFlightModal={closeFlightModal} fetchData={fetchData} />
      </Modal>
      <Modal isOpen={isCrewModalOpen}>
        <CrewMemberForm closeCrewModal={closeCrewModal} fetchData={fetchData} />
      </Modal>

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
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default ManagerPage;
