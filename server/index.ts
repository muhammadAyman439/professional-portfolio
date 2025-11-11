import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import contentRouter from "./routes/content";
import uploadRouter from "./routes/upload";
import { getAdminToken, updateAdminToken } from "./contentStore";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize admin token from .env if not set in database
  try {
    const dbToken = await getAdminToken();
    const envToken = process.env.CMS_ADMIN_TOKEN;
    
    if (!dbToken && envToken) {
      console.log("Initializing admin token from .env file...");
      await updateAdminToken(envToken);
      console.log("✓ Admin token initialized from .env");
    } else if (!dbToken) {
      console.warn("⚠ Warning: No admin token found in database or .env file.");
      console.warn("   Set CMS_ADMIN_TOKEN in .env or use PUT /api/content/admin-token to set it.");
    } else {
      console.log("✓ Admin token loaded from database");
    }
  } catch (error) {
    console.error("Error initializing admin token:", error);
  }

  const app = express();
  const server = createServer(app);

  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increased for image uploads

  app.use("/api/content", contentRouter);
  app.use("/api/upload", uploadRouter);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    const error = err as Error & { status?: number; details?: unknown };
    const status = error.status ?? 500;
    res.status(status).json({
      error: error.message ?? "Internal server error",
      details: error.details,
    });
  });

  const port = Number(process.env.PORT) || 4000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);

  });
}

startServer().catch(console.error);
