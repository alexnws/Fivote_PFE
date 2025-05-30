import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Type du contexte utilisateur
type UserContextType = {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  userEmail: string | null;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  refreshUser: () => void;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    setUserToken(token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("🎯 Token décodé :", decoded);
        setUserRole(decoded.role || null);
        setUserEmail(decoded.email || null); // ✅ ici
      } catch (err) {
        console.log("❌ Erreur décodage token :", err);
        setUserRole(null);
        setUserEmail(null);
      }
    } else {
      setUserRole(null);
      setUserEmail(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userToken,
        setUserToken,
        userRole,
        setUserRole,
        userEmail,
        setUserEmail,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
