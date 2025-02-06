import { createFlight } from "../services/api";
import { useState } from "react";

export const FlightForm = ({
  closeFlightModal,
  fetchData,
}: {
  closeFlightModal: () => void;
  fetchData: () => void;
}) => {
  const [flightNumber, setFlightNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  return (
    <div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await createFlight(flightNumber, departureTime);
          closeFlightModal();
          fetchData();

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
            onClick={() => {
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
    </div>
  );
};
