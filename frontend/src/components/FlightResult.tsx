import { CrewFlight } from "../types/CrewFlight.ts";
import { CrewMember } from "../types/CrewMember.ts";
import { format } from "date-fns";
import { DeleteButton } from "./DeleteButton.tsx";
import { deleteFlight, unassignCrewMember } from "../services/api.ts";
import { Plane, Pencil } from "lucide-react";
import { DragEndEvent } from "@dnd-kit/core";
import RandomAssignment from "../components/RandomAssignment.tsx";

function FlightResult({
  flights,
  hideDelete,
  fetchAllData,
  openModal,
  hideAddButton,
  draggedItem,
  handleDragEnd,
  crewMembers,
  setFlightId,
  setEditedFlightNum,
  setEditedFlightTime,
  setIsEditMode,
}: {
  flights: CrewFlight[];
  hideDelete: boolean;
  fetchAllData?: () => void;
  openModal?: () => void;
  hideAddButton: Boolean;
  draggedItem?: CrewMember;
  handleDragEnd?: ({}: DragEndEvent) => void;
  crewMembers?: CrewMember[];
  setFlightId?: (flightId: number) => void;
  setEditedFlightNum?: (flightNum: string) => void;
  setEditedFlightTime?: (flightTime: string) => void;
  setIsEditMode?: (isEdit: boolean) => void;
}) {
  async function handleDeleteFlight(flightId: number) {
    await deleteFlight(flightId);
    if (fetchAllData) fetchAllData();
  }

  async function handleDeleteCrewMember(
    crewMemberId: number,
    flightId: number
  ) {
    await unassignCrewMember(crewMemberId, flightId);
    if (fetchAllData) fetchAllData();
  }

  return (
    <div>
      <div className="m-2">
        {!hideAddButton && (
          <div className="flex w-full justify-end pr-4">
            <div className="mx-6">
              <RandomAssignment
                flights={flights}
                fetchData={fetchAllData}
                crewMembers={crewMembers}
              />
            </div>
            <button
              onClick={openModal}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plane className="h-4 w-4 mr-1" />
              Add Flight
            </button>
          </div>
        )}
        <ul>
          {flights.map((flight: CrewFlight) => (
            <li
              key={flight.flightId}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedItem && handleDragEnd) {
                  handleDragEnd({
                    active: { id: draggedItem.id },
                    over: { id: flight.flightId },
                  } as DragEndEvent);
                }
              }}
              className="px-4 py-4 sm:px-6 m-4 shadow-lg border border-slate-200 rounded bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex item-center">
                    <h4 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
                      Flight {flight.flightNo}
                    </h4>
                    <div className="flex justify-end w-full">
                      <button
                        onClick={() => {
                          if (
                            setIsEditMode &&
                            openModal &&
                            setFlightId &&
                            setEditedFlightNum &&
                            setEditedFlightTime
                          ) {
                            setIsEditMode(true);
                            openModal();
                            setFlightId(flight.flightId);
                            setEditedFlightNum(flight.flightNo);
                            setEditedFlightTime(flight.departureTime);
                          }
                        }}
                      >
                        <Pencil className="mr-2 text-gray-600 hover:text-blue-600 flex item-center" />
                      </button>

                      {!hideDelete && (
                        <DeleteButton
                          onDeleteClick={() =>
                            handleDeleteFlight(flight.flightId)
                          }
                        />
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-lg">
                    <span className="font-semibold">Departure </span>
                    <span className="text-blue-500 text-base">
                      {format(new Date(flight.departureTime), "PPpp")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Crew Members
                </h5>
                <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {flight.crewMembers.map((crewMember: CrewMember) => (
                    <li
                      key={crewMember.id}
                      className="flex items-center space-x-3 text-sm w-full justify-between rounded-full bg-slate-200 p-3"
                    >
                      <div className="space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800 border border-blue-300">
                          {crewMember.role}
                        </span>
                        <span className="text-slate-900">
                          {crewMember.name}
                        </span>
                      </div>
                      <div className="ml-2">
                        {!hideDelete && (
                          <DeleteButton
                            onDeleteClick={() =>
                              handleDeleteCrewMember(
                                crewMember.id,
                                flight.flightId
                              )
                            }
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default FlightResult;
