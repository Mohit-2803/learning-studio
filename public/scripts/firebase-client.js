import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

let configPayload;
try {
  const res = await fetch("/api/firebase-config");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  configPayload = await res.json();
} catch (e) {
  console.warn("[firebase] Failed to fetch config:", e.message);
  configPayload = { configured: false, config: null };
}
const config = configPayload.config;
const trackedKeys = [
  "graphql-practice-progress",
  "graphql-interview-reviewed",
  "graphql-course-state",
  "docker-interview-reviewed",
  "docker-missions-completed",
  "docker-course-state",
  "docker-lab-state",
  "postgres-missions-completed",
  "postgres-course-state",
];
const authPage =
  document.body.dataset.authPage === "true" ||
  document.querySelector('[data-auth-page="true"]') !== null;
const homePage = document.querySelector(".home-page") !== null;
const mount =
  document.querySelector(".course-account-mount") ||
  document.createElement("div");
mount.classList.add("auth-mount");
const header = document.querySelector("header");
if (!authPage && header && !homePage && !mount.isConnected) {
  const target = header.querySelector(".top-right, .top-cta") || header;
  target.before(mount);
}

const modal = document.createElement(authPage ? "section" : "dialog");
modal.className = "auth-dialog";
modal.setAttribute("aria-labelledby", "authTitle");
modal.innerHTML = `
  ${authPage ? "" : '<form method="dialog" class="auth-dialog-close"><button aria-label="Close sign in">×</button></form>'}
  <div class="auth-kicker">LEARNING STUDIO ACCOUNT</div>
  <h2 id="authTitle">Save your learning</h2>
  <p class="auth-intro">Sign in to keep course progress and lab work across your devices.</p>
  <button class="auth-google" type="button"><svg class="auth-google-mark" aria-hidden="true" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.93c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.41 37.86 46.98 31.8 46.98 24.55z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.2a24 24 0 0 0 0 21.57l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.9l-7.98 6.2C6.51 42.62 14.62 48 24 48z"/></svg>Continue with Google</button>
  <div class="auth-divider"><span>or use email</span></div>
  <form id="authForm" class="auth-form">
    <label class="auth-name-row" hidden>Your name<input name="name" autocomplete="name" maxlength="60"></label>
    <label>Email address<input name="email" type="email" autocomplete="email" required></label>
    <label>Password<input name="password" type="password" autocomplete="current-password" minlength="6" required></label>
    <button class="auth-submit" type="submit">Sign in</button>
    <p class="auth-message" role="status" aria-live="polite" aria-atomic="true" hidden></p>
  </form>
  <button class="auth-mode" type="button">New here? Create an account</button>
  <button class="auth-reset" type="button">Forgot password?</button>
  <p class="auth-privacy">Your saved progress is private to your account.</p>`;
const authPanel = document.querySelector("#auth-panel");
if (authPanel) {
  authPanel.replaceChildren(modal);
  authPanel.setAttribute("aria-busy", "false");
}
if (!authPage) document.body.append(modal);

let app,
  auth,
  db,
  currentUser = null,
  syncing = false,
  pendingSync = false,
  syncFailureCount = 0,
  saveTimer = 0;
let lastSyncedSessionToken = "";
let inFlightSessionToken = "";
let inFlightSessionPromise = null;
let resolveAuthReady;
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});
const dirtyKeys = window.__learningDirtyKeys || new Map();
const form = modal.querySelector("#authForm");
const message = modal.querySelector(".auth-message");
const nameRow = modal.querySelector(".auth-name-row");
const modeButton = modal.querySelector(".auth-mode");
let creatingAccount = false;

