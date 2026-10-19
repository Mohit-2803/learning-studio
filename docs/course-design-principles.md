# Learning Studio course design principles

This document is the shared product and teaching standard for every Learning Studio course, including future courses. Use it when planning, writing, revising, or reviewing course content and labs. It captures the user's recurring direction so the same goals do not need to be restated for each course.

## Our motto

**Not just learning: interactive learning.** A learner should be able to understand a concept, try it, observe what changed, make a mistake safely, diagnose the result, and recover in the course itself. Avoid making the learner install tools or research a separate tutorial just to follow the course.

Each course should take a beginner to a useful, demonstrable outcome through a focused path. The course is not a topic dump, a last-minute revision sheet, or a promise of professional expertise after a short binge. Every chapter and activity must contribute to the outcome and respect the learner's time.

## Make the promise concrete

Describe what a learner will be able to build, change, inspect, troubleshoot, and explain by the end. Base the promise on work they actually complete. Do not claim that course completion alone makes someone an expert, intermediate professional, or ready to claim years of project experience.

Prefer a narrow and credible promise, such as building a small working system, diagnosing a set of common failures, and explaining the decisions involved. A course may give interview-relevant understanding, but interview labels are not a reason to add unrelated topics.

## Every course starts with Chapter 00

Create a beginner-friendly **Chapter 00: Start here** for every course, including Docker and GraphQL. Assume the learner may have no context. Before asking them to use the sandbox, establish:

- What the subject is, what problem it solves, and when people use it.
- The essential terms and a plain-language mental model, with a concrete example.
- What the important parts do and how they relate (for example, Docker CLI, Engine, image, and container; or GraphQL client, schema, resolver, and data source).
- What the learner will build or change through the course, and what knowledge is and is not assumed.
- How to use the in-browser lab, what its simulation does, and what it does not do.
- A short first activity that checks understanding and gives the learner an early success.

Chapter 00 should orient rather than overwhelm. Teach only the background needed to make the course's main project understandable; introduce deeper detail at the chapter where it becomes useful.

## Give every chapter a teaching arc

A chapter is a lesson, not a title, one-line definition, command prompt, and sandbox. Develop the concept enough that a beginner can understand both what to do and why. Use a consistent arc, adapting its size to the topic:

1. **Goal:** State the practical question or outcome in learner-facing language.
2. **Explain:** Define the idea, why it matters, and how it fits the broader system.
3. **Show:** Walk through a concrete example and make the important steps or state changes visible.
4. **Try:** Give the learner a focused task in the lab, with a useful starting point and clear success evidence.
5. **Explore:** Ask them to change one thing, inspect the result, or predict what will happen.
6. **Troubleshoot:** Include a relevant failure or misconception; help them use evidence to diagnose and recover.
7. **Transfer:** Connect the lesson to a realistic project decision or a concise interview explanation.

Use enough explanation, examples, diagrams, and visual cues to teach the concept. Keep the writing direct and remove material that does not support the chapter goal. Do not pad chapters with generic advice or a long list of adjacent terms.

## Teach through a connected project and practice loop

Organize a course around one coherent project or workflow where possible. Let skills build across chapters so the learner can see how individual concepts combine in working software. Use the following loop throughout the course:

**Explain → demonstrate → guided practice → change something → diagnose/fix → verify → explain back.**

Start with enough guidance for a beginner to succeed. Gradually remove prompts so later activities ask learners to choose steps and use evidence independently. Include retrieval and prediction questions where they reinforce useful understanding. Avoid interaction that is decorative or disconnected from the stated goal.

Challenges should tell learners what outcome to reach and what evidence to inspect, without always giving away the exact command. Hints should be available when needed. On success or failure, explain the state change and the next useful step.

## Make the lab useful and honest

- Keep required practice available in the browser; do not require local installation, account setup with a third party, or outside research to complete the core course.
- Keep related surfaces connected. If a terminal changes project files or runtime objects, the files/object views should reflect the same modeled state.
- Show commands, files, resources, and results in a consistent, readable interface. Make controls easy to find and large enough to use; avoid duplicate controls that perform the same action.
- Make errors teach: explain what failed, relevant evidence, likely cause, and a recovery path. Avoid raw implementation errors as the only feedback.
- Label simulations accurately. A browser model must not imply it started or changed software on the learner's computer. Explain meaningful limits without undermining the hands-on activity.
- Prefer realistic, scoped behavior over pretending to implement an entire operating system or production service. Simulate the slice needed to teach the course outcome and explain where the model stops.

