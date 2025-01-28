import { useState } from "react";
import { CrewFlight } from "../types/CrewFlight.ts";
import { searchFlightsByName } from "../services/api";
import FlightResult from "../components/FlightResult.tsx";

function CrewPage() {
  const [crewMemberName, setCrewMemberName] = useState("");
  const [flights, setFlights] = useState<CrewFlight[]>([]);

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form className="max-w-lg">
          <h1 className="text-4xl font-semibold text-slate-900 mb-8 ml-6">
            Find your flights
          </h1>
          <div className="flex mt-1 rounded-md ml-6">
            <input
              type="text"
              placeholder="Your name"
              value={crewMemberName}
              onChange={(event) => setCrewMemberName(event.target.value)}
              className="shadow px-5 border border-blue-700 rounded cursor-pointer hover:border-[#0c0243]"
            />
            <button
              type="button"
              onClick={async () => {
                const flightsByName = await searchFlightsByName(crewMemberName);
                setFlights(flightsByName);
              }}
              className="rounded border border-blue-600 shadow-md inset-y-0 right-0 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        <FlightResult
          flights={flights}
          hideDelete={true}
          hideAddButton={true}
        />
      </div>
    </>
  );
}

export default CrewPage;
