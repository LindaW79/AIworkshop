import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";

// Types
export type Profile = {
  id: number;
  displayName: string;
  createdAt: string;
};

type ProfileContextType = {
  profiles: Profile[];
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  createProfile: (displayName: string) => Promise<Profile>;
  isLoading: boolean;
  resetProfile: () => Promise<void>;
  toggleCardCompletion: (cardId: number) => Promise<void>;
  isCardCompleted: (cardId: number) => boolean;
  completedCardIds: number[];
};

// Create context
const ProfileContext = createContext<ProfileContextType | null>(null);

// Provider component
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [completedCardIds, setCompletedCardIds] = useState<number[]>([]);

  // Fetch all profiles
  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Create profile mutation
  const createProfileMutation = useMutation({
    mutationFn: async (displayName: string) => {
      const res = await apiRequest("POST", "/api/profiles", { displayName });
      return await res.json() as Profile;
    },
    onSuccess: (newProfile) => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      setActiveProfile(newProfile);
      toast({
        title: "Profile Created",
        description: `Profile "${newProfile.displayName}" has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset profile completions mutation
  const resetProfileMutation = useMutation({
    mutationFn: async () => {
      if (!activeProfile) return;
      await apiRequest("POST", `/api/profiles/${activeProfile.id}/reset`);
      return true;
    },
    onSuccess: () => {
      setCompletedCardIds([]);
      toast({
        title: "Profile Reset",
        description: "All completions have been reset.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Reset Profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle card completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: async (cardId: number) => {
      if (!activeProfile) return false;
      const res = await apiRequest("POST", "/api/completions/toggle", {
        profileId: activeProfile.id,
        cardId,
      });
      return await res.json();
    },
    onSuccess: (data, cardId) => {
      if (data.isCompleted) {
        setCompletedCardIds(prev => [...prev, cardId]);
      } else {
        setCompletedCardIds(prev => prev.filter(id => id !== cardId));
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Completion",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch completions when active profile changes
  useEffect(() => {
    async function fetchCompletions() {
      if (!activeProfile) {
        setCompletedCardIds([]);
        return;
      }

      try {
        const res = await apiRequest("GET", `/api/profiles/${activeProfile.id}/completions`);
        const completions = await res.json();
        setCompletedCardIds(completions.map((c: { cardId: number }) => c.cardId));
      } catch (error) {
        console.error("Failed to fetch completions:", error);
        setCompletedCardIds([]);
      }
    }

    fetchCompletions();
  }, [activeProfile]);

  // Load active profile from localStorage on mount
  useEffect(() => {
    const savedProfileId = localStorage.getItem("activeProfileId");
    if (savedProfileId && profiles && profiles.length > 0) {
      const profile = profiles.find((p: Profile) => p.id === parseInt(savedProfileId));
      if (profile) {
        setActiveProfile(profile);
      }
    }
  }, [profiles]);

  // Save active profile to localStorage when it changes
  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem("activeProfileId", activeProfile.id.toString());
    } else {
      localStorage.removeItem("activeProfileId");
    }
  }, [activeProfile]);

  const handleSetActiveProfile = (profile: Profile) => {
    setActiveProfile(profile);
  };

  const createProfile = async (displayName: string): Promise<Profile> => {
    return await createProfileMutation.mutateAsync(displayName);
  };

  const resetProfile = async (): Promise<void> => {
    await resetProfileMutation.mutateAsync();
  };

  const toggleCardCompletion = async (cardId: number): Promise<void> => {
    await toggleCompletionMutation.mutateAsync(cardId);
  };

  const isCardCompleted = (cardId: number): boolean => {
    return completedCardIds.includes(cardId);
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles: profiles as Profile[],
        activeProfile,
        setActiveProfile: handleSetActiveProfile,
        createProfile,
        isLoading,
        resetProfile,
        toggleCardCompletion,
        isCardCompleted,
        completedCardIds,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// Hook to use the profile context
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}