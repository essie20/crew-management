import { createClient } from "@libsql/client";
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

app.get("/crew-members", async (req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM crew_members");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Crew members not found.` });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the database." });
  }
});

app.get("/crew-member", async (req, res) => {
  const { name } = req.query;

  try {
    const crewMemberResult = await turso.execute(
      "SELECT * FROM crew_members WHERE name = ?",
      [name]
    );
    if (crewMemberResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Crew member with name "${name}" not found.` });
    }
    const foundCrewMemberId = crewMemberResult.rows[0].id;

    const flightsWithCrewResult = await turso.execute(
      `SELECT 
          flights.id AS flight_id,
          flights.flight_number,
          flights.departure_time,
          crew_members.id AS crew_member_id,
          crew_members.name AS crew_member_name,
          crew_members.role AS crew_member_role
        FROM flights
        JOIN flight_crew ON flights.id = flight_crew.flight_id
        JOIN crew_members ON crew_members.id = flight_crew.crew_member_id
        WHERE flight_crew.crew_member_id = ?`,
      [foundCrewMemberId]
    );

    const transformedData = flightsWithCrewResult.rows.reduce(
      (acc, current) => {
        let flight = acc.find(
          (flight) => flight.flightId === current.flight_id
        );
        if (!flight) {
          flight = {
            flightId: current.flight_id,
            flightNo: current.flight_number,
            departureTime: current.departure_time,
            crewMembers: [],
          };
          acc.push(flight);
        }

        flight.crewMembers.push({
          id: current.crew_member_id,
          name: current.crew_member_name,
          role: current.crew_member_role,
        });

        return acc;
      },
      []
    );

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the database." });
  }
});

app.get("/flights-with-crew", async (req, res) => {
  try {
    const flightsWithCrewResult = await turso.execute(
      `SELECT 
          flights.id AS flight_id,
          flights.flight_number,
          flights.departure_time,
          crew_members.id AS crew_member_id,
          crew_members.name AS crew_member_name,
          crew_members.role AS crew_member_role
        FROM flights
        LEFT JOIN flight_crew ON flights.id = flight_crew.flight_id
        LEFT JOIN crew_members ON crew_members.id = flight_crew.crew_member_id
      `
    );
    console.log(flightsWithCrewResult);
    const transformedData = flightsWithCrewResult.rows.reduce(
      (acc, current) => {
        let flight = acc.find(
          (flight) => flight.flightId === current.flight_id
        );
        if (!flight) {
          flight = {
            flightId: current.flight_id,
            flightNo: current.flight_number,
            departureTime: current.departure_time,
            crewMembers: [],
          };
          acc.push(flight);
        }
        if (current.crew_member_id) {
          flight.crewMembers.push({
            id: current.crew_member_id,
            name: current.crew_member_name,
            role: current.crew_member_role,
          });
        }
        return acc;
      },
      []
    );

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the database." });
  }
});

app.get("/flights", async (req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM flights");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: `Flights not found.` });
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data from the database." });
  }
});

app.post("/crew-member", async (req, res) => {
  const { name, role } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: "Name and role are required." });
  }

  try {
    const result = await turso.execute(
      `INSERT INTO crew_members (name, role)
        VALUES (?, ?)`,
      [name, role]
    );
    res.status(201).json({
      message: "Crew member added successfully!",
      member: { id: parseInt(result.lastInsertRowid), name, role },
    });
  } catch (error) {
    console.error("Error inserting crew member:", error);
    res
      .status(500)
      .json({ error: "Failed to add crew member to the database." });
  }
});

app.post("/flight", async (req, res) => {
  const { flightNo, departureTime } = req.body;
  if (!flightNo || !departureTime) {
    return res
      .status(400)
      .json({ error: "Flight number and departure time are required." });
  }
  try {
    const result = await turso.execute(
      `INSERT INTO flights (flight_number, departure_time)
        VALUES (?, ?)`,
      [flightNo, departureTime]
    );

    res.status(201).json({
      message: "Flight added successfully!",
      flight: { id: parseInt(result.lastInsertRowid), flightNo, departureTime },
    });
  } catch (error) {
    console.error("Error inserting flight:", error);
    res.status(500).json({ error: "Failed to add flight to the database." });
  }
});

app.put("/flight", async (req, res) => {
  const { flightId } = req.query;
  const { flightNo, departureTime } = req.body;

  try {
    const flightResult = await turso.execute(
      "SELECT * FROM flights WHERE id = ?",
      [flightId]
    );
    if (flightResult.rows.length === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }

    await turso.execute(
      "UPDATE flights SET flight_number = ?, departure_time = ? WHERE id = ?",
      [flightNo, departureTime, flightId]
    );

    res.status(200).json({ message: "Flight updated successfully." });
  } catch (error) {
    console.error("Error updating flight:", error);
    res.status(500).json({ error: "Failed to update flight." });
  }
});

app.put("/crew-member", async (req, res) => {
  const { crewId } = req.query;
  const { name, role } = req.body;

  try {
    const crewResult = await turso.execute(
      "SELECT * FROM crew_members WHERE id = ?",
      [crewId]
    );
    if (crewResult.rows.length === 0) {
      return res.status(404).json({ error: "Crew member not found." });
    }

    await turso.execute(
      "UPDATE crew_members SET name = ?, role = ? WHERE id = ?",
      [name, role, crewId]
    );

    res.status(200).json({ message: "Crew member updated successfully." });
  } catch (error) {
    console.error("Error updating crew member:", error);
    res.status(500).json({ error: "Failed to update crew member." });
  }
});

app.delete("/flight", async (req, res) => {
  const { flightId } = req.query;

  try {
    const flightResult = await turso.execute(
      "SELECT * FROM flights WHERE id = ?",
      [flightId]
    );
    if (flightResult.rows.length === 0) {
      return res.status(404).json({ error: "Flight not found." });
    }

    await turso.execute("DELETE FROM flights WHERE id = ?", [flightId]);

    res.status(200).json({ message: "Flight removed successfully." });
  } catch (error) {
    console.error("Error removing flight:", error);
    res.status(500).json({ error: "Failed to remove flight." });
  }
});

app.delete("/crew-member", async (req, res) => {
  const { crewId } = req.query;

  try {
    const crewResult = await turso.execute(
      "SELECT * FROM crew_members WHERE id = ?",
      [crewId]
    );
    if (crewResult.rows.length === 0) {
      return res.status(404).json({ error: "Crew member not found." });
    }

    await turso.execute("DELETE FROM crew_members WHERE id = ?", [crewId]);

    res.status(200).json({ message: "Crew member removed successfully." });
  } catch (error) {
    console.error("Error removing crew member:", error);
    res.status(500).json({ error: "Failed to remove crew member." });
  }
});

app.post("/crew-assignment", async (req, res) => {
  const { crewId, flightId } = req.body;
  if (!crewId || !flightId) {
    return res
      .status(400)
      .json({ error: "Crew id and flight id are required." });
  }

  try {
    const result = await turso.execute(
      `INSERT INTO flight_crew (flight_id, crew_member_id)
        VALUES (?, ?)`,
      [flightId, crewId]
    );

    res.status(201).json({
      message: "Crew member assigned successfully!",
    });
  } catch (error) {
    console.error("Error assigning crew member:", error);
    res
      .status(500)
      .json({ error: "Failed to assign crew member to the database." });
  }
});

app.delete("/crew-assignment", async (req, res) => {
  const { crewId, flightId } = req.body;
  if (!crewId || !flightId) {
    return res
      .status(400)
      .json({ error: "Crew id and flight id are required." });
  }

  try {
    await turso.execute(
      "DELETE FROM flight_crew WHERE flight_id = ? AND crew_member_id = ?",
      [flightId, crewId]
    );

    res.status(200).json({ message: "Crew member unassigned successfully." });
  } catch (error) {
    console.error("Error unassigning crew member:", error);
    res.status(500).json({ error: "Failed to unassign crew member." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
