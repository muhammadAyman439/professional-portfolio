import { useState } from "react";
import { useProfile, useCaseStudies, useInsights } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import type { Profile, CaseStudy, Insight } from "@shared/content";

export default function CMS() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useProfile();
  const { data: caseStudies, isLoading: caseStudiesLoading, refetch: refetchCaseStudies } = useCaseStudies();
  const { data: insights, isLoading: insightsLoading, refetch: refetchInsights } = useInsights();

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const handleLogin = () => {
    if (token.trim()) {
      setIsAuthenticated(true);
      toast.success("Authenticated successfully");
    } else {
      toast.error("Please enter a valid token");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    toast.info("Logged out");
  };

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) return null;
    return response.json();
  };

  // Profile handlers
  const handleSaveProfile = async () => {
    if (!editingProfile) return;
    try {
      await apiCall("/api/content/profile", {
        method: "PUT",
        body: JSON.stringify(editingProfile),
      });
      toast.success("Profile updated successfully");
      refetchProfile();
      setEditingProfile(null);
    } catch (error) {
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Case Study handlers
  const handleCreateCaseStudy = () => {
    setEditingCaseStudy({
      id: "",
      title: "",
      client: "",
      sector: "",
      contractValue: "",
      country: "",
      description: "",
      keyAchievements: [""],
      image: "",
      featured: false,
    });
  };

  const handleSaveCaseStudy = async () => {
    if (!editingCaseStudy) return;
    try {
      // Filter out empty achievements
      const cleanedCaseStudy = {
        ...editingCaseStudy,
        keyAchievements: editingCaseStudy.keyAchievements.filter(a => a.trim() !== "")
      };
      
      if (cleanedCaseStudy.id) {
        await apiCall(`/api/content/case-studies/${cleanedCaseStudy.id}`, {
          method: "PUT",
          body: JSON.stringify(cleanedCaseStudy),
        });
        toast.success("Case study updated");
      } else {
        // Remove empty id field for new case studies
        const { id, ...caseStudyData } = cleanedCaseStudy;
        await apiCall("/api/content/case-studies", {
          method: "POST",
          body: JSON.stringify(caseStudyData),
        });
        toast.success("Case study created");
      }
      refetchCaseStudies();
      setEditingCaseStudy(null);
    } catch (error) {
      toast.error(`Failed to save case study: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteCaseStudy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    try {
      await apiCall(`/api/content/case-studies/${id}`, { method: "DELETE" });
      toast.success("Case study deleted");
      refetchCaseStudies();
    } catch (error) {
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Insight handlers
  const handleCreateInsight = () => {
    setEditingInsight({
      id: "",
      title: "",
      excerpt: "",
      content: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      featured: false,
    });
  };

  const handleSaveInsight = async () => {
    if (!editingInsight) return;
    try {
      if (editingInsight.id) {
        await apiCall(`/api/content/insights/${editingInsight.id}`, {
          method: "PUT",
          body: JSON.stringify(editingInsight),
        });
        toast.success("Insight updated");
      } else {
        // Remove empty id field for new insights
        const { id, ...insightData } = editingInsight;
        await apiCall("/api/content/insights", {
          method: "POST",
          body: JSON.stringify(insightData),
        });
        toast.success("Insight created");
      }
      refetchInsights();
      setEditingInsight(null);
    } catch (error) {
      toast.error(`Failed to save insight: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteInsight = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight?")) return;
    try {
      await apiCall(`/api/content/insights/${id}`, { method: "DELETE" });
      toast.success("Insight deleted");
      refetchInsights();
    } catch (error) {
      toast.error(`Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-3xl font-display font-bold mb-6 text-center">CMS Login</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-semibold mb-2">
                Admin Token
              </label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your CMS_ADMIN_TOKEN"
                className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">Content Management System</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {profileLoading ? (
              <div className="flex justify-center py-12">
                <Spinner className="size-8" />
              </div>
            ) : editingProfile ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="bg-primary">
                      <Save className="size-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProfile(null)}>
                      <X className="size-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={editingProfile.name}
                      onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title</label>
                    <input
                      type="text"
                      value={editingProfile.title}
                      onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Tagline</label>
                    <input
                      type="text"
                      value={editingProfile.tagline}
                      onChange={(e) => setEditingProfile({ ...editingProfile, tagline: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={editingProfile.email}
                      onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingProfile.phone || ""}
                      onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>

                  {/* Profile Image */}
                  <div>
                    <ImageUpload
                      currentImage={editingProfile.profileImage || ""}
                      onImageChange={(url) => setEditingProfile({ ...editingProfile, profileImage: url })}
                      onImageRemove={() => setEditingProfile({ ...editingProfile, profileImage: "" })}
                      token={token}
                      label="Profile Image"
                    />
                  </div>

                  {/* Stats Section */}
                  <div className="pt-6 border-t border-foreground/10">
                    <h3 className="text-lg font-semibold mb-4">Authority Metrics & Numbers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Years of experience</label>
                        <input
                          type="text"
                          value={editingProfile.stats.yearsOfExperience}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            stats: { ...editingProfile.stats, yearsOfExperience: e.target.value }
                          })}
                          placeholder="+6"
                          className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Total Funding Secured</label>
                        <input
                          type="text"
                          value={editingProfile.stats.totalFundingSecured}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            stats: { ...editingProfile.stats, totalFundingSecured: e.target.value }
                          })}
                          placeholder="$M12+"
                          className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Countries</label>
                        <input
                          type="text"
                          value={editingProfile.stats.countries}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            stats: { ...editingProfile.stats, countries: e.target.value }
                          })}
                          placeholder="5+"
                          className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Winning Rate</label>
                        <input
                          type="text"
                          value={editingProfile.stats.winningRate}
                          onChange={(e) => setEditingProfile({ 
                            ...editingProfile, 
                            stats: { ...editingProfile.stats, winningRate: e.target.value }
                          })}
                          placeholder="75%"
                          className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Mission</label>
                    <textarea
                      value={editingProfile.mission}
                      onChange={(e) => setEditingProfile({ ...editingProfile, mission: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Profile</h2>
                  <Button onClick={() => profile && setEditingProfile(profile)}>
                    <Pencil className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                {profile && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground/60">Name</p>
                        <p className="text-lg font-semibold">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Title</p>
                        <p className="text-lg">{profile.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Email</p>
                        <p className="text-lg">{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">Phone</p>
                        <p className="text-lg">{profile.phone}</p>
                      </div>
                    </div>
                    
                    {/* Stats Display */}
                    <div className="pt-4 border-t border-foreground/10">
                      <p className="text-sm font-semibold text-foreground/60 mb-4">Authority Metrics & Numbers</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-foreground/5 rounded-lg">
                          <p className="text-2xl font-bold text-primary mb-1">{profile.stats.yearsOfExperience}</p>
                          <p className="text-xs text-foreground/60">Years of experience</p>
                        </div>
                        <div className="text-center p-4 bg-foreground/5 rounded-lg">
                          <p className="text-2xl font-bold text-primary mb-1">{profile.stats.totalFundingSecured}</p>
                          <p className="text-xs text-foreground/60">Total Funding Secured</p>
                        </div>
                        <div className="text-center p-4 bg-foreground/5 rounded-lg">
                          <p className="text-2xl font-bold text-primary mb-1">{profile.stats.countries}</p>
                          <p className="text-xs text-foreground/60">Countries</p>
                        </div>
                        <div className="text-center p-4 bg-foreground/5 rounded-lg">
                          <p className="text-2xl font-bold text-primary mb-1">{profile.stats.winningRate}</p>
                          <p className="text-xs text-foreground/60">Winning Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          {/* Case Studies Tab */}
          <TabsContent value="case-studies">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Case Studies</h2>
              <Button onClick={handleCreateCaseStudy}>
                <Plus className="size-4 mr-2" />
                New Case Study
              </Button>
            </div>

            {caseStudiesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner className="size-8" />
              </div>
            ) : editingCaseStudy ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{editingCaseStudy.id ? "Edit" : "Create"} Case Study</h3>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveCaseStudy} className="bg-primary">
                      <Save className="size-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCaseStudy(null)}>
                      <X className="size-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={editingCaseStudy.title}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Client *</label>
                    <input
                      type="text"
                      value={editingCaseStudy.client}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, client: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sector *</label>
                    <input
                      type="text"
                      value={editingCaseStudy.sector}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, sector: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Contract Value</label>
                    <input
                      type="text"
                      value={editingCaseStudy.contractValue}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, contractValue: e.target.value })}
                      placeholder="e.g., $500M"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Country</label>
                    <input
                      type="text"
                      value={editingCaseStudy.country}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, country: e.target.value })}
                      placeholder="e.g., USA"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      value={editingCaseStudy.description}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Key Achievements</label>
                    <div className="space-y-2">
                      {editingCaseStudy.keyAchievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...editingCaseStudy.keyAchievements];
                              newAchievements[index] = e.target.value;
                              setEditingCaseStudy({ ...editingCaseStudy, keyAchievements: newAchievements });
                            }}
                            placeholder={`Achievement ${index + 1}`}
                            className="flex-1 px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newAchievements = editingCaseStudy.keyAchievements.filter((_, i) => i !== index);
                              setEditingCaseStudy({ ...editingCaseStudy, keyAchievements: newAchievements });
                            }}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCaseStudy({
                            ...editingCaseStudy,
                            keyAchievements: [...editingCaseStudy.keyAchievements, ""]
                          });
                        }}
                      >
                        <Plus className="size-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>
                  </div>
                  <ImageUpload
                    currentImage={editingCaseStudy.image}
                    onImageChange={(url) => setEditingCaseStudy({ ...editingCaseStudy, image: url })}
                    onImageRemove={() => setEditingCaseStudy({ ...editingCaseStudy, image: "" })}
                    token={token}
                    label="Case Study Image"
                  />
                  <div>
                    <label className="block text-sm font-semibold mb-2">Or enter image URL manually</label>
                    <input
                      type="url"
                      value={editingCaseStudy.image}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured-cs"
                      checked={editingCaseStudy.featured}
                      onChange={(e) => setEditingCaseStudy({ ...editingCaseStudy, featured: e.target.checked })}
                      className="size-4"
                    />
                    <label htmlFor="featured-cs" className="text-sm font-semibold">
                      Featured (show on home page)
                    </label>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {caseStudies?.map((study) => (
                  <Card key={study.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{study.title}</h3>
                          {study.featured && (
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-foreground/70 mb-2">{study.client}</p>
                        <p className="text-sm text-foreground/60">
                          {study.sector} • {study.contractValue}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingCaseStudy(study)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteCaseStudy(study.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Insights</h2>
              <Button onClick={handleCreateInsight}>
                <Plus className="size-4 mr-2" />
                New Insight
              </Button>
            </div>

            {insightsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner className="size-8" />
              </div>
            ) : editingInsight ? (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{editingInsight.id ? "Edit" : "Create"} Insight</h3>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveInsight} className="bg-primary">
                      <Save className="size-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingInsight(null)}>
                      <X className="size-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={editingInsight.title}
                      onChange={(e) => setEditingInsight({ ...editingInsight, title: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Excerpt *</label>
                    <textarea
                      value={editingInsight.excerpt}
                      onChange={(e) => setEditingInsight({ ...editingInsight, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Content *</label>
                    <textarea
                      value={editingInsight.content}
                      onChange={(e) => setEditingInsight({ ...editingInsight, content: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <input
                      type="text"
                      value={editingInsight.category}
                      onChange={(e) => setEditingInsight({ ...editingInsight, category: e.target.value })}
                      placeholder="e.g., Proposal Strategy"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={editingInsight.date}
                      onChange={(e) => setEditingInsight({ ...editingInsight, date: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Read Time</label>
                    <input
                      type="text"
                      value={editingInsight.readTime}
                      onChange={(e) => setEditingInsight({ ...editingInsight, readTime: e.target.value })}
                      placeholder="e.g., 5 min read"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured-insight"
                      checked={editingInsight.featured}
                      onChange={(e) => setEditingInsight({ ...editingInsight, featured: e.target.checked })}
                      className="size-4"
                    />
                    <label htmlFor="featured-insight" className="text-sm font-semibold">
                      Featured
                    </label>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {insights?.map((insight) => (
                  <Card key={insight.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{insight.title}</h3>
                          {insight.featured && (
                            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-foreground/70 mb-2">{insight.excerpt}</p>
                        <p className="text-sm text-foreground/60">
                          {insight.category} • {insight.date} • {insight.readTime}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingInsight(insight)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteInsight(insight.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