const showMessage = (text, variant = "success") => {
  message.textContent = text;
  message.hidden = !text;
  message.classList.toggle("is-error", variant === "error");
  message.classList.toggle("is-pending", variant === "loading");
  message.classList.toggle(
    "is-success",
    variant === "success" && Boolean(text),
  );
  message.setAttribute("role", variant === "error" ? "alert" : "status");
  message.setAttribute(
    "aria-live",
    variant === "error" ? "assertive" : "polite",
  );
};
const friendlyError = (error) => {
  // Firebase errors normally expose `code`, but wrappers and older auth builds
  // sometimes leave only the generated message. Normalize both so users never
  // see a raw `Firebase: Error (auth/...)` string.
  const errorCode =
    error?.code ||
    error?.customData?.code ||
    String(error?.message || "").match(/auth\/[a-z-]+/)?.[0] ||
    "";
  const messages = {
    "auth/email-already-in-use":
      "An account already uses this email. Try signing in.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/user-not-found": "Email or password is incorrect.",
    "auth/too-many-requests":
      "Sign-in is temporarily paused for your account’s security. Wait a few minutes before trying again, or use Forgot password?",
    "auth/user-disabled":
      "This account is unavailable. Contact support for help.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/operation-not-allowed":
      "This sign-in method is unavailable right now. Try another method or contact support.",
    "auth/unauthorized-domain":
      "Sign-in isn’t configured for this site. Contact support for help.",
    "auth/network-request-failed":
      "Could not reach Firebase. Check your connection and try again.",
    "auth/popup-closed-by-user":
      "The sign-in window was closed before finishing.",
    "permission-denied":
      "Your progress couldn’t be saved. Try again in a moment.",
    "failed-precondition":
      "Progress syncing isn’t available right now. Try again later.",
  };
  return (
    messages[errorCode] ||
    "We couldn’t complete that request. Please try again."
  );
};
const progressRef = (uid) =>
  doc(db, "users", uid, "progress", "course-progress");
const nestedArrayMarker = "learningStudioNestedArrayValue";
function encodeFirestoreValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      Array.isArray(item)
        ? { [nestedArrayMarker]: encodeFirestoreValue(item) }
        : encodeFirestoreValue(item),
    );
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        encodeFirestoreValue(item),
      ]),
    );
  }
  return value;
}
function decodeFirestoreValue(value) {
  if (Array.isArray(value)) return value.map(decodeFirestoreValue);
  if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (
      keys.length === 1 &&
      keys[0] === nestedArrayMarker &&
      Array.isArray(value[nestedArrayMarker])
    ) {
      return value[nestedArrayMarker].map(decodeFirestoreValue);
    }
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        decodeFirestoreValue(item),
      ]),
    );
  }
  return value;
}

async function syncServerSession(user) {
  if (!user) {
    lastSyncedSessionToken = "";
    await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
    return;
  }

  const idToken = await user.getIdToken();
  if (idToken === lastSyncedSessionToken) return;
  if (inFlightSessionToken === idToken && inFlightSessionPromise) {
    return inFlightSessionPromise;
  }
  inFlightSessionToken = idToken;
  inFlightSessionPromise = (async () => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok)
      throw new Error("Could not establish the secure course session.");
    lastSyncedSessionToken = idToken;
  })();
  try {
    await inFlightSessionPromise;
  } finally {
    if (inFlightSessionToken === idToken) {
      inFlightSessionToken = "";
      inFlightSessionPromise = null;
    }
  }
}

function updateAccountButton() {
  const landingActions = document.querySelector(".landing-auth-actions");
  if (landingActions) {
    if (currentUser) {
      landingActions.innerHTML =
        '<div class="auth-mount landing-account-mount"></div>';
      renderSignedInAccount(landingActions.querySelector(".auth-mount"), {
        compact: true,
      });
    } else {
      landingActions.innerHTML =
        '<a class="landing-signin" href="/auth/">Sign in</a><a class="landing-signup" href="/auth/?mode=signup">Create account</a>';
    }
    landingActions.setAttribute("aria-busy", "false");
    return;
  }

  if (currentUser) {
    renderSignedInAccount(mount, { compact: true });
  } else {
    mount.innerHTML = `<button class="auth-trigger" type="button"><span>↗</span> Sign in</button>`;
  }
  mount.querySelector(".auth-trigger")?.addEventListener("click", () => {
    const next = location.pathname.startsWith("/courses/")
      ? `${location.pathname}${location.search}${location.hash}`
      : null;
    const query = new URLSearchParams({ mode: "signin" });
    if (next) query.set("next", next);
    location.assign(`/auth/?${query.toString()}`);
  });
}

