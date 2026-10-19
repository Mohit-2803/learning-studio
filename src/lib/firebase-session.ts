import { importX509, jwtVerify } from "jose";

const CERTS_URL =
  "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com";
let certificateCache = { expiresAt: 0, certificates: null };

async function getCertificates() {
  if (certificateCache.certificates && certificateCache.expiresAt > Date.now()) {
    return certificateCache.certificates;
  }

  const response = await fetch(CERTS_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load Firebase signing certificates.");
  const certificates = await response.json();
  const cacheControl = response.headers.get("cache-control") || "";
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 300);
  certificateCache = {
    certificates,
    expiresAt: Date.now() + Math.min(maxAge, 3600) * 1000,
  };
  return certificates;
}

export async function verifyFirebaseIdToken(token: string | null | undefined) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId || typeof token !== "string" || token.length > 8192) return null;

  try {
    const certificates = await getCertificates();
    const { payload } = await jwtVerify(
      token,
      async (header) => {
        if (!header.kid || !certificates[header.kid]) throw new Error("Unknown signing key.");
        return importX509(certificates[header.kid], "RS256");
      },
      {
        algorithms: ["RS256"],
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
        clockTolerance: 5,
      },
    );

    if (typeof payload.sub !== "string" || !payload.sub) return null;
    if (typeof payload.auth_time !== "number" || payload.auth_time > Date.now() / 1000 + 5) return null;
    return { uid: payload.sub, email: payload.email || null };
  } catch {
    return null;
  }
}
