"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminStaffPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Hostess");
  const [description, setDescription] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, description, isApproved }),
      });
      if (res.ok) {
        setMessage("Staff created!");
        setShowForm(false);
        setName(""); setRole("Hostess"); setDescription("");
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed");
      }
    } catch {
      setMessage("Network error");
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Staff Profiles</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#cc0000] hover:bg-[#ff0000] text-white">
          {showForm ? "Cancel" : "Add Staff"}
        </Button>
      </div>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      {showForm && (
        <Card className="glass-card mb-6 border-[#2a2a2a]">
          <CardHeader><h2 className="text-lg font-semibold text-white">Add Staff Member</h2></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label className="text-gray-300">Name</Label><Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              <div><Label className="text-gray-300">Role</Label><select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2">{["Hostess","Bartender","Manager","DJ","Security"].map(r => <option key={r}>{r}</option>)}</select></div>
              <div><Label className="text-gray-300">Description</Label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="approved" checked={isApproved} onChange={e => setIsApproved(e.target.checked)} /><Label htmlFor="approved" className="text-gray-300">Approve immediately</Label></div>
              <Button type="submit" className="bg-[#cc0000] hover:bg-[#ff0000] text-white w-full">Add Staff</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <p className="text-gray-400 text-sm"><Link href="/staff" className="text-[#cc0000] hover:underline">View staff →</Link></p>
    </div>
  );
}
