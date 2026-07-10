import { useEffect, useState } from "react";
import { ref as dbRef, onValue } from "firebase/database";
import { realtimeDb } from "../config/firebase";

export default function useMeters() {
  const [meters, setMeters] = useState([]);

  useEffect(() => {
    try {
      // Subscribe to the /Meters collection and map each child meter.
      const path = "/Meters";
      const r = dbRef(realtimeDb, path);
      const off = onValue(r, (snapshot) => {
        const root = snapshot.val();
        console.log("Realtime snapshot for", path, root);
        if (!root) {
          setMeters([]);
          return;
        }

        const mapped = Object.keys(root).map((key) => {
          const meterRoot = root[key] ?? {};
          const data = meterRoot.latest ?? meterRoot.history?.latest ?? meterRoot;

          // Normalize history: RTDB may store history as an object keyed by id
          let historySource = meterRoot.history ?? data.history ?? [];
          let historyArr = [];
          if (Array.isArray(historySource)) {
            historyArr = historySource;
          } else if (historySource && typeof historySource === 'object') {
            historyArr = Object.keys(historySource).map((k) => ({ ...(historySource[k] ?? {}), _key: k }));
            // Try to sort by Timestamp or key
            historyArr.sort((a, b) => {
              const ta = Number(a.Timestamp ?? a.timestamp ?? a._key) || 0;
              const tb = Number(b.Timestamp ?? b.timestamp ?? b._key) || 0;
              return ta - tb;
            });
          }

          const flowSeries = historyArr.length
            ? historyArr.map((item) => Number(item?.Flow_Rate ?? item?.flow_rate ?? item?.value)).filter((v) => Number.isFinite(v))
            : Array.isArray(data.Flow_Rate)
              ? data.Flow_Rate.map((value) => Number(value)).filter((value) => Number.isFinite(value))
              : (data.Flow_Rate !== undefined ? [Number(data.Flow_Rate) || 0] : []);

          return {
            id: key,
            Meter_ID: meterRoot.serialNumber || data.serialNumber || key,
            Apartment: "",
            Status: (data.isActive ?? meterRoot.isActive ?? true) ? "normal" : "alert",
            Flow_Rate: flowSeries,
            Pressure: data.Pressure ?? meterRoot.Pressure ?? 0,
            Daily_Liters: data.Daily_Liters ?? meterRoot.Daily_Liters ?? 0,
            Total_M3: data.Total_M3 ?? meterRoot.Total_M3 ?? 0,
            Timestamp: data.Timestamp ?? meterRoot.Timestamp ?? "",
            history: historyArr,
            isActive: data.isActive ?? meterRoot.isActive ?? true,
            serialNumber: data.serialNumber ?? meterRoot.serialNumber ?? key
          };
        });

        console.log("Mapped realtime meters:", mapped);
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
