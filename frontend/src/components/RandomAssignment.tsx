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

  const AssignCrewRandomly = async () => {
    if (crewMembers) {
      const result = categorizeCrew(crewMembers);

      // Randomize crew assignments
      const shuffleIds = (roleIds: number[]) => {
        const shuffled = [...roleIds]; // Copy array to avoid modifying the original
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
        }
        return shuffled;
      };

      for (let i = 0; i < flights.length; i++) {
        const flight = flights[i];

        const randomCaptainIds = shuffleIds(result.captainIds);
        const randomOfficerIds = shuffleIds(result.firstOfficerIds);
        const randomAttendantsIds = shuffleIds(result.flightAttendantIds);

        let existingCrew = categorizeCrew(flight.crewMembers);

        if (existingCrew.captainIds.length < 1)
          await assignCrewMember(randomCaptainIds[0], flight.flightId);

        if (existingCrew.firstOfficerIds.length < 1) {
          console.log(flight);
          await assignCrewMember(randomOfficerIds[0], flight.flightId);
        }

        if (existingCrew.flightAttendantIds.length < 3) {
          let numberOfMissingAttendants =
            3 - existingCrew.flightAttendantIds.length;
          for (let j = 0; j < numberOfMissingAttendants; j++) {
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
