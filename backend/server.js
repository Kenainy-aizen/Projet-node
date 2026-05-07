const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const materielRoutes = require("./routes/materiel");

const app = express();

// CORS configuration - allow all origins in production (adjust as needed)
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? true // Allow all origins in production, or specify your domain
      : "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build
const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/materiel", materielRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Serveur en ligne" });
});

// Serve React app for all non-API routes (client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
