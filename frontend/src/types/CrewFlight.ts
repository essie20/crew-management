export interface CrewFlight {
  flightId: number;
  flightNo: string;
  departureTime: string;
  crewMembers: {
    id: number;
    name: string;
    role: string;
  }[];
}
