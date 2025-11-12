"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { toast, Toaster } from "sonner";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import type { CaseStudy, FAQ, Insight, Profile } from "@/types/content";

// CMS and API are in the same Next.js app
const API_URL = "/api";
const CMS_TOKEN_KEY = "cms_admin_token";

class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ error: response.statusText || "Request failed" }));
    throw new ApiError(response.status, message.error ?? "Request failed");
  }

  if (response.status === 204) {
    // @ts-expect-error - callers should expect null for 204 responses
    return null;
  }

  return response.json() as Promise<T>;
}

export default function CMSPage() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);

  const [profileLoading, setProfileLoading] = useState(false);
  const [caseStudiesLoading, setCaseStudiesLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [faqsLoading, setFAQsLoading] = useState(false);

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken("");
    localStorage.removeItem(CMS_TOKEN_KEY);
  };

  const authorizedRequest = async <T,>(endpoint: string, options: RequestInit = {}) => {
    try {
      return await request<T>(endpoint, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        handleLogout();
        toast.error("Session expired or invalid token. Please login again.");
      }
      throw error;
    }
  };

  const verifyToken = async (candidate: string) => {
    setIsAuthenticating(true);
    try {
      await request("/content/verify-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${candidate}`,
        },
      });
      setToken(candidate);
      setIsAuthenticated(true);
      localStorage.setItem(CMS_TOKEN_KEY, candidate);
      toast.success("✓ Authenticated successfully");
      await loadAllContent(candidate);
    } catch (error) {
      console.error("Token verification failed", error);
      localStorage.removeItem(CMS_TOKEN_KEY);
      setToken("");
      setIsAuthenticated(false);
      toast.error("Authentication failed. Please check your token.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem(CMS_TOKEN_KEY);
    if (savedToken) {
      void verifyToken(savedToken);
    }
  }, []);

  const loadAllContent = async (authToken: string = token) => {
    if (!authToken) return;

    await Promise.all([fetchProfile(authToken), fetchCaseStudies(authToken), fetchInsights(authToken), fetchFAQs(authToken)]);
  };

  const fetchProfile = async (authToken: string = token) => {
    setProfileLoading(true);
    try {
      const data = await request<Profile>("/content/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchCaseStudies = async (authToken: string = token) => {
    setCaseStudiesLoading(true);
    try {
      const data = await request<CaseStudy[]>("/content/case-studies", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCaseStudies(data);
    } catch (error) {
      console.error("Failed to fetch case studies", error);
      toast.error("Failed to load case studies");
    } finally {
      setCaseStudiesLoading(false);
    }
  };

  const fetchInsights = async (authToken: string = token) => {
    setInsightsLoading(true);
    try {
      const data = await request<Insight[]>("/content/insights", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setInsights(data);
    } catch (error) {
      console.error("Failed to fetch insights", error);
      toast.error("Failed to load insights");
    } finally {
      setInsightsLoading(false);
    }
  };

  const fetchFAQs = async (authToken: string = token) => {
    setFAQsLoading(true);
    try {
      const data = await request<FAQ[]>("/content/faqs", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setFAQs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
      toast.error("Failed to load FAQs");
    } finally {
      setFAQsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!token.trim()) {
      toast.error("Please enter a token");
      return;
    }

    await verifyToken(token.trim());
  };

  const handleSaveProfile = async () => {
    if (!editingProfile) return;
    try {
      await authorizedRequest("/content/profile", {
        method: "PUT",
        body: JSON.stringify(editingProfile),
      });
      toast.success("Profile updated successfully");
      setEditingProfile(null);
      await fetchProfile();
    } catch (error) {
      toast.error(
        `Failed to update profile: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

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
      order: null,
    });
  };

  const handleSaveCaseStudy = async () => {
    if (!editingCaseStudy) return;

    const cleaned = {
      ...editingCaseStudy,
      keyAchievements: editingCaseStudy.keyAchievements.filter((item) => item.trim() !== ""),
    };

    try {
      if (cleaned.id) {
        await authorizedRequest(`/content/case-studies/${cleaned.id}`, {
          method: "PUT",
          body: JSON.stringify(cleaned),
        });
        toast.success("Case study updated");
      } else {
        const { id, ...payload } = cleaned;
        await authorizedRequest("/content/case-studies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Case study created");
      }

      setEditingCaseStudy(null);
      await fetchCaseStudies();
    } catch (error) {
      toast.error(
        `Failed to save case study: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleDeleteCaseStudy = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this case study?")) return;

    try {
      await authorizedRequest(`/content/case-studies/${id}`, {
        method: "DELETE",
      });
      toast.success("Case study deleted");
      await fetchCaseStudies();
    } catch (error) {
      toast.error(
        `Failed to delete case study: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleMoveCaseStudy = async (id: string, direction: "up" | "down") => {
    if (!caseStudies.length) return;

    const sorted = [...caseStudies].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    );
    const index = sorted.findIndex((item) => item.id === id);
    if (index === -1) return;
    if ((direction === "up" && index === 0) || (direction === "down" && index === sorted.length - 1))
      return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const current = sorted[index];
    const target = sorted[newIndex];

    try {
      await Promise.all([
        authorizedRequest(`/content/case-studies/${current.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...current, order: newIndex }),
        }),
        authorizedRequest(`/content/case-studies/${target.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...target, order: index }),
        }),
      ]);
      toast.success("Case study order updated");
      await fetchCaseStudies();
    } catch (error) {
      toast.error(
        `Failed to reorder case studies: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

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
        await authorizedRequest(`/content/insights/${editingInsight.id}`, {
          method: "PUT",
          body: JSON.stringify(editingInsight),
        });
        toast.success("Insight updated");
      } else {
        const { id, ...payload } = editingInsight;
        await authorizedRequest("/content/insights", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Insight created");
      }

      setEditingInsight(null);
      await fetchInsights();
    } catch (error) {
      toast.error(
        `Failed to save insight: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleDeleteInsight = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this insight?")) return;

    try {
      await authorizedRequest(`/content/insights/${id}`, {
        method: "DELETE",
      });
      toast.success("Insight deleted");
      await fetchInsights();
    } catch (error) {
      toast.error(
        `Failed to delete insight: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleCreateFAQ = () => {
    setEditingFAQ({
      id: "",
      question: "",
      answer: "",
      order: null,
    });
  };

  const handleSaveFAQ = async () => {
    if (!editingFAQ) return;

    try {
      if (editingFAQ.id) {
        await authorizedRequest(`/content/faqs/${editingFAQ.id}`, {
          method: "PUT",
          body: JSON.stringify(editingFAQ),
        });
        toast.success("FAQ updated");
      } else {
        const { id, ...payload } = editingFAQ;
        await authorizedRequest("/content/faqs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("FAQ created");
      }

      setEditingFAQ(null);
      await fetchFAQs();
    } catch (error) {
      toast.error(`Failed to save FAQ: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await authorizedRequest(`/content/faqs/${id}`, {
        method: "DELETE",
      });
      toast.success("FAQ deleted");
      await fetchFAQs();
    } catch (error) {
      toast.error(`Failed to delete FAQ: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleMoveFAQ = async (id: string, direction: "up" | "down") => {
    if (!faqs.length) return;

    const sorted = [...faqs].sort(
      (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
    );
    const index = sorted.findIndex((faq) => faq.id === id);
    if (index === -1) return;
    if ((direction === "up" && index === 0) || (direction === "down" && index === sorted.length - 1))
      return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const current = sorted[index];
    const target = sorted[newIndex];

    try {
      await Promise.all([
        authorizedRequest(`/content/faqs/${current.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...current, order: newIndex }),
        }),
        authorizedRequest(`/content/faqs/${target.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...target, order: index }),
        }),
      ]);
      toast.success("FAQ order updated");
      await fetchFAQs();
    } catch (error) {
      toast.error(
        `Failed to reorder FAQs: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const sortedCaseStudies = useMemo(
    () =>
      [...caseStudies].sort(
        (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
      ),
    [caseStudies],
  );

  const sortedFAQs = useMemo(
    () =>
      [...faqs].sort(
        (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER),
      ),
    [faqs],
  );

  const renderLogin = () => (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">CMS Login</h1>
          {isAuthenticating && localStorage.getItem(CMS_TOKEN_KEY) ? (
            <div className="flex items-center justify-center gap-3 py-8">
              <Spinner className="size-6" />
              <span className="text-foreground/60">Verifying saved token...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-semibold mb-2">
                  Admin Token
                </label>
                <input
                  type="password"
                  id="token"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && !isAuthenticating && void handleLogin()}
                  placeholder="Enter your CMS_ADMIN_TOKEN"
                  disabled={isAuthenticating}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <Button onClick={() => void handleLogin()} disabled={isAuthenticating} className="w-full">
                {isAuthenticating ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4" />
                    Verifying...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );

  if (!isAuthenticated) {
    return renderLogin();
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-background">
        <header className="border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Content Management System</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">{renderProfileTab()}</TabsContent>
            <TabsContent value="case-studies">{renderCaseStudiesTab()}</TabsContent>
            <TabsContent value="insights">{renderInsightsTab()}</TabsContent>
            <TabsContent value="faqs">{renderFAQsTab()}</TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );

  function renderProfileTab() {
    if (profileLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      );
    }

    if (editingProfile) {
      return (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile}>
                <Save className="size-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingProfile(null)}>
                <X className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Name"
              value={editingProfile.name}
              onChange={(value) => setEditingProfile({ ...editingProfile, name: value })}
            />
            <Field
              label="Title"
              value={editingProfile.title}
              onChange={(value) => setEditingProfile({ ...editingProfile, title: value })}
            />
            <Field
              label="Email"
              value={editingProfile.email}
              onChange={(value) => setEditingProfile({ ...editingProfile, email: value })}
            />
            <Field
              label="Phone"
              value={editingProfile.phone}
              onChange={(value) => setEditingProfile({ ...editingProfile, phone: value })}
            />
            <Field
              label="Location"
              value={editingProfile.location}
              onChange={(value) => setEditingProfile({ ...editingProfile, location: value })}
            />
            <Field
              label="Tagline"
              value={editingProfile.tagline}
              onChange={(value) => setEditingProfile({ ...editingProfile, tagline: value })}
            />
          </div>

          <ImageUpload
            currentImage={editingProfile.profileImage ?? ""}
            onImageChange={(url) => setEditingProfile({ ...editingProfile, profileImage: url })}
            onImageRemove={() => setEditingProfile({ ...editingProfile, profileImage: "" })}
            token={token}
            label="Profile Image"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Years of Experience"
              value={editingProfile.stats.yearsOfExperience}
              onChange={(value) =>
                setEditingProfile({
                  ...editingProfile,
                  stats: { ...editingProfile.stats, yearsOfExperience: value },
                })
              }
            />
            <Field
              label="Total Funding Secured"
              value={editingProfile.stats.totalFundingSecured}
              onChange={(value) =>
                setEditingProfile({
                  ...editingProfile,
                  stats: { ...editingProfile.stats, totalFundingSecured: value },
                })
              }
            />
            <Field
              label="Countries"
              value={editingProfile.stats.countries}
              onChange={(value) =>
                setEditingProfile({
                  ...editingProfile,
                  stats: { ...editingProfile.stats, countries: value },
                })
              }
            />
            <Field
              label="Winning Rate"
              value={editingProfile.stats.winningRate}
              onChange={(value) =>
                setEditingProfile({
                  ...editingProfile,
                  stats: { ...editingProfile.stats, winningRate: value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Mission</label>
            <textarea
              value={editingProfile.mission}
              onChange={(event) => setEditingProfile({ ...editingProfile, mission: event.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
            />
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Profile</h2>
          <Button
            onClick={() =>
              profile &&
              setEditingProfile({
                ...profile,
                stats: { ...profile.stats },
              })
            }
          >
            <Pencil className="size-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {profile ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Info label="Name" value={profile.name} />
            <Info label="Title" value={profile.title} />
            <Info label="Email" value={profile.email} />
            <Info label="Phone" value={profile.phone} />

            <div className="md:col-span-2">
              <p className="text-sm font-semibold text-foreground/60 mb-4">
                Authority Metrics & Numbers
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Metric label="Years of experience" value={profile.stats.yearsOfExperience} />
                <Metric label="Total Funding Secured" value={profile.stats.totalFundingSecured} />
                <Metric label="Countries" value={profile.stats.countries} />
                <Metric label="Winning Rate" value={profile.stats.winningRate} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-foreground/60">No profile data available.</p>
        )}
      </Card>
    );
  }

  function renderCaseStudiesTab() {
    if (caseStudiesLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      );
    }

    if (editingCaseStudy) {
      return (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">
              {editingCaseStudy.id ? "Edit" : "Create"} Case Study
            </h3>
            <div className="flex gap-2">
              <Button onClick={handleSaveCaseStudy}>
                <Save className="size-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingCaseStudy(null)}>
                <X className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Title *"
              value={editingCaseStudy.title}
              onChange={(value) => setEditingCaseStudy({ ...editingCaseStudy, title: value })}
              required
            />
            <Field
              label="Client *"
              value={editingCaseStudy.client}
              onChange={(value) => setEditingCaseStudy({ ...editingCaseStudy, client: value })}
              required
            />
            <Field
              label="Sector *"
              value={editingCaseStudy.sector}
              onChange={(value) => setEditingCaseStudy({ ...editingCaseStudy, sector: value })}
              required
            />
            <Field
              label="Contract Value"
              value={editingCaseStudy.contractValue}
              onChange={(value) => setEditingCaseStudy({ ...editingCaseStudy, contractValue: value })}
            />
            <Field
              label="Country"
              value={editingCaseStudy.country}
              onChange={(value) => setEditingCaseStudy({ ...editingCaseStudy, country: value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              value={editingCaseStudy.description}
              onChange={(event) =>
                setEditingCaseStudy({ ...editingCaseStudy, description: event.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold mb-2">Key Achievements</label>
            {editingCaseStudy.keyAchievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={achievement}
                  onChange={(event) => {
                    const items = [...editingCaseStudy.keyAchievements];
                    items[index] = event.target.value;
                    setEditingCaseStudy({ ...editingCaseStudy, keyAchievements: items });
                  }}
                  placeholder={`Achievement ${index + 1}`}
                  className="flex-1 px-4 py-2 bg-background border border-foreground/20 rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      keyAchievements: editingCaseStudy.keyAchievements.filter((_, i) => i !== index),
                    })
                  }
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setEditingCaseStudy({
                  ...editingCaseStudy,
                  keyAchievements: [...editingCaseStudy.keyAchievements, ""],
                })
              }
            >
              <Plus className="size-4 mr-2" />
              Add Achievement
            </Button>
          </div>

          <ImageUpload
            currentImage={editingCaseStudy.image}
            onImageChange={(url) => setEditingCaseStudy({ ...editingCaseStudy, image: url })}
            onImageRemove={() => setEditingCaseStudy({ ...editingCaseStudy, image: "" })}
            token={token}
            label="Case Study Image"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-cs"
              checked={editingCaseStudy.featured}
              onChange={(event) =>
                setEditingCaseStudy({ ...editingCaseStudy, featured: event.target.checked })
              }
              className="size-4"
            />
            <label htmlFor="featured-cs" className="text-sm font-semibold">
              Featured (show on home page)
            </label>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Case Studies</h2>
          <Button onClick={handleCreateCaseStudy}>
            <Plus className="size-4 mr-2" />
            New Case Study
          </Button>
        </div>

        {sortedCaseStudies.length ? (
          sortedCaseStudies.map((study, index) => (
            <Card key={study.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveCaseStudy(study.id, "up")}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveCaseStudy(study.id, "down")}
                    disabled={index === sortedCaseStudies.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{study.title}</h3>
                    {study.featured && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/70">{study.client}</p>
                  <p className="text-sm text-foreground/60">
                    {study.sector} • {study.contractValue}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingCaseStudy(study)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCaseStudy(study.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center text-foreground/60">No case studies yet.</Card>
        )}
      </div>
    );
  }

  function renderInsightsTab() {
    if (insightsLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      );
    }

    if (editingInsight) {
      return (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{editingInsight.id ? "Edit" : "Create"} Insight</h3>
            <div className="flex gap-2">
              <Button onClick={handleSaveInsight}>
                <Save className="size-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingInsight(null)}>
                <X className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <Field
            label="Title *"
            value={editingInsight.title}
            onChange={(value) => setEditingInsight({ ...editingInsight, title: value })}
            required
          />

          <div>
            <label className="block text-sm font-semibold mb-2">Excerpt *</label>
            <textarea
              value={editingInsight.excerpt}
              onChange={(event) => setEditingInsight({ ...editingInsight, excerpt: event.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Content *</label>
            <textarea
              value={editingInsight.content}
              onChange={(event) => setEditingInsight({ ...editingInsight, content: event.target.value })}
              rows={8}
              className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Category *"
              value={editingInsight.category}
              onChange={(value) => setEditingInsight({ ...editingInsight, category: value })}
              required
            />
            <Field
              label="Read Time"
              value={editingInsight.readTime}
              onChange={(value) => setEditingInsight({ ...editingInsight, readTime: value })}
            />
            <Field
              label="Date"
              value={editingInsight.date}
              onChange={(value) => setEditingInsight({ ...editingInsight, date: value })}
              type="date"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-insight"
              checked={editingInsight.featured}
              onChange={(event) => setEditingInsight({ ...editingInsight, featured: event.target.checked })}
              className="size-4"
            />
            <label htmlFor="featured-insight" className="text-sm font-semibold">
              Featured
            </label>
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Insights</h2>
          <Button onClick={handleCreateInsight}>
            <Plus className="size-4 mr-2" />
            New Insight
          </Button>
        </div>

        {insights.length ? (
          insights.map((insight) => (
            <Card key={insight.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{insight.title}</h3>
                    {insight.featured && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-foreground/70">{insight.excerpt}</p>
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
          ))
        ) : (
          <Card className="p-6 text-center text-foreground/60">No insights yet.</Card>
        )}
      </div>
    );
  }

  function renderFAQsTab() {
    if (faqsLoading) {
      return (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      );
    }

    if (editingFAQ) {
      return (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{editingFAQ.id ? "Edit" : "Create"} FAQ</h3>
            <div className="flex gap-2">
              <Button onClick={handleSaveFAQ}>
                <Save className="size-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingFAQ(null)}>
                <X className="size-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <Field
            label="Question *"
            value={editingFAQ.question}
            onChange={(value) => setEditingFAQ({ ...editingFAQ, question: value })}
            required
          />
          <div>
            <label className="block text-sm font-semibold mb-2">Answer *</label>
            <textarea
              value={editingFAQ.answer}
              onChange={(event) => setEditingFAQ({ ...editingFAQ, answer: event.target.value })}
              rows={6}
              className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
            />
          </div>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">FAQs</h2>
          <Button onClick={handleCreateFAQ}>
            <Plus className="size-4 mr-2" />
            New FAQ
          </Button>
        </div>

        {sortedFAQs.length ? (
          sortedFAQs.map((faq, index) => (
            <Card key={faq.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveFAQ(faq.id, "up")}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveFAQ(faq.id, "down")}
                    disabled={index === sortedFAQs.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                  <p className="text-foreground/70 whitespace-pre-line">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingFAQ(faq)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteFAQ(faq.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center text-foreground/60">No FAQs yet.</Card>
        )}
      </div>
    );
  }
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
};

function Field({ label, value, onChange, required, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2 bg-background border border-foreground/20 rounded-lg"
      />
    </div>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div>
      <p className="text-sm text-foreground/60">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="text-center p-4 bg-foreground/5 rounded-lg">
      <p className="text-2xl font-bold text-primary mb-1">{value}</p>
      <p className="text-xs text-foreground/60">{label}</p>
    </div>
  );
}
