import { useState, useEffect, useCallback } from "react";

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/profile");
            if (!response.ok) throw new Error("Failed to fetch profile");
            const data = await response.json();
            setProfile(data);
        } catch (err: any) {
            setProfile(null);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
};

export default useProfile;
