import { useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, PlusCircle, Check } from "lucide-react";

export function ProfileSelector() {
  const { profiles, activeProfile, setActiveProfile, createProfile } = useProfile();
  const [newProfileName, setNewProfileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    
    try {
      await createProfile(newProfileName.trim());
      setNewProfileName("");
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 items-center">
          <UserCircle className="w-4 h-4" />
          {activeProfile ? activeProfile.displayName : "Select Profile"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select or Create Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {!isCreating ? (
            <>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                {profiles.map((profile) => (
                  <Button
                    key={profile.id}
                    variant={activeProfile?.id === profile.id ? "default" : "outline"}
                    className="justify-between"
                    onClick={() => {
                      setActiveProfile(profile);
                      setIsOpen(false);
                    }}
                  >
                    <span>{profile.displayName}</span>
                    {activeProfile?.id === profile.id && <Check className="w-4 h-4" />}
                  </Button>
                ))}
              </div>
              <Button 
                variant="ghost" 
                className="gap-2 mt-2"
                onClick={() => setIsCreating(true)}
              >
                <PlusCircle className="w-4 h-4" />
                Create New Profile
              </Button>
            </>
          ) : (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Profile Name</Label>
                <Input
                  id="displayName"
                  placeholder="Enter your name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!newProfileName.trim()}>
                  Create Profile
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}