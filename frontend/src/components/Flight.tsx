import { CrewFlight } from "../services/api";
import { format } from "date-fns";

function Flight({ flights }: { flights: CrewFlight[] }) {
  return (
    <>
      <div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {(flights ?? []).map((flight) => (
              <li key={flight.flightId} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Flight {flight.flightNo}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Departure:{" "}
                      {format(new Date(flight.departureTime), "PPpp")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Crew Members:
                  </h5>
                  <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {flight.crewMembers.map((crewMember) => (
                      <li
                        key={crewMember.crewMemberId}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                          {crewMember.crewMemberRole.replace("_", " ")}
                        </span>
                        <span className="text-gray-900">
                          {crewMember.crewMemberName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Flight;
