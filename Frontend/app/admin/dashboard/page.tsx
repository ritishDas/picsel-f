"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, GraduationCap, LogOut, Plus, Trash2, Edit2, X, ClipboardList, Download, Search, ImageIcon } from "lucide-react";
import { API } from "@/config/api";

type Tab = "events" | "team" | "faculty" | "registrations";

interface Event {
  id?: number; title: string; date: string; time: string; location: string;
  description: string; eventType: string; registerUrl: string; token: string;
  coverImage: string; gallery?: string[];
}

interface TeamMember {
  id?: number; name: string; role: string; description: string; mobile: string;
  email: string; tokenNo: number; imageUrl: string;
  socials: { linkedin: string; instagram: string; twitter: string };
}

interface Faculty {
  id?: number; name: string; role: string; mobile: string; email: string;
  imageUrl: string; message: string;
}

interface Registration {
  id?: number; name: string; email: string; phone: string; college: string;
  department: string; year: string; eventId: number; eventTitle: string;
}

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [regFilterEvent, setRegFilterEvent] = useState<string>("all");
  const [regSearch, setRegSearch] = useState("");
  const [showImageEdit, setShowImageEdit] = useState(false);
  const [imageEditItem, setImageEditItem] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("admin_auth") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "";
      if (activeTab === "events") url = API.EVENTS;
      else if (activeTab === "team") url = API.TEAM;
      else if (activeTab === "faculty") url = API.FACULTY;
      else if (activeTab === "registrations") url = API.REGISTRATIONS;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (activeTab === "events") setEvents(data);
        else if (activeTab === "team") setTeam(data);
        else if (activeTab === "faculty") setFaculty(data);
        else if (activeTab === "registrations") setRegistrations(data);
      }
    } catch (err) { console.error("Failed to fetch:", err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const url = activeTab === "events" ? API.EVENTS : activeTab === "team" ? API.TEAM : API.FACULTY;
    try { await fetch(`${url}/${id}`, { method: "DELETE" }); fetchData(); }
    catch (err) { console.error("Delete failed:", err); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  const tabs = [
    { key: "events" as Tab, label: "Events", icon: CalendarDays, count: events.length },
    { key: "team" as Tab, label: "Team", icon: Users, count: team.length },
    { key: "faculty" as Tab, label: "Faculty", icon: GraduationCap, count: faculty.length },
    { key: "registrations" as Tab, label: "Registrations", icon: ClipboardList, count: registrations.length },
  ];

  const uniqueEventTitles = [...new Set(registrations.map(r => r.eventTitle))];
  const filteredRegistrations = registrations.filter(r => {
    const matchesEvent = regFilterEvent === "all" || r.eventTitle === regFilterEvent;
    const matchesSearch = regSearch === "" ||
      r.name?.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.email?.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.college?.toLowerCase().includes(regSearch.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "College", "Department", "Year", "Event"];
    const rows = filteredRegistrations.map(r => [r.name, r.email, r.phone, r.college, r.department, r.year, r.eventTitle]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `registrations${regFilterEvent !== "all" ? `-${regFilterEvent}` : ""}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage PICSEL Club content</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-accent-red hover:border-accent-red transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setShowForm(false); setEditItem(null); }}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"
              }`}>
              <tab.icon size={16} /> {tab.label}
              <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Registrations Tab */}
        {activeTab === "registrations" ? (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <select value={regFilterEvent} onChange={(e) => setRegFilterEvent(e.target.value)}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="all">All Events</option>
                  {uniqueEventTitles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="Search name, email, college..." value={regSearch} onChange={(e) => setRegSearch(e.target.value)} />
                </div>
              </div>
              <button onClick={downloadCSV} disabled={filteredRegistrations.length === 0}
                className="flex items-center gap-2 rounded-xl bg-accent-green/15 border border-accent-green/30 px-4 py-2.5 text-sm font-bold text-accent-green transition-all hover:bg-accent-green/25 disabled:opacity-40 whitespace-nowrap">
                <Download size={14} /> Download CSV ({filteredRegistrations.length})
              </button>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {loading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">College</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dept/Year</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((reg, i) => (
                        <tr key={reg.id || i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{reg.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{reg.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">{reg.phone}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">{reg.college}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{reg.department}<br /><span className="text-[10px] text-primary">{reg.year}</span></td>
                          <td className="px-4 py-3"><span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{reg.eventTitle}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredRegistrations.length === 0 && !loading && (
                    <div className="p-8 text-center text-muted-foreground">
                      {registrations.length === 0 ? <>No registrations yet.</> : "No registrations match your filter."}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-heading">
                {activeTab === "events" ? "All Events" : activeTab === "team" ? "Team Members" : "Faculty Members"}
              </h2>
              <button onClick={() => { setShowForm(true); setEditItem(null); }}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:shadow-glow">
                <Plus size={16} /> Add New
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {loading ? <div className="p-8 text-center text-muted-foreground">Loading...</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name/Title</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {activeTab === "events" ? "Date" : "Role"}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {activeTab === "events" ? "Token" : activeTab === "team" ? "Token No" : "Email"}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTab === "events" && events.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{item.title}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.token === "1" ? "border border-accent-green/30 bg-accent-green/10 text-accent-green" : "border border-border bg-muted text-muted-foreground"}`}>
                              {item.token === "1" ? "Active" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Edit"><Edit2 size={14} /></button>
                              <button onClick={() => { setImageEditItem(item); setShowImageEdit(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors" title="Edit Images"><ImageIcon size={14} /></button>
                              <button onClick={() => item.id && handleDelete(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-red hover:bg-accent-red/10 transition-colors" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === "team" && team.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.role}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              item.tokenNo === 1 ? "border border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow" :
                              item.tokenNo === 2 ? "border border-primary/30 bg-primary/10 text-primary" :
                              "border border-border bg-muted text-muted-foreground"
                            }`}>
                              {item.tokenNo === 1 ? "President" : item.tokenNo === 2 ? "Core" : "Member"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Edit2 size={14} /></button>
                              <button onClick={() => { setImageEditItem(item); setShowImageEdit(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors"><ImageIcon size={14} /></button>
                              <button onClick={() => item.id && handleDelete(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-red hover:bg-accent-red/10 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === "faculty" && faculty.map((item) => (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.role}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.email}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Edit2 size={14} /></button>
                              <button onClick={() => { setImageEditItem(item); setShowImageEdit(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors"><ImageIcon size={14} /></button>
                              <button onClick={() => item.id && handleDelete(item.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent-red hover:bg-accent-red/10 transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {((activeTab === "events" && events.length === 0) ||
                    (activeTab === "team" && team.length === 0) ||
                    (activeTab === "faculty" && faculty.length === 0)) && !loading && (
                    <div className="p-8 text-center text-muted-foreground">
                      No data found. Backend: <code className="text-primary">{API.BASE}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-4" onClick={() => setShowForm(false)}>
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-card animate-[scaleIn_0.3s_ease-out] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-foreground">{editItem ? "Edit" : "Add"} {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setShowForm(false)} className="p-1 text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              {activeTab === "events" && <EventForm item={editItem} onSuccess={() => { setShowForm(false); fetchData(); }} />}
              {activeTab === "team" && <TeamForm item={editItem} onSuccess={() => { setShowForm(false); fetchData(); }} />}
              {activeTab === "faculty" && <FacultyForm item={editItem} onSuccess={() => { setShowForm(false); fetchData(); }} />}
            </div>
          </div>
        )}

        {/* Image Edit Modal */}
        {showImageEdit && imageEditItem && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md p-4" onClick={() => setShowImageEdit(false)}>
            <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-card animate-[scaleIn_0.3s_ease-out] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-bold text-foreground">Edit Images</h3>
                <button onClick={() => setShowImageEdit(false)} className="p-1 text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              {activeTab === "events" && <EventImageEdit item={imageEditItem} onSuccess={() => { setShowImageEdit(false); fetchData(); }} />}
              {activeTab === "team" && <MemberImageEdit item={imageEditItem} type="team" onSuccess={() => { setShowImageEdit(false); fetchData(); }} />}
              {activeTab === "faculty" && <MemberImageEdit item={imageEditItem} type="faculty" onSuccess={() => { setShowImageEdit(false); fetchData(); }} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========== EVENT FORM ========== */
const EventForm = ({ item, onSuccess }: { item: any; onSuccess: () => void }) => {
  const [form, setForm] = useState<any>(item || { title: "", date: "", time: "", location: "", description: "", eventType: "Technical", registerUrl: "", token: "1" });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (item?.id) {
        const { coverImage: _, gallery: __, id, ...body } = form;
        await fetch(`${API.EVENTS}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        const fd = new FormData();
        const { coverImage: _, gallery: __, id, ...body } = form;
        fd.append("data", new Blob([JSON.stringify(body)], { type: "application/json" }));
        if (coverImage) fd.append("coverImage", coverImage);
        if (galleryImages) Array.from(galleryImages).forEach(f => fd.append("galleryImages", f));
        await fetch(API.EVENTS, { method: "POST", body: fd });
      }
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <div className="grid grid-cols-2 gap-3">
        <input type="date" className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="time" className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
      </div>
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
      <div className="grid grid-cols-2 gap-3">
        <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
          <option value="Technical">Technical</option><option value="Esports">Esports</option><option value="Sports">Sports</option><option value="Fun">Fun</option>
        </select>
        <select className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })}>
          <option value="1">Token 1 (Active/Upcoming)</option>
          <option value="0">Token 0 (Hidden/Past)</option>
        </select>
      </div>
      <textarea className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Register URL (optional)" value={form.registerUrl} onChange={(e) => setForm({ ...form, registerUrl: e.target.value })} />
      {!item?.id && (
        <>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Gallery Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)} className="text-sm text-muted-foreground" />
          </div>
        </>
      )}
      <button type="submit" disabled={submitting} className="valorant-btn-cyan w-full text-center disabled:opacity-50">
        {submitting ? "Saving..." : item?.id ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
};

/* ========== TEAM FORM ========== */
const TeamForm = ({ item, onSuccess }: { item: any; onSuccess: () => void }) => {
  const [form, setForm] = useState<any>(item || { name: "", role: "", description: "", mobile: "", email: "", tokenNo: 3, socials: { linkedin: "", instagram: "", twitter: "" } });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (item?.id) {
        const { imageUrl, id, ...body } = form;
        await fetch(`${API.TEAM}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        const fd = new FormData();
        const { imageUrl, id, ...body } = form;
        fd.append("data", new Blob([JSON.stringify(body)], { type: "application/json" }));
        if (image) fd.append("image", image);
        await fetch(API.TEAM, { method: "POST", body: fd });
      }
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
      <textarea className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <input className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
        <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" value={form.tokenNo} onChange={(e) => setForm({ ...form, tokenNo: parseInt(e.target.value) })}>
          <option value={1}>1 - President</option>
          <option value={2}>2 - Core Team</option>
          <option value={3}>3 - Member</option>
        </select>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Social Links</p>
        <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="LinkedIn URL" value={form.socials?.linkedin || ""} onChange={(e) => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })} />
        <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Instagram URL" value={form.socials?.instagram || ""} onChange={(e) => setForm({ ...form, socials: { ...form.socials, instagram: e.target.value } })} />
        <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Twitter URL" value={form.socials?.twitter || ""} onChange={(e) => setForm({ ...form, socials: { ...form.socials, twitter: e.target.value } })} />
      </div>
      {!item?.id && (
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Profile Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
        </div>
      )}
      <button type="submit" disabled={submitting} className="valorant-btn-cyan w-full text-center disabled:opacity-50">
        {submitting ? "Saving..." : item?.id ? "Update Member" : "Add Member"}
      </button>
    </form>
  );
};

/* ========== FACULTY FORM ========== */
const FacultyForm = ({ item, onSuccess }: { item: any; onSuccess: () => void }) => {
  const [form, setForm] = useState<any>(item || { name: "", role: "", mobile: "", email: "", message: "" });
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (item?.id) {
        const { imageUrl, id, ...body } = form;
        await fetch(`${API.FACULTY}/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        const fd = new FormData();
        const { imageUrl, id, ...body } = form;
        fd.append("data", new Blob([JSON.stringify(body)], { type: "application/json" }));
        if (image) fd.append("image", image);
        await fetch(API.FACULTY, { method: "POST", body: fd });
      }
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
      <div className="grid grid-cols-2 gap-3">
        <input className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <input className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <textarea className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none resize-none" rows={3} placeholder="Message / Description" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {!item?.id && (
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Profile Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
        </div>
      )}
      <button type="submit" disabled={submitting} className="valorant-btn-cyan w-full text-center disabled:opacity-50">
        {submitting ? "Saving..." : item?.id ? "Update Faculty" : "Add Faculty"}
      </button>
    </form>
  );
};

/* ========== EVENT IMAGE EDIT ========== */
const EventImageEdit = ({ item, onSuccess }: { item: any; onSuccess: () => void }) => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [keptImages, setKeptImages] = useState<string[]>(item.gallery || []);
  const [submitting, setSubmitting] = useState(false);

  const removeGalleryImage = (url: string) => {
    setKeptImages(prev => prev.filter(u => u !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (coverImage) fd.append("coverImage", coverImage);
      if (galleryImages) Array.from(galleryImages).forEach(f => fd.append("galleryImages", f));
      keptImages.forEach(img => fd.append("keptImages", img));
      await fetch(API.EVENTS_IMAGES(item.id), { method: "PUT", body: fd });
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-muted-foreground">Editing images for: <span className="text-primary font-semibold">{item.title}</span></p>

      {/* Current cover */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">Cover Image</label>
        {item.coverImage && (
          <img src={item.coverImage} alt="Cover" className="h-32 w-full object-cover rounded-xl border border-border mb-2" />
        )}
        <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" />
      </div>

      {/* Current gallery */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-2">Gallery Images</label>
        {keptImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {keptImages.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border border-border" />
                <button type="button" onClick={() => removeGalleryImage(url)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent-red text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        )}
        <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)} className="text-sm text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground mt-1">New images will be added alongside kept images.</p>
      </div>

      <button type="submit" disabled={submitting} className="valorant-btn-cyan w-full text-center disabled:opacity-50">
        {submitting ? "Uploading..." : "Update Images"}
      </button>
    </form>
  );
};

/* ========== MEMBER IMAGE EDIT (Team/Faculty) ========== */
const MemberImageEdit = ({ item, type, onSuccess }: { item: any; type: "team" | "faculty"; onSuccess: () => void }) => {
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("imageUrl", image);
      const url = type === "team" ? API.TEAM_IMAGES(item.id) : API.FACULTY_IMAGES(item.id);
      await fetch(url, { method: "PUT", body: fd });
      onSuccess();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-muted-foreground">Editing image for: <span className="text-primary font-semibold">{item.name}</span></p>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.name} className="h-32 w-32 object-cover rounded-xl border border-border mx-auto" />
      )}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">New Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm text-muted-foreground" required />
      </div>
      <button type="submit" disabled={submitting} className="valorant-btn-cyan w-full text-center disabled:opacity-50">
        {submitting ? "Uploading..." : "Update Image"}
      </button>
    </form>
  );
};

export default AdminDashboard;
