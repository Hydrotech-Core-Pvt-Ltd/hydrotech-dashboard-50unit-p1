import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

// Test data fallback
const testMeters = [
  {
    id: "1",
    Meter_ID: "#M-101",
    Apartment: "Apt Apt 101",
    Status: "normal",
    Flow_Rate: [8.5, 9.2, 7.8, 10.1, 8.9, 11.3, 9.5, 10.8, 8.2, 9.6],
    Pressure: "40.7",
    Total_Units: 1250,
    Valve_Status: "open"
  },
  {
    id: "2",
    Meter_ID: "#M-102",
    Apartment: "Apt Apt 102",
    Status: "normal",
    Flow_Rate: [8.3, 8.8, 9.1, 7.9, 10.2, 9.5, 8.1, 9.8, 10.5, 9.2],
    Pressure: "50.4",
    Total_Units: 1340,
    Valve_Status: "open"
  },
  {
    id: "3",
    Meter_ID: "#M-103",
    Apartment: "Apt Apt 103",
    Status: "normal",
    Flow_Rate: [1.1, 1.3, 1.5, 1.2, 1.4, 1.6, 1.3, 1.1, 1.2, 1.4],
    Pressure: "52.6",
    Total_Units: 980,
    Valve_Status: "open"
  },
  {
    id: "4",
    Meter_ID: "#M-104",
    Apartment: "Apt Apt 104",
    Status: "alert",
    Flow_Rate: [12.5, 13.2, 11.8, 14.1, 12.9, 15.3, 13.5, 14.8, 12.2, 13.6],
    Pressure: "38.2",
    Total_Units: 1580,
    Valve_Status: "open"
  },
  {
    id: "5",
    Meter_ID: "#M-105",
    Apartment: "Apt Apt 105",
    Status: "normal",
    Flow_Rate: [7.5, 8.2, 7.8, 9.1, 7.9, 8.3, 7.5, 8.8, 8.2, 7.6],
    Pressure: "45.9",
    Total_Units: 1120,
    Valve_Status: "open"
  },
  {
    id: "6",
    Meter_ID: "#M-106",
    Apartment: "Apt Apt 106",
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
      const unsubscribe = onSnapshot(
        collection(db, "units"), 
        snap => {
          const firebaseMeters = snap.docs.map(doc => {
            const data = doc.data();
            // Map Firebase fields to component fields
            return {
              id: doc.id,
              Meter_ID: data.unit_number || doc.id,
              Apartment: `Apt ${data.unit_number || doc.id}`,
              Status: data.status || "normal",
              Flow_Rate: data.Flow_Rate || data.flow_rate || [8.5, 9.2, 7.8, 10.1, 8.9, 11.3, 9.5, 10.8, 8.2, 9.6],
              Pressure: data.Pressure || data.pressure || "45.0",
              Total_Units: data.current_usage || data.Total_Units || 0,
              Valve_Status: data.valve_status || data.Valve_Status || "closed",
              Last_Updated: data.last_update?.toDate?.()?.toLocaleString() || "N/A"
            };
          });
          console.log("Firebase meters loaded:", firebaseMeters);
          // Only replace test data if we got real data
          if (firebaseMeters.length > 0) {
            setMeters(firebaseMeters);
          }
        },
        error => {
          console.error("Firebase error:", error);
          console.log("Using test data fallback");
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Firebase connection error:", error);
      console.log("Using test data fallback");
    }
  }, []);

  return meters;
}
