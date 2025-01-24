import axios from "axios";

export interface CrewFlight {
  flightId: number;
  flightNo: string;
  departureTime: string;
  crewMembers: {
    crewMemberId: number;
    crewMemberName: string;
    crewMemberRole: string;
  }[];
}

export async function SearchFlightsByName(name: string): Promise<CrewFlight[]> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/crew-member`,
      {
        params: { name },
      }
    );
    if (response.status === 200) {
      return response.data as CrewFlight[];
    } else {
      console.error(`Failed to fetch flights for crew member ${name}`);
      return [];
    }
  } catch (error) {
    console.error("Error while fetching crew flights:", error);
    throw new Error("Unable to fetch flights for the specified crew member.");
  }
}