function renderSignedInAccount(container, { compact = false } = {}) {
  if (!container || !currentUser) return;

  const displayName = currentUser.displayName || currentUser.email || "Learner";
  const initials = displayName.slice(0, 1).toUpperCase();
  const photoURL = safeProfilePhotoURL(currentUser.photoURL);
  const avatar = photoURL
    ? `<img class="auth-avatar-image" src="${escapeText(photoURL)}" alt="" referrerpolicy="no-referrer">`
    : `<span class="auth-avatar" aria-hidden="true">${escapeText(initials)}</span>`;

  container.innerHTML = `<button class="auth-account${compact ? " auth-account-compact" : ""}" type="button" aria-label="Open account menu" aria-haspopup="true" aria-expanded="false">${avatar}<span class="auth-account-label"><b>${escapeText(displayName)}</b>${compact ? "" : "<small>Progress sync on</small>"}</span><span class="auth-caret" aria-hidden="true">⌄</span></button><div class="auth-menu" role="group" aria-label="Account options" hidden><div class="auth-menu-profile">${avatar}<div class="auth-menu-profile-copy"><span class="auth-menu-name">${escapeText(displayName)}</span><span class="auth-menu-email">${escapeText(currentUser.email || "Signed in")}</span></div></div><div class="auth-menu-divider" aria-hidden="true"></div><button class="auth-signout" type="button"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M8.25 3.5h-3A1.75 1.75 0 0 0 3.5 5.25v9.5A1.75 1.75 0 0 0 5.25 16.5h3M11 13.5l3.5-3.5L11 6.5M14.25 10H7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/></svg><span>Sign out</span></button><div class="auth-signout-confirm" hidden><div class="auth-signout-question"><span class="auth-confirm-mark" aria-hidden="true">?</span><div><b>Sign out?</b><p>Are you sure you want to sign out?</p></div></div><div class="auth-confirm-actions"><button class="auth-confirm-cancel" type="button">Cancel</button><button class="auth-confirm-yes" type="button">Sign out</button></div><p class="auth-signout-error" role="status" aria-live="polite" hidden></p></div></div>`;

  const trigger = container.querySelector(".auth-account");
  const menu = container.querySelector(".auth-menu");
  trigger?.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    trigger.setAttribute("aria-expanded", String(!menu.hidden));
    if (menu.hidden) resetSignOutConfirmation(menu);
  });
  const signOutAction = menu?.querySelector(".auth-signout");
  const confirmation = menu?.querySelector(".auth-signout-confirm");
  const cancelSignOut = menu?.querySelector(".auth-confirm-cancel");
  const confirmSignOut = menu?.querySelector(".auth-confirm-yes");

  signOutAction?.addEventListener("click", () => {
    signOutAction.hidden = true;
    confirmation.hidden = false;
    cancelSignOut.focus();
  });
  cancelSignOut?.addEventListener("click", () => {
    resetSignOutConfirmation(menu);
    signOutAction.focus();
  });
  confirmSignOut?.addEventListener("click", async () => {
    const errorMessage = menu.querySelector(".auth-signout-error");
    confirmSignOut.disabled = true;
    confirmSignOut.textContent = "Signing out…";
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      errorMessage.textContent = friendlyError(error);
      errorMessage.hidden = false;
      confirmSignOut.disabled = false;
      confirmSignOut.textContent = "Sign out";
    }
  });
}

