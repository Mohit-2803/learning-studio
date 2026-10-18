import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
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

const configPayload = await fetch("/api/firebase-config").then((response) => response.json());
const config = configPayload.config;
const trackedKeys = [
  "graphql-practice-progress",
  "graphql-interview-reviewed",
  "graphql-course-state",
  "docker-interview-reviewed",
  "docker-course-state",
  "docker-lab-state",
];
const authPage = document.body.dataset.authPage === "true";
const mount = document.createElement("div");
mount.className = "auth-mount";
const header = document.querySelector("header");
if (!authPage && header && !document.body.classList.contains("home-page")) {
  const target =
    header.querySelector(".top-right, .lab-status, .top-cta") || header;
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
  </form>
  <button class="auth-mode" type="button">New here? Create an account</button>
  <button class="auth-reset" type="button">Forgot password?</button>
  <p class="auth-message" role="status" aria-live="polite"></p>
  <p class="auth-privacy">Your saved progress is private to your account.</p>`;
document.querySelector("#auth-panel")?.append(modal);
if (!authPage) document.body.append(modal);

let app,
  auth,
  db,
  currentUser = null,
  syncing = false,
  pendingSync = false,
  saveTimer = 0;
let resolveAuthReady;
const authReady = new Promise((resolve) => { resolveAuthReady = resolve; });
const dirtyKeys = window.__learningDirtyKeys || new Map();
const form = modal.querySelector("#authForm");
const message = modal.querySelector(".auth-message");
const nameRow = modal.querySelector(".auth-name-row");
const modeButton = modal.querySelector(".auth-mode");
let creatingAccount = false;

const showMessage = (text, error = false) => {
  message.textContent = text;
  message.classList.toggle("is-error", error);
};
const friendlyError = (error) =>
  ({
    "auth/email-already-in-use":
      "An account already uses this email. Try signing in.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in Firebase Authentication.",
    "auth/unauthorized-domain": "Add this site’s hostname to Firebase Authentication → Settings → Authorized domains.",
    "auth/network-request-failed": "Could not reach Firebase. Check your connection and try again.",
    "auth/popup-closed-by-user":
      "The sign-in window was closed before finishing.",
    "permission-denied":
      "Firestore blocked this save. Check that the rules were published.",
    "failed-precondition":
      "Create the Cloud Firestore database, then publish firestore.rules.",
  })[error.code] ||
  error.message ||
  "Something went wrong. Please try again.";
const progressRef = (uid) =>
  doc(db, "users", uid, "progress", "course-progress");

function updateAccountButton() {
  const landingActions = document.querySelector(".landing-auth-actions");
  if (landingActions) {
    landingActions.innerHTML = currentUser
      ? `<span class="landing-account">Signed in as <b>${escapeText(currentUser.displayName || currentUser.email || "Learner")}</b></span><button class="landing-signout" type="button">Sign out</button>`
      : '<a class="landing-signin" href="/auth/">Sign in</a><a class="landing-signup" href="/auth/?mode=signup">Create account</a>';
    landingActions.querySelector(".landing-signout")?.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
    });
    return;
  }

  mount.innerHTML = currentUser
    ? `<button class="auth-account" type="button"><span class="auth-avatar">${escapeText((currentUser.displayName || currentUser.email || "L").slice(0, 1).toUpperCase())}</span><span class="auth-account-label"><b>${escapeText(currentUser.displayName || currentUser.email)}</b><small>Progress sync on</small></span><span class="auth-caret">⌄</span></button><div class="auth-menu" hidden><span>${escapeText(currentUser.email || "Signed in")}</span><button class="auth-signout" type="button">Sign out</button></div>`
    : `<button class="auth-trigger" type="button"><span>↗</span> Sign in</button>`;
  mount.querySelector(".auth-trigger")?.addEventListener("click", () => {
    const next = location.pathname.startsWith("/courses/")
      ? `${location.pathname}${location.search}${location.hash}`
      : null;
    const query = new URLSearchParams({ mode: "signin" });
    if (next) query.set("next", next);
    location.assign(`/auth/?${query.toString()}`);
  });
  mount.querySelector(".auth-account")?.addEventListener("click", () => {
    const menu = mount.querySelector(".auth-menu");
    menu.hidden = !menu.hidden;
  });
  mount.querySelector(".auth-signout")?.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  });
}
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
  form.elements.password.autocomplete = createAccount ? "new-password" : "current-password";
  form.querySelector(".auth-submit").textContent = createAccount ? "Create account" : "Sign in";
  modeButton.textContent = createAccount ? "Already have an account? Sign in" : "New here? Create an account";
  modal.querySelector(".auth-reset").hidden = createAccount;
  modal.querySelector("#authTitle").textContent = createAccount
    ? "Create your account"
      : authPage ? "Welcome back" : "Sign in to Learning Studio";
  modal.querySelector(".auth-intro").textContent = createAccount
    ? "Create an account to save course progress and lab work across your devices."
    : "Sign in to keep course progress and lab work across your devices.";
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
  const dirtyAtStart = new Map(dirtyKeys);
  try {
    const ref = progressRef(currentUser.uid);
    const snapshot = await getDoc(ref);
    const cloud = snapshot.exists() ? snapshot.data().values || {} : {};
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
      { values: merged, updatedAt: serverTimestamp() },
      { merge: true },
    );
    for (const [key, version] of dirtyAtStart) {
      if (dirtyKeys.get(key) === version) dirtyKeys.delete(key);
    }
    window.dispatchEvent(
      new CustomEvent("learning:sync-status", { detail: { status: "saved" } }),
    );
  } catch (error) {
    console.error("Learning progress sync failed", error);
    window.dispatchEvent(
      new CustomEvent("learning:sync-status", {
        detail: { status: "error", message: friendlyError(error) },
      }),
    );
  } finally {
    syncing = false;
    if (pendingSync || dirtyKeys.size) {
      pendingSync = false;
      queueSave();
    }
  }
}
function queueSave() {
  if (!currentUser) return;
  window.dispatchEvent(
    new CustomEvent("learning:sync-status", { detail: { status: "saving" } }),
  );
  clearTimeout(saveTimer);
  saveTimer = setTimeout(syncProgress, 500);
}

if (!configPayload.configured || !config?.apiKey) {
  if (authPage) {
    showMessage(
      "Authentication isn’t configured yet. Add the Firebase web app values to .env, then restart the app.",
      true,
    );
    form.querySelectorAll("input, button").forEach((control) => { control.disabled = true; });
  } else {
    mount.innerHTML = `<button class="auth-trigger auth-config-needed" type="button" title="Set Firebase web app values in the local .env file and restart the app">Connect Firebase</button>`;
    mount.querySelector("button").addEventListener("click", () => {
      modal.showModal();
      showMessage("Add the Firebase web app values to the local .env file, then restart npm start.", true);
    });
  }
} else {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    resolveAuthReady();
    updateAccountButton();
    if (user) {
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
      const destination = requestedDestination?.startsWith("/courses/") && !requestedDestination.startsWith("//")
        ? requestedDestination
        : authPage ? "/" : null;
      if (destination) {
        sessionStorage.removeItem("learning-course-after-auth");
        if (destination !== location.pathname + location.search) window.location.assign(destination);
      }
    } else {
      window.dispatchEvent(
        new CustomEvent("learning:auth-state", { detail: { user: null } }),
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
    showMessage(creatingAccount ? "Creating your account…" : "Signing in…");
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
      showMessage(friendlyError(error), true);
    } finally {
      submit.disabled = false;
    }
  });
  modeButton.addEventListener("click", () => {
    setAuthMode(!creatingAccount);
    showMessage("");
  });
  modal.querySelector(".auth-google").addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      showMessage(friendlyError(error), true);
    }
  });
  modal.querySelector(".auth-reset").addEventListener("click", async () => {
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) {
      showMessage(
        "Enter your email address above, then select Forgot password?",
        true,
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent. Check your inbox.");
    } catch (error) {
      showMessage(friendlyError(error), true);
    }
  });
  window.addEventListener("learning:local-progress-changed", (event) => {
    if (trackedKeys.includes(event.detail?.key)) queueSave();
  });

  if (authPage) {
    setAuthMode(new URLSearchParams(location.search).get("mode") === "signup");
  }

  if (!authPage && document.body.classList.contains("home-page")) {
    document.querySelectorAll('a[href^="/auth/"][href*="next="]').forEach((link) => {
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
