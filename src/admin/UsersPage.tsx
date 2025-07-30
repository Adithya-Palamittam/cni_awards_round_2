import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type UserRecord = {
  uid: string;
  email: string;
  is_completed: boolean;
};

export default function UserTable() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmUid, setConfirmUid] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("users_table")
      .select("uid, email, is_completed")
      .neq("email", "admin@3cctech.com");
    if (!error && data) setUsers(data);
  };

  const resetUser = async (uid: string) => {
    // Reset user table
    const { error: updateError } = await supabase
      .from("users_table")
      .update({
        is_completed: false,
        agreed_terms: false,
        last_visited_page: "/terms",
      })
      .eq("uid", uid);

    if (updateError) {
      console.error("Failed to update user table:", updateError.message);
      toast({ title: "Failed to update user info", variant: "destructive" });
      return;
    }

    // Delete from ratings_table
    await supabase.from("ratings_table").delete().eq("user_id", uid);

    // Delete from user_selection_table
    await supabase.from("user_selection_table").delete().eq("user_id", uid);

    // Refresh local UI
    setUsers(prev =>
      prev.map(user => (user.uid === uid ? { ...user, is_completed: false } : user))
    );

    toast({ title: "User reset successfully." });
    setConfirmUid(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Completed</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.uid} className="border-t">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.is_completed ? "✅" : "⏳"}</td>
              <td className="p-2">
                {user.is_completed && (
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmUid(user.uid)}
                    size="sm"
                  >
                    Reset
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Show message when no results found */}
      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-4 text-gray-500">
          No users found matching "{searchTerm}"
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmUid && (
        <Dialog open={true} onOpenChange={(open) => !open && setConfirmUid(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p>This will permanently delete the user's ratings and selections. This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setConfirmUid(null)} variant="ghost">
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => resetUser(confirmUid)}>
                Confirm Reset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
