# Multi-stage Dockerfile for Gestion Matériel application
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build the React application
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies (production only)
RUN npm install --only=production

# Copy backend source code
COPY backend/ ./

# Stage 3: Production image
FROM node:18-alpine

WORKDIR /app/backend

# Install curl for health checks
RUN apk add --no-cache curl

# Copy backend from backend-builder stage
COPY --from=backend-builder /app/backend ./

# Copy the built frontend from frontend-builder stage to the correct location
# The backend expects it at ../frontend/build relative to the backend directory
RUN mkdir -p /app/frontend
COPY --from=frontend-builder /app/frontend/build /app/frontend/build

# Expose the port the backend runs on
EXPOSE 5000

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=5000
ENV DB_HOST=db
ENV DB_PORT=3306
ENV DB_USER=root
ENV DB_PASSWORD=rootpassword
ENV DB_NAME=materiel_db
ENV JWT_SECRET=gestion_materiel_secret_key_2024

# Start the backend server
CMD ["node", "server.js"]