## Preserve learner work and progress deliberately

Treat workspace state and learning progress as different things. A learner may change or reset lab files without losing earned chapter completion. A reset should be explicit, explain what it will clear, and require confirmation when it can discard learner work.

For courses with a persistent project workspace, save useful work across reloads and make the saved scope clear. Provide a clear way to restore a lesson's starter state when the lesson needs it. Do not silently replace the learner's project or erase course progress when restoring a lab. Persist only data that supports learning and is safe to retain; transient output can usually be regenerated. Keep storage bounded and handle save/sync failures in a way the learner can understand.

## Keep content focused

Before adding a topic, ask:

- Does the learner need this to reach the course's promised outcome?
- Does it unlock a meaningful task, explain a common failure, or support a real decision?
- Can it be taught at the point of use without creating a distracting detour?
- Is there an interactive way to make the idea observable and practiceable?

If a topic does not earn its place, leave it out or identify it as optional further learning. Add depth by improving explanation, examples, practice, feedback, and transfer—not by accumulating chapter titles.

## Visual and interaction quality

Keep typography, spacing, colors, and control sizes consistent across the course shell, lessons, and labs. Establish a clear hierarchy between chapter title, section label, body explanation, example, hint, and control. Body text and navigation must remain readable at normal zoom and on narrow screens.

Check that sidebars, lesson panels, lab panes, menus, suggestions, and bottom navigation align and are not clipped or hidden behind scroll containers. Scrolling should be intentional and visually fit the lab. Do not show contradictory state indicators, duplicate status or profile controls, or controls that imply an action opposite to the current state. Keep navigation labels understandable and prevent reloads from unexpectedly selecting or scrolling to a different chapter.

Use accessible semantics, keyboard focus, and responsive layouts. Visual polish should help learners understand the system and their next action, rather than compete with the lesson.

## Apply the standard to each subject

The principles are shared; the project and concepts are course-specific. For example:

- **Docker:** Build and operate a small stack. Teach the relationship between project/build-context files, image contents, a container's writable layer, and persistent volumes through observable create/build/run/remove/recreate tasks. A scoped virtual filesystem can support the project; it need not emulate all of Linux.
- **GraphQL:** Implement a useful feature from schema through resolver and client operation. Let learners inspect returned data, errors, and access behavior, then make and verify a change. Introduce pagination, authorization, and performance when they matter to that feature or workflow.

These examples are starting points, not a fixed syllabus. Future courses should keep the same beginner orientation, focused outcome, connected interactive practice, truthful feedback, and evidence-based claims.

## Add researched questions to every chapter

Add a **Common questions** section below the teaching content for every chapter in both the Docker and GraphQL courses. The current scope is every chapter in each course, including Chapter 00 and the final lab. Include **five questions per chapter**, each followed by a detailed, beginner-readable answer.

Research the questions rather than inventing generic FAQ filler. Use reliable primary sources where available, such as official Docker and GraphQL documentation, and include a direct source link with each answer. Questions should reflect real learner confusions, common project situations, and useful interview follow-ups that fit that chapter. Answers should explain the reasoning, give a concrete example or implication when useful, correct likely misconceptions, and stay within the course's promised scope.

Avoid repeating the chapter text verbatim or adding unrelated topics just to reach five. Make each answer useful on its own, and use the FAQ to clarify or extend the chapter's core idea. Keep citations readable and accessible, and ensure links open safely and do not disrupt lab progress.

For future courses, use the same FAQ pattern unless the course's subject or structure makes a different count more useful; keep the questions researched, chapter-specific, and focused on the promised learning outcome.

## Review checklist for a new or revised course

- [ ] A beginner can start with Chapter 00 without needing unspoken context.
- [ ] The course states a concrete, credible learner outcome.
- [ ] Every chapter teaches an idea with context, an example, a focused practice task, and clear evidence of success.
- [ ] Lessons connect to a meaningful project or workflow; there is no filler topic accumulation.
- [ ] Learners can experiment, encounter useful feedback, diagnose a relevant failure, recover, and explain what happened.
- [ ] Core course work can be done in the browser, and simulation limits are clear.
- [ ] Workspace persistence, chapter completion, and reset behavior are understandable and safe.
- [ ] Typography, controls, navigation, and lab panes are consistent, readable, responsive, and not clipped.
- [ ] The course promise reflects demonstrated skills and does not overstate professional readiness.
- [ ] Every chapter has five researched, relevant common questions with detailed answers and reliable source links.
