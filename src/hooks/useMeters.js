import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function useMeters() {
  const [meters, setMeters] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "units"), snap => {
      setMeters(
        snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    });
  }, []);

  return meters;
}
