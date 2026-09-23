export default function handler(req: any, res: any) {
  res.status(200).json({
    status: "ok",
    appName: "Marium AI Workspace (CloudWorker AI)",
    timestamp: new Date().toISOString(),
    environment: "vercel-serverless",
    version: "1.0.0"
  });
}
