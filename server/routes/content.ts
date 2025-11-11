import { Router } from "express";
import {
  createCaseStudy,
  createInsight,
  deleteCaseStudy,
  deleteInsight,
  getAllContent,
  getAdminToken,
  getCaseStudies,
  getInsights,
  getProfile,
  updateAdminToken,
  updateCaseStudy,
  updateInsight,
  updateProfile,
} from "../contentStore";
import { CaseStudy, Insight, Profile } from "../../shared/content";
import { caseStudySchema, insightSchema, profileSchema } from "../validation";
import { parseValidation } from "../utils/validation";
import { requireAdminToken, invalidateTokenCache } from "../middleware/auth";

const contentRouter = Router();

// Verify admin token endpoint
contentRouter.post("/verify-token", requireAdminToken, (_req, res) => {
  res.json({ valid: true });
});

// Set/update admin token endpoint
// If no token exists in DB, allow setting without auth (initial setup)
// If token exists, require auth to update
contentRouter.put("/admin-token", async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      res.status(400).json({ error: "Token is required and must be a non-empty string" });
      return;
    }

    const existingToken = await getAdminToken();
    
    // If token exists, require authentication to update
    if (existingToken) {
      // Use requireAdminToken middleware inline
      const authorization = req.header("authorization");
      if (!authorization) {
        res.status(401).json({ error: "Missing Authorization header" });
        return;
      }

      const [scheme, providedToken] = authorization.split(" ");
      if (!scheme || scheme.toLowerCase() !== "bearer" || !providedToken || providedToken !== existingToken) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
    }

    await updateAdminToken(token.trim());
    invalidateTokenCache(); // Clear cache so new token is used immediately
    res.json({ success: true, message: "Admin token updated successfully" });
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/", async (_req, res, next) => {
  try {
    const content = await getAllContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/profile", async (_req, res, next) => {
  try {
    const profile = await getProfile();
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/profile", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(profileSchema, req.body) as Profile;
    const updated = await updateProfile(payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/case-studies", async (_req, res, next) => {
  try {
    const caseStudies = await getCaseStudies();
    res.json(caseStudies);
  } catch (error) {
    next(error);
  }
});

contentRouter.post("/case-studies", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(caseStudySchema, req.body) as CaseStudy;
    const created = await createCaseStudy(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/case-studies/:id", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(caseStudySchema.partial(), req.body) as Partial<CaseStudy>;
    const updated = await updateCaseStudy(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.delete("/case-studies/:id", requireAdminToken, async (req, res, next) => {
  try {
    await deleteCaseStudy(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

contentRouter.get("/insights", async (_req, res, next) => {
  try {
    const insights = await getInsights();
    res.json(insights);
  } catch (error) {
    next(error);
  }
});

contentRouter.post("/insights", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(insightSchema, req.body) as Insight;
    const created = await createInsight(payload);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

contentRouter.put("/insights/:id", requireAdminToken, async (req, res, next) => {
  try {
    const payload = parseValidation(insightSchema.partial(), req.body) as Partial<Insight>;
    const updated = await updateInsight(req.params.id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

contentRouter.delete("/insights/:id", requireAdminToken, async (req, res, next) => {
  try {
    await deleteInsight(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default contentRouter;

