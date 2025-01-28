import axios from "axios";
import { CrewFlight } from "../types/CrewFlight.ts";
import { CrewMember } from "../types/CrewMember.ts";
import { Flight } from "../types/Flight.ts";

export async function searchFlightsByName(name: string): Promise<CrewFlight[]> {
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

export async function getAllCrewMembers(): Promise<CrewMember[]> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/crew-members`
    );
    if (response.status === 200) {
      return response.data as CrewMember[];
    } else {
      console.error(`Failed to fetch crew members`);
      return [];
    }
  } catch (error) {
    console.error("Error while fetching crew members:", error);
    throw new Error("Unable to fetch crew members.");
  }
}

export async function getAllFlights(): Promise<Flight[]> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/flights`
    );
    if (response.status === 200) {
      return response.data as Flight[];
    } else {
      console.error(`Failed to fetch flights`);
      return [];
    }
  } catch (error) {
    console.error("Error while fetching flights:", error);
    throw new Error("Unable to fetch flights.");
  }
}

export async function getAllFlightsWithCrew(): Promise<CrewFlight[]> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/flights-with-crew`
    );
    if (response.status === 200) {
      console.log(response.data);
      return response.data as CrewFlight[];
    } else {
      console.error(`Failed to fetch flights with crew`);
      return [];
    }
  } catch (error) {
    console.error("Error while fetching flights with crew:", error);
    throw new Error("Unable to fetch flights with crew.");
  }
}

export async function createFlight(flightNo: string, departureTime: string) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/flight`,
      {
        flightNo,
        departureTime,
      }
    );
    if (response.status === 201) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to create a flight`);
      throw new Error("Failed to create a flight.");
    }
  } catch (error) {
    console.error("Error while creating a flight:", error);
    throw new Error("Unable to create a flight.");
  }
}

export async function createCrewMember(name: string, role: string) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/crew-member`,
      {
        name,
        role,
      }
    );
    if (response.status === 201) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to create a crew member`);
      throw new Error("Failed to create a crew member.");
    }
  } catch (error) {
    console.error("Error while creating a crew member:", error);
    throw new Error("Unable to create a crew member.");
  }
}

export async function deleteFlight(flightId: number) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/flight`,
      {
        params: {
          flightId,
        },
      }
    );
    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to delete a flight`);
      throw new Error("Failed to delete a flight.");
    }
  } catch (error) {
    console.error("Error while deleting a flight:", error);
    throw new Error("Unable to delete a flight.");
  }
}

export async function deleteCrewMember(crewId: number) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/crew-member`,
      {
        params: {
          crewId,
        },
      }
    );
    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to delete a crew member`);
      throw new Error("Failed to delete a crew member.");
    }
  } catch (error) {
    console.error("Error while deleting a crew member:", error);
    throw new Error("Unable to delete a crew member.");
  }
}

export async function unassignCrewMember(crewId: number, flightId: number) {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/crew-assignment`,
      {
        data: {
          crewId,
          flightId,
        },
      }
    );
    if (response.status === 200) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to unassign a crew member`);
      throw new Error("Failed to unassign a crew member.");
    }
  } catch (error) {
    console.error("Error while unassigning a crew member:", error);
    throw new Error("Unable to unassign a crew member.");
  }
}

export async function assignCrewMember(crewId: number, flightId: number) {
  console.log(crewId, flightId);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/crew-assignment`,
      {
        crewId,
        flightId,
      }
    );
    if (response.status === 201) {
      console.log(response.data.message);
    } else {
      console.error(`Failed to assign a crew member`);
      throw new Error("Failed to assign a crew member.");
    }
  } catch (error) {
    console.error("Error while assigning a crew member:", error);
    throw new Error("Unable to assign a crew member.");
  }
}