function resetSignOutConfirmation(menu) {
  const signOutAction = menu?.querySelector(".auth-signout");
  const confirmation = menu?.querySelector(".auth-signout-confirm");
  const confirmSignOut = menu?.querySelector(".auth-confirm-yes");
  const errorMessage = menu?.querySelector(".auth-signout-error");
  if (signOutAction) signOutAction.hidden = false;
  if (confirmation) confirmation.hidden = true;
  if (confirmSignOut) {
    confirmSignOut.disabled = false;
    confirmSignOut.textContent = "Sign out";
  }
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }
}

function closeAccountMenu(menu) {
  menu.hidden = true;
  menu
    .closest(".auth-mount")
    ?.querySelector(".auth-account")
    ?.setAttribute("aria-expanded", "false");
  resetSignOutConfirmation(menu);
}

function safeProfilePhotoURL(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  document
    .querySelectorAll(".auth-mount .auth-menu:not([hidden])")
    .forEach((menu) => {
      const container = menu.closest(".auth-mount");
      if (!container?.contains(event.target)) {
        closeAccountMenu(menu);
      }
    });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document
    .querySelectorAll(".auth-mount .auth-menu:not([hidden])")
    .forEach((menu) => {
      closeAccountMenu(menu);
    });
});
function escapeText(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function openAuth() {
  setAuthMode(false);
  showMessage("");
  if (authPage) modal.hidden = false;
  else modal.showModal();
}
function setAuthMode(createAccount) {
  creatingAccount = createAccount;
  nameRow.hidden = !createAccount;
  form.elements.password.autocomplete = createAccount
    ? "new-password"
    : "current-password";
  form.querySelector(".auth-submit").textContent = createAccount
    ? "Create account"
    : "Sign in";
  modeButton.textContent = createAccount
    ? "Already have an account? Sign in"
    : "New here? Create an account";
  modal.querySelector(".auth-reset").hidden = createAccount;
  modal.querySelector("#authTitle").textContent = createAccount
    ? "Create your account"
    : authPage
      ? "Welcome back"
      : "Sign in to Learning Studio";
  modal.querySelector(".auth-intro").textContent = createAccount
    ? "Create an account to save course progress and lab work across your devices."
    : "Sign in to keep course progress and lab work across your devices.";

  const welcomeCopy = createAccount
    ? {
        description:
          "Explore a course, try what you learn, and keep your progress in one place.",
        points: [
          [
            "Choose a course",
            "Start with GraphQL or Docker, at a pace that works for you.",
          ],
          [
            "Practice as you learn",
            "Try real queries and commands in guided labs.",
          ],
          [
            "Keep your progress",
            "Your courses and lab work stay together across devices.",
          ],
        ],
      }
    : {
        description:
          "Your courses, lab work, and progress stay together wherever you learn.",
        points: [
          [
            "Your progress stays in sync",
            "Chapters and practice are ready when you return.",
          ],
          [
            "Try ideas in guided labs",
            "Explore GraphQL and Docker in a safe workspace.",
          ],
          [
            "Your learning stays private",
            "Your saved course progress belongs to your account.",
          ],
        ],
      };

  const setCopy = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  };
  setCopy("welcomeCopy", welcomeCopy.description);
  welcomeCopy.points.forEach(([title, description], index) => {
    setCopy(`welcomePoint${index + 1}Title`, title);
    setCopy(`welcomePoint${index + 1}Copy`, description);
  });
}
function collectProgress() {
  const values = {};
  for (const key of trackedKeys) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        values[key] = JSON.parse(raw);
      } catch {
        values[key] = raw;
      }
    }
  }
  return values;
}
function publishRestored(key, value) {
  try {
    window.__suppressLearningTracking = true;
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(
      new CustomEvent("learning:progress-restored", { detail: { key, value } }),
    );
  } catch (error) {
    console.warn("Could not restore saved progress", error);
  } finally {
    window.__suppressLearningTracking = false;
  }
}
function mergeProgress(localValues, cloudValues, locallyDirty = new Set()) {
  const merged = { ...cloudValues };
  for (const [key, value] of Object.entries(localValues)) {
    const remote = cloudValues[key];
    if (Array.isArray(value) && Array.isArray(remote)) {
      merged[key] = [...new Set([...remote, ...value])];
    } else if (remote === undefined || locallyDirty.has(key)) {
      merged[key] = value;
    }
  }
  return merged;
}
async function syncProgress() {
  if (!currentUser) return;
  if (syncing) {
    pendingSync = true;
    return;
  }
  syncing = true;
  let failed = false;
  try {
    const ref = progressRef(currentUser.uid);
    const snapshot = await getDoc(ref);
    const cloud = snapshot.exists()
      ? decodeFirestoreValue(snapshot.data().values || {})
      : {};
    // Capture local edits after the Firestore read. A learner can interact
    // while getDoc is pending; treating those edits as clean would let this
    // older cloud snapshot overwrite their current lab state.
    const dirtyAtStart = new Map(dirtyKeys);
    const local = collectProgress();
    const merged = mergeProgress(local, cloud, new Set(dirtyAtStart.keys()));
    for (const key of trackedKeys) {
      if (
        Object.hasOwn(merged, key) &&
        JSON.stringify(merged[key]) !== localStorage.getItem(key)
      ) {
        publishRestored(key, merged[key]);
      }
    }
    await setDoc(
      ref,
      { values: encodeFirestoreValue(merged), updatedAt: serverTimestamp() },
      { merge: true },
    );
    for (const [key, version] of dirtyAtStart) {
      if (dirtyKeys.get(key) === version) dirtyKeys.delete(key);
    }
    syncFailureCount = 0;
    window.dispatchEvent(
      new CustomEvent("learning:sync-status", { detail: { status: "saved" } }),
    );
  } catch (error) {
    failed = true;
    syncFailureCount += 1;
    console.error("Learning progress sync failed", error);
    window.dispatchEvent(
      new CustomEvent("learning:sync-status", {
        detail: { status: "error", message: friendlyError(error) },
      }),
    );
  } finally {
    syncing = false;
    const changedDuringSync = pendingSync;
    pendingSync = false;
    if (changedDuringSync) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(syncProgress, 500);
    } else if (failed && syncFailureCount < 5) {
      const retryDelay = Math.min(30_000, 500 * 2 ** syncFailureCount);
      clearTimeout(saveTimer);
      saveTimer = setTimeout(syncProgress, retryDelay);
    }
  }
}
function queueSave() {
  if (!currentUser) return;
  syncFailureCount = 0;
  window.dispatchEvent(
    new CustomEvent("learning:sync-status", { detail: { status: "saving" } }),
  );
  clearTimeout(saveTimer);
  saveTimer = setTimeout(syncProgress, 500);
}

