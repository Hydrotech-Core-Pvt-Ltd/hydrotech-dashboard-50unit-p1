import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function ValveToggle({ meter }) {
  const toggle = async () => {
    try {
      await updateDoc(doc(db, "units", meter.id), {
        valve_status: meter.Valve_Status === "open" ? "closed" : "open",
      });
      console.log(`Valve toggled for ${meter.id}`);
    } catch (error) {
      console.error("Error toggling valve:", error);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`w-10 h-5 rounded-full p-1 transition ${
        meter.Valve_Status === "open"
          ? "bg-cyan-400"
          : "bg-red-500"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition-transform ${
          meter.Valve_Status === "open"
            ? "translate-x-5"
            : "translate-x-0"
        }`}
      />
    </button>
  );
}
