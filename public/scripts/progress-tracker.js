(() => {
  const tracked = new Set([
    "graphql-practice-progress",
    "graphql-interview-reviewed",
    "graphql-course-state",
    "docker-interview-reviewed",
    "docker-missions-completed",
    "docker-course-state",
    "docker-lab-state",
    "postgres-missions-completed",
    "postgres-course-state",
  ]);

  const originalSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (key, value) => {
    originalSetItem(key, value);
    if (!tracked.has(key)) return;
    if (window.__suppressLearningTracking) return;
    window.dispatchEvent(
      new CustomEvent("learning:local-progress-changed", {
        detail: { key },
      }),
    );
  };
})();