if (!configPayload.configured || !config?.apiKey) {
  // Graceful fallback: Firebase not configured (common on Render free tier)
  console.warn(
    "[firebase] No valid config — running in local-only mode (no cloud sync or auth).",
  );
  window.__learningFirebaseReady = false;
  updateAccountButton();

  if (authPage) {
    // On auth page, show a non-blocking notice instead of disabling everything
    const notice = document.createElement("div");
    notice.className = "auth-notice";
    notice.style.cssText =
      "margin:12px 0;padding:10px 14px;border-radius:8px;background:#fff3cd;color:#664d03;font-size:0.9em;";
    notice.textContent =
      "Cloud sync is disabled (Firebase not configured). Progress is saved locally only.";
    form?.parentNode?.insertBefore(notice, form);
  } else if (mount) {
    // On other pages, silently hide the auth button
    mount.style.display = "none";
  }

  // Resolve auth so the rest of the app can continue
  resolveAuthReady();
} else {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    resolveAuthReady();
    updateAccountButton();
    if (user) {
      try {
        await syncServerSession(user);
      } catch (error) {
        console.error("[firebase] Secure session sync failed:", error);
        if (authPage && new URLSearchParams(location.search).has("next")) {
          showMessage(
            "Could not verify your secure course session. Please try again.",
            "error",
          );
          return;
        }
      }
      if (!authPage && modal.open) modal.close();
      window.dispatchEvent(
        new CustomEvent("learning:auth-state", {
          detail: {
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            },
          },
        }),
      );
      const previousUserId = localStorage.getItem("learning-progress-user");
      if (previousUserId && previousUserId !== user.uid) {
        for (const key of trackedKeys) localStorage.removeItem(key);
        dirtyKeys.clear();
      }
      localStorage.setItem("learning-progress-user", user.uid);
      await syncProgress();
      const requestedDestination = authPage
        ? new URLSearchParams(location.search).get("next")
        : sessionStorage.getItem("learning-course-after-auth");
      const destination =
        requestedDestination?.startsWith("/courses/") &&
        !requestedDestination.startsWith("//")
          ? requestedDestination
          : authPage
            ? "/"
            : null;
      if (destination) {
        sessionStorage.removeItem("learning-course-after-auth");
        if (destination !== location.pathname + location.search)
          window.location.assign(destination);
      }
    } else {
      await syncServerSession(null);
      window.dispatchEvent(
        new CustomEvent("learning:auth-state", { detail: { user: null } }),
      );
    }
  });

  onIdTokenChanged(auth, (user) => {
    if (user) {
      syncServerSession(user).catch((error) =>
        console.error("[firebase] Secure session refresh failed:", error),
      );
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));
    const submit = form.querySelector(".auth-submit");
    submit.disabled = true;
    showMessage(
      creatingAccount ? "Creating your account…" : "Signing in…",
      "loading",
    );
    try {
      if (creatingAccount) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const displayName = String(data.get("name") || "").trim();
        if (displayName) await updateProfile(result.user, { displayName });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      submit.disabled = false;
    }
  });
  form.addEventListener("input", () => {
    if (message.classList.contains("is-error")) showMessage("");
  });
  modeButton.addEventListener("click", () => {
    setAuthMode(!creatingAccount);
    showMessage("");
  });
  modal.querySelector(".auth-google").addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      showMessage(friendlyError(error), "error");
    }
  });
  modal.querySelector(".auth-reset").addEventListener("click", async () => {
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) {
      showMessage(
        "Enter your email address above, then select Forgot password?",
        "error",
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    }
  });
  window.addEventListener("learning:local-progress-changed", (event) => {
    if (trackedKeys.includes(event.detail?.key)) queueSave();
  });

  if (authPage) {
    setAuthMode(new URLSearchParams(location.search).get("mode") === "signup");
  }

  if (!authPage && homePage) {
    document
      .querySelectorAll('a[href^="/auth/"][href*="next="]')
      .forEach((link) => {
        link.addEventListener("click", async (event) => {
          event.preventDefault();
          const url = new URL(link.href, location.href);
          const destination = url.searchParams.get("next");
          await authReady;
          location.assign(
            currentUser && destination?.startsWith("/courses/")
              ? destination
              : link.href,
          );
        });
      });
  }
}

window.LearningProgress = {
  isSignedIn: () => Boolean(currentUser),
  saveLocal(key, value) {
    if (!trackedKeys.includes(key)) return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  sync: queueSave,
};

window.addEventListener("learning:sync-status", (event) => {
  const status = event.detail?.status;
  const label = mount.querySelector(".auth-account-label small");
  if (label && status === "saving") label.textContent = "Saving progress…";
  if (label && status === "saved") label.textContent = "Progress synced";
  if (label && status === "error") {
    label.textContent = "Sync needs attention";
    label.title = event.detail.message || "Progress could not be saved.";
  }
});
