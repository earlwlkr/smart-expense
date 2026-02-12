// This file is purposely empty. 
// convexAuthNextjsMiddleware in middleware.ts handles the /api/auth routes automatically.
// We keep this file or directory if needed for Next.js routing, 
// but it doesn't need to export anything for Convex Auth to work.
export const GET = () => new Response("Convex Auth API Route");
