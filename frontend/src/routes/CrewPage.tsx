import { useState } from "react";
import { SearchFlightsByName, CrewFlight } from "../services/api";
import Flight from "../components/Flight";
import { Search } from "lucide-react";

function CrewPage() {
  const [crewName, setCrewName] = useState("");
  const [flights, setFlights] = useState<CrewFlight[]>([]);

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form className="max-w-lg">
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Your name"
              value={crewName}
              onChange={(event) => setCrewName(event.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={async () => {
                const flightsByName = await SearchFlightsByName(crewName);
                setFlights(flightsByName);
              }}
              className="absolute inset-y-0 right-0 px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        <Flight flights={flights} />
      </div>
    </>
  );
}

export default CrewPage;
