import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export default function useUser(uid) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUser({ id: doc.id, ...doc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [uid]);

  return { user, loading };
}
