"use client"; // Đảm bảo chạy trên client

import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

interface UserContextType {
    userName: string;
    profileImg: string;
    setUserName: (userName: string) => void;
    setProfileImg: (profileImg: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [userName, setUserName] = useState<string>("");
    const [profileImg, setProfileImg] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
            const session = await getSession();

            if (session?.user) {
                setUserName(session.user.userName || "");
                setProfileImg(session.user.profileImg || "");
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{ userName, profileImg, setUserName, setProfileImg }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
};
