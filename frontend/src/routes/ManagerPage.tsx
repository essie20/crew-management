import { useEffect, useState } from "react";
import { Modal } from "../components/Modal.tsx";
import FlightResult from "../components/FlightResult.tsx";
import {
  createFlight,
  getAllFlightsWithCrew,
  getAllCrewMembers,
  createCrewMember,
} from "../services/api";
import { CrewFlight } from "../types/CrewFlight.ts";
import CrewMemberList from "../components/CrewMemberList.tsx";
import { CrewMember } from "../types/CrewMember.ts";

function ManagerPage() {
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const openFlightModal = () => setIsFlightModalOpen(true);
  const closeFlightModal = () => setIsFlightModalOpen(false);
  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const openCrewModal = () => setIsCrewModalOpen(true);
  const closeCrewModal = () => setIsCrewModalOpen(false);
  const [flights, setFlights] = useState<CrewFlight[]>([]);
  const [flightNumber, setFlightNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);

  async function fetchData() {
    setFlights(await getAllFlightsWithCrew());
    setCrewMembers(await getAllCrewMembers());
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Modal isOpen={isFlightModalOpen}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await createFlight(flightNumber, departureTime);
              //massage is shown that it is created to users
            }}
            className="mb-6 space-y-4"
          >
            <div>
              <label
                htmlFor="flightNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Flight Number
              </label>
              <input
                type="text"
                name="flightNumber"
                id="flightNumber"
                value={flightNumber}
                onChange={(event) => setFlightNumber(event.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="departureTime"
                className="block text-sm font-medium text-gray-700"
              >
                Departure Time
              </label>
              <input
                type="datetime-local"
                name="departureTime"
                id="departureTime"
                value={departureTime}
                onChange={(event) => setDepartureTime(event.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={async () => {
                  fetchData();
                  closeFlightModal();
                  setFlightNumber("");
                  setDepartureTime("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </Modal>
        <Modal isOpen={isCrewModalOpen}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await createCrewMember(name, role);
              //massage is shown that it is created to users
            }}
            className="mb-6 space-y-4"
          >
            <div>
              <label
                htmlFor="crewMemberName"
                className="block text-sm font-medium text-gray-700"
              >
                Crew member name
              </label>
              <input
                type="text"
                name="crewMemberName"
                id="crewMemberName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="crewMemberRole"
                className="block text-sm font-medium text-gray-700"
              >
                Crew member role
              </label>
              <input
                type="text"
                name="crewMemberRole"
                id="crewMemberRole"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
                className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={async () => {
                  fetchData();
                  closeCrewModal();
                  setName("");
                  setRole("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        </Modal>

        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <FlightResult
              flights={flights}
              hideDelete={false}
              fetchAllData={fetchData}
              openModal={openFlightModal}
              hideAddButton={false}
            />
          </div>
          <div className="m-10">
            <CrewMemberList
              crewMembers={crewMembers}
              hideDelete={false}
              fetchAllData={fetchData}
              openModal={openCrewModal}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagerPage;
