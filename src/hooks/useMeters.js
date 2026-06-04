import { useEffect, useState } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { realtimeDb } from "../config/firebase";

// Test data fallback
const testMeters = [
  {
    id: "1",
    Meter_ID: "#M-101",
    Apartment: "Apt 101",
    Status: "normal",
    Flow_Rate: [8.5, 9.2, 7.8, 10.1, 8.9, 11.3, 9.5, 10.8, 8.2, 9.6],
    Pressure: "40.7",
    Total_Units: 1250,
    Valve_Status: "open"
  },
  {
    id: "2",
    Meter_ID: "#M-102",
    Apartment: "Apt 102",
    Status: "normal",
    Flow_Rate: [8.3, 8.8, 9.1, 7.9, 10.2, 9.5, 8.1, 9.8, 10.5, 9.2],
    Pressure: "50.4",
    Total_Units: 1340,
    Valve_Status: "open"
  },
  {
    id: "3",
    Meter_ID: "#M-103",
    Apartment: "Apt 103",
    Status: "normal",
    Flow_Rate: [1.1, 1.3, 1.5, 1.2, 1.4, 1.6, 1.3, 1.1, 1.2, 1.4],
    Pressure: "52.6",
    Total_Units: 980,
    Valve_Status: "open"
  },
  {
    id: "4",
    Meter_ID: "#M-104",
    Apartment: "Apt 104",
    Status: "alert",
    Flow_Rate: [12.5, 13.2, 11.8, 14.1, 12.9, 15.3, 13.5, 14.8, 12.2, 13.6],
    Pressure: "38.2",
    Total_Units: 1580,
    Valve_Status: "open"
  },
  {
    id: "5",
    Meter_ID: "#M-105",
    Apartment: "Apt 105",
    Status: "normal",
    Flow_Rate: [7.5, 8.2, 7.8, 9.1, 7.9, 8.3, 7.5, 8.8, 8.2, 7.6],
    Pressure: "45.9",
    Total_Units: 1120,
    Valve_Status: "open"
  },
  {
    id: "6",
    Meter_ID: "#M-106",
    Apartment: "Apt 106",
    Status: "normal",
    Flow_Rate: [9.5, 10.2, 9.8, 11.1, 9.9, 10.3, 9.5, 10.8, 10.2, 9.6],
    Pressure: "48.3",
    Total_Units: 1420,
    Valve_Status: "open"
  }
];

export default function useMeters() {
  const [meters, setMeters] = useState(testMeters); // Start with test data

  useEffect(() => {
    try {
      // Subscribe to the meter root and handle different nested shapes.
      const path = "/meters/GM-001";
      const r = dbRef(realtimeDb, path);
      const off = onValue(r, (snapshot) => {
        const root = snapshot.val();
        console.log("Realtime snapshot for", path, root);
        if (!root) return;

        // Prefer readings.current, then readings, then root fields
        const data = root.readings?.current ?? root.readings ?? root;

        const mapped = [{
          id: "GM-001",
          Meter_ID: data.serialNumber || root.serialNumber || "GM-001",
          Apartment: "",
          Status: (data.isActive ?? root.isActive) ? "normal" : "alert",
          Flow_Rate: Array.isArray(data.Flow_Rate) ? data.Flow_Rate : (data.Flow_Rate !== undefined ? [Number(data.Flow_Rate) || 0] : []),
          Pressure: data.Pressure ?? root.Pressure ?? 0,
          Total_Units: data.Total_Units ?? root.Total_Units ?? 0,
          Daily_consumption: data.Daily_consumption ?? root.Daily_consumption ?? 0,
          Monthly_Units: data.Monthly_Units ?? root.Monthly_Units ?? 0,
          Last_Updated: data.Last_Updated ?? root.Last_Updated ?? root.Last_Updated ?? "",
          isActive: data.isActive ?? root.isActive ?? true,
          serialNumber: data.serialNumber ?? root.serialNumber ?? "GM-001"
        }];

        console.log("Mapped realtime meter:", mapped[0]);
        setMeters(mapped);
      }, (err) => {
        console.error("Realtime DB error:", err);
      });

      return () => off();
    } catch (error) {
      console.error("Realtime DB connection error:", error);
    }
  }, []);

  return meters;
}
