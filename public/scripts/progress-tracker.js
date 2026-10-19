(() => {
  const tracked = new Set([
    "graphql-practice-progress",
    "graphql-interview-reviewed",
    "graphql-course-state",
    "docker-interview-reviewed",
    "docker-missions-completed",
    "docker-course-state",
    "docker-lab-state",
  ]);
  const dirty = (window.__learningDirtyKeys ||= new Map());
  if (window.__learningProgressTrackingInstalled) return;
  window.__learningProgressTrackingInstalled = true;
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (
      this !== localStorage ||
      !tracked.has(String(key)) ||
      window.__suppressLearningTracking
    )
      return;
    const name = String(key);
    dirty.set(name, (dirty.get(name) || 0) + 1);
    window.dispatchEvent(
      new CustomEvent("learning:local-progress-changed", {
        detail: { key: name },
      }),
    );
  };
  window.addEventListener("storage", (event) => {
    if (!tracked.has(event.key) || window.__suppressLearningTracking) return;
    dirty.set(event.key, (dirty.get(event.key) || 0) + 1);
    window.dispatchEvent(
      new CustomEvent("learning:local-progress-changed", {
        detail: { key: event.key },
      }),
    );
  });
})();
