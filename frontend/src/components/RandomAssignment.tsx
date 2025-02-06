import { CrewFlight } from "../types/CrewFlight.ts";
import { CrewMember } from "../types/CrewMember.ts";
import { assignCrewMember } from "../services/api";
import { Shuffle } from "lucide-react";

function RandomAssignment({
  flights,
  crewMembers,
  fetchData,
}: {
  flights: CrewFlight[];
  crewMembers?: CrewMember[];
  fetchData?: () => void;
}) {
  const categorizeCrew = (crewMembers: CrewMember[]) => {
    return crewMembers.reduce(
      (
        acc: {
          captainIds: number[];
          firstOfficerIds: number[];
          flightAttendantIds: number[];
        },
        current: CrewMember
      ) => {
        if (current.role === "Captain") {
          acc.captainIds.push(current.id);
        } else if (current.role === "First Officer") {
          acc.firstOfficerIds.push(current.id);
        } else if (current.role === "Flight Attendant") {
          acc.flightAttendantIds.push(current.id);
        }
        return acc;
      },
      { captainIds: [], firstOfficerIds: [], flightAttendantIds: [] }
    );
  };

  const shuffleIds = (roleIds: number[]) => {
    const shuffled = [...roleIds]; // Copy array to avoid modifying the original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  const AssignCrewRandomly = async () => {
    if (crewMembers) {
      const result = categorizeCrew(crewMembers);

      for (let i = 0; i < flights.length; i++) {
        const flight = flights[i];

        let assignedCrew = categorizeCrew(flight.crewMembers);

        const randomCaptainIds = shuffleIds(result.captainIds).filter(
          (id) => !assignedCrew.captainIds.includes(id)
        );

        const randomOfficerIds = shuffleIds(result.firstOfficerIds).filter(
          (id) => !assignedCrew.firstOfficerIds.includes(id)
        );

        const randomAttendantsIds = shuffleIds(
          result.flightAttendantIds
        ).filter((id) => !assignedCrew.flightAttendantIds.includes(id));

        if (assignedCrew.captainIds.length < 1 && randomCaptainIds.length > 0)
          await assignCrewMember(randomCaptainIds[0], flight.flightId);

        if (
          assignedCrew.firstOfficerIds.length < 1 &&
          randomOfficerIds.length > 0
        ) {
          await assignCrewMember(randomOfficerIds[0], flight.flightId);
        }

        if (
          assignedCrew.flightAttendantIds.length < 3 &&
          randomAttendantsIds.length > 0
        ) {
          let maxAssignedCrew = 3;

          let crewToAssign = Math.min(
            randomAttendantsIds.length,
            maxAssignedCrew - assignedCrew.flightAttendantIds.length
          );

          for (let j = 0; j < crewToAssign; j++) {
            await assignCrewMember(randomAttendantsIds[j], flight.flightId); // Assign attendants in batches of 3
          }
        }
      }
      if (fetchData) fetchData();
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          AssignCrewRandomly();
        }}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700"
      >
        <Shuffle className="h-4 w-4 mr-1" />
        Assign Crew Randomly
      </button>
    </div>
  );
}

export default RandomAssignment;
