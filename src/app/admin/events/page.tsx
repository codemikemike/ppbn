"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateEventFormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  barId: string;
  imageUrl: string;
  loading: boolean;
  error: string | null;
  success: string | null;
};

const initialEventFormState: CreateEventFormState = {
  title: "",
  description: "",
  date: "",
  time: "",
  type: "DJNight",
  barId: "",
  imageUrl: "",
  loading: false,
  error: null,
  success: null,
};

const EVENT_TYPES = [
  "DJNight",
  "LadiesNight",
  "LiveMusic",
  "HappyHour",
  "ThemeNight",
  "SpecialEvent",
];

function CreateEventForm() {
  const [form, setForm] = useState<CreateEventFormState>(initialEventFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, error: null, success: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, loading: true, error: null, success: null }));
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date,
          time: form.time,
          type: form.type,
          barId: form.barId.trim() || undefined,
          imageUrl: form.imageUrl.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create event");
      }
      setForm({ ...initialEventFormState, success: "Event created successfully!" });
    } catch (err: any) {
      setForm((prev) => ({ ...prev, loading: false, error: err.message || "Unknown error" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card glow-red border-none rounded-[1.75rem] p-6 space-y-5 max-w-2xl mx-auto mt-8">
      <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white mb-2">Create Event</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" value={form.title} onChange={handleChange} required maxLength={128} autoFocus />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength={10}
            className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
            placeholder="Describe the event..."
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" value={form.date} onChange={handleChange} type="date" required />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" value={form.time} onChange={handleChange} type="time" required />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="barId">Bar ID</Label>
          <Input id="barId" name="barId" value={form.barId} onChange={handleChange} maxLength={64} placeholder="(Optional)" />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} maxLength={256} placeholder="https://... (optional)" type="url" />
        </div>
      </div>
      {form.error && <div className="text-red-500 text-sm font-medium">{form.error}</div>}
      {form.success && <div className="text-green-400 text-sm font-medium">{form.success}</div>}
      <Button type="submit" disabled={form.loading} className="w-full mt-2">
        {form.loading ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
}

export default function AdminEventsPage() {
  // TODO: Fetch and list events for moderation below
  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Moderation</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Events
        </h1>
        <p className="text-sm text-muted-foreground">
          Create, approve, and delete events.
        </p>
      </header>
      <CreateEventForm />
      {/* TODO: List events for moderation below */}
    </main>
  );
}
