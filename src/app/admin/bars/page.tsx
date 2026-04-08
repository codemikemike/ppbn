"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminBarsPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Riverside");
  const [category, setCategory] = useState("HostessBar");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("18:00 - 02:00");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/bars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, address, area, category, phone, openingHours, latitude: parseFloat(latitude) || null, longitude: parseFloat(longitude) || null, isFeatured }),
      });
      if (res.ok) {
        setMessage("Bar created!");
        setShowForm(false);
        setName(""); setDescription(""); setAddress(""); setPhone("");
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
        <h1 className="text-2xl font-bold text-white">Manage Bars</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#cc0000] hover:bg-[#ff0000] text-white">
          {showForm ? "Cancel" : "Add New Bar"}
        </Button>
      </div>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      {showForm && (
        <Card className="glass-card mb-6 border-[#2a2a2a]">
          <CardHeader><h2 className="text-lg font-semibold text-white">Create New Bar</h2></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label className="text-gray-300">Bar Name *</Label><Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              <div><Label className="text-gray-300">Description</Label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2" /></div>
              <div><Label className="text-gray-300">Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-300">Area</Label><select value={area} onChange={e => setArea(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2">{["Riverside","BKK1","Street136","Street104"].map(a => <option key={a}>{a}</option>)}</select></div>
                <div><Label className="text-gray-300">Category</Label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2">{["HostessBar","Pub","Club","RooftopBar","CocktailBar","SportsBar","KaraokeBar","LiveMusic"].map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-300">Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-[#111] border-[#2a2a2a] text-white" /></div>
                <div><Label className="text-gray-300">Opening Hours</Label><Input value={openingHours} onChange={e => setOpeningHours(e.target.value)} className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-300">Latitude</Label><Input value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="11.5564" className="bg-[#111] border-[#2a2a2a] text-white" /></div>
                <div><Label className="text-gray-300">Longitude</Label><Input value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="104.9282" className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} /><Label htmlFor="featured" className="text-gray-300">Featured bar</Label></div>
              <Button type="submit" className="bg-[#cc0000] hover:bg-[#ff0000] text-white w-full">Create Bar</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <p className="text-gray-400 text-sm"><Link href="/bars" className="text-[#cc0000] hover:underline">View bars →</Link></p>
    </div>
  );
}
