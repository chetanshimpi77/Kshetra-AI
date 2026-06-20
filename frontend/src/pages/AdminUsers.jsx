import { useEffect, useState } from "react";
import { Users, Trash2, Search, ShieldCheck, Sprout } from "lucide-react";
import { Card, CardBody, Badge } from "../components/Card";
import { getAllUsers, saveUsers } from "../lib/auth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => { setUsers(getAllUsers()); }, []);

  const remove = (id) => {
    const next = users.filter(u => u.id !== id);
    setUsers(next); saveUsers(next);
  };
  const setRole = (id, role) => {
    const next = users.map(u => u.id === id ? { ...u, role } : u);
    setUsers(next); saveUsers(next);
  };

  const filtered = users.filter(u => (u.name + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> User Management</h2>
        <p className="text-sm text-muted-foreground">View, manage and update roles for all users</p>
      </div>

      <Card>
        <CardBody className="pt-5 space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2">Name</th><th>Email</th><th>Phone</th><th>Role</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="text-muted-foreground">{u.email}</td>
                    <td className="text-muted-foreground">{u.phone || "—"}</td>
                    <td>
                      <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)}
                        className="px-2 py-1 border border-border rounded bg-background text-xs">
                        <option value="farmer">farmer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="text-right">
                      <button onClick={() => remove(u.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
