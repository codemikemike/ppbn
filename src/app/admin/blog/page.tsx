"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminBlogPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Guide");
  const [readTime, setReadTime] = useState("5");
  const [isPublished, setIsPublished] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, category, readTimeMinutes: parseInt(readTime), isPublished }),
      });
      if (res.ok) {
        setMessage("Post created!");
        setShowForm(false);
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
        <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#cc0000] hover:bg-[#ff0000] text-white">
          {showForm ? "Cancel" : "New Post"}
        </Button>
      </div>
      {message && <p className="mb-4 text-green-400">{message}</p>}
      {showForm && (
        <Card className="glass-card mb-6 border-[#2a2a2a]">
          <CardHeader><h2 className="text-lg font-semibold text-white">Create Post</h2></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label className="text-gray-300">Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} required className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              <div><Label className="text-gray-300">Excerpt</Label><Input value={excerpt} onChange={e => setExcerpt(e.target.value)} className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              <div><Label className="text-gray-300">Content</Label><textarea value={content} onChange={e => setContent(e.target.value)} rows={6} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-gray-300">Category</Label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-[#2a2a2a] text-white rounded p-2">{["Guide","Tips","Comparison","Deals","Safety","History"].map(c => <option key={c}>{c}</option>)}</select></div>
                <div><Label className="text-gray-300">Read Time (min)</Label><Input type="number" value={readTime} onChange={e => setReadTime(e.target.value)} className="bg-[#111] border-[#2a2a2a] text-white" /></div>
              </div>
              <div className="flex items-center gap-2"><input type="checkbox" id="pub" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><Label htmlFor="pub" className="text-gray-300">Publish immediately</Label></div>
              <Button type="submit" className="bg-[#cc0000] hover:bg-[#ff0000] text-white w-full">Create Post</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <p className="text-gray-400 text-sm"><Link href="/blog" className="text-[#cc0000] hover:underline">View blog →</Link></p>
    </div>
  );
}
