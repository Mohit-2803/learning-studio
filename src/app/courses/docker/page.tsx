import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageScripts from "../../../components/PageScripts";
import { SESSION_COOKIE } from "../../../lib/session-cookie";
import { verifyFirebaseIdToken } from "../../../lib/firebase-session";

const scripts = [
  { src: "/scripts/progress-tracker.js" },
  { src: "/scripts/courses/docker/advanced-curriculum.js" },
  { src: "/scripts/courses/docker/docker.js" },
  { src: "/scripts/firebase-client.js", module: true },
];

export const metadata = { title: "Docker Systems Lab · Learning Studio" };
export const dynamic = "force-dynamic";

export default async function DockerCoursePage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    redirect("/auth/?mode=signin&next=%2Fcourses%2Fdocker%2F");
  }

  return (
    <>
      <div className="docker-lab-page">
<header className={"lab-topbar"}>
  <a className={"lab-brand"} href={"/"}>
    <img className={"lab-brand-mark"} src={"/brand-mark.svg"} width={30} height={30} alt={""} aria-hidden={"true"} />
 learning
    <em>.studio</em>
  </a>
  <div className={"lab-route"}>
    <a href={"/"}>COURSES</a>
    <b>/</b>
    <span>DOCKER SYSTEMS LAB</span>
  </div>
  <div className="auth-mount course-account-mount" aria-label="Account"></div>
</header>
<div className="mx-auto grid max-w-[1600px] grid-cols-[225px_minmax(0,1fr)] min-[1101px]:grid-cols-[290px_minmax(0,1fr)] max-[760px]:block">
  <aside className={"course-sidebar"}>
    <div className={"course-label"}>CONTAINERS &amp; DEPLOYMENT</div>
    <h1>Docker Systems Lab</h1>
    <p>Learn what every command changes inside the engine.</p>
    <div className={"course-progress"}>
      <div>
        <span>MISSIONS COMPLETE</span>
      <b id={"progressText"}>00 / 26</b>
      </div>
      <div>
        <i id={"progressFill"}></i>
      </div>
    </div>
    <nav id={"chapterNav"} aria-label={"Docker chapters"}></nav>
    <div className={"sidebar-note"}>
      <div className="sidebar-note-heading">
        <span className="sidebar-note-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 3.25 19 6v5.45c0 4.45-2.9 7.65-7 9.3-4.1-1.65-7-4.85-7-9.3V6l7-2.75Z" />
            <path d="m9 12 2 2 4-4.25" />
          </svg>
        </span>
        <b>Safe by design</b>
      </div>
      <p>This Docker lab runs as a browser simulation. It lets you explore containers and other Docker objects without changing your computer.</p>
    </div>
    <a className={"sidebar-back"} href={"/"}>
      <img src="/brand-mark.svg" width={18} height={18} alt="" aria-hidden="true" />
      <span>Course library</span>
      <svg className="sidebar-back-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 10h11m-4-4 4 4-4 4" />
      </svg>
    </a>
  </aside>
  <main id="main-content" className={"course-main"}>
    <details className="mb-[14px] rounded-[10px] border border-[#dbe4e8] bg-white text-[#31444e]">
      <summary className="cursor-pointer list-inside px-[15px] py-3 text-xs font-bold text-[#536974]">26 chapters · start here → foundations → applied work → interview practice</summary>
      <div className="grid grid-cols-2 gap-2 px-[14px] pb-[10px] min-[761px]:grid-cols-4">
        <article className="grid gap-1 rounded-[7px] bg-[#f4f8f9] p-2.5">
          <b className="font-mono text-[10px] font-bold text-[#18809a]">00 · Start here</b>
          <span className="text-[11px] leading-[1.5] text-[#6f8189]">What Docker is, what it runs, and the pieces that work together</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f4f8f9] p-2.5">
          <b className="font-mono text-[10px] font-bold text-[#18809a]">01–04 · Foundations</b>
          <span className="text-[11px] leading-[1.5] text-[#6f8189]">Engine, images, containers, lifecycle</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f4f8f9] p-2.5">
          <b className="font-mono text-[10px] font-bold text-[#18809a]">05–11 · Applied work</b>
          <span className="text-[11px] leading-[1.5] text-[#6f8189]">Ports, config, storage, networks, Compose, builds, debugging</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f4f8f9] p-2.5">
          <b className="font-mono text-[10px] font-bold text-[#18809a]">12–24 · Interview &amp; operations</b>
          <span className="text-[11px] leading-[1.5] text-[#6f8189]">
Health, capacity, image design, secrets, releases, security, runbooks,
              mounts, startup commands, image updates, crash recovery, graceful shutdown
          </span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f4f8f9] p-2.5">
          <b className="font-mono text-[10px] font-bold text-[#18809a]">25 · Final lab</b>
          <span className="text-[11px] leading-[1.5] text-[#6f8189]">Build, configure, connect, verify, diagnose, explain</span>
        </article>
      </div>
      <p className="m-0 px-[15px] pb-[13px] text-xs leading-[1.6] text-[#72828a]">
By the end, aim to build and operate a small local stack, diagnose common failures from evidence, and explain
          the trade-offs behind its design. This covers common Docker fundamentals and interview scenarios; Docker’s
          full production ecosystem is larger.
      </p>
    </details>
    <section className={"lesson-hero"}>
      <div>
        <div className={"lesson-kicker"} id={"lessonKicker"}>CHAPTER 00 · START HERE</div>
        <h2 id={"lessonTitle"}>What Docker is—and what it runs</h2>
        <p id={"lessonSummary"}></p>
        <div className={"lesson-tags"} id={"lessonTags"}></div>
      </div>
      <div className={"lesson-map"} aria-hidden={"true"}>
        <span className={"map-client"}>CLI</span>
        <i>→</i>
        <span className={"map-engine"}>ENGINE</span>
        <i>→</i>
        <span className={"map-object"}>OBJECTS</span>
      </div>
    </section>
    <section className={"lesson-content"}>
      <div className={"lesson-copy"}>
        <div className={"section-label"}>MENTAL MODEL</div>
        <h3 id={"lessonModelTitle"}></h3>
        <p id={"lessonModel"}></p>
        <div className={"concept-strip"} id={"conceptStrip"}></div>
        <div id="lessonVisual"></div>
        <section className={"lesson-walkthrough"} id={"lessonWalkthrough"} aria-label={"Chapter walkthrough"}></section>
        <div id={"lessonContext"} className={"lesson-context"}></div>
      </div>
      <aside className={"chapter-mission"} id={"chapterMission"}>
        <div className={"mission-top"}>
          <span>CHAPTER MISSION</span>
          <b id={"missionState"}>NOT STARTED</b>
        </div>
        <h3 id={"missionTitle"}></h3>
        <p id={"missionPrompt"}></p>
        <div id={"missionSteps"} className={"mission-steps"}></div>
        <details>
          <summary>Show a hint</summary>
          <p id={"missionHint"}></p>
        </details>
        <button id={"loadMission"}>Load starting command</button>
      </aside>
    </section>
    <div className={"chapter-controls"}>
      <button id={"previousChapter"}>← Previous</button>
      <span id={"chapterCounter"}>00 / 26</span>
      <button id={"nextChapter"}>Next chapter →</button>
    </div>
    <section className={"runtime"} id={"runtime"}>
      <header className={"runtime-head"}>
        <div>
          <div className={"section-label"}>INTERACTIVE RUNTIME</div>
          <h2>Docker Sandbox</h2>
          <p>Start the engine, enter commands, and watch each operation change the modeled Docker state.</p>
        </div>
        <div className={"runtime-actions"}>
          <span id={"engineBadge"} className={"engine-badge offline"}>
            <i></i>
DOCKER ENGINE
              OFF
          </span>
          <button id={"startEngine"} className={"engine-toggle"}>Start Docker Engine</button>
          <button id={"resetRuntime"}>Reset lab</button>
        </div>
      </header>
      <div className={"runtime-grid"}>
        <section className={"terminal-panel"}>
          <div className={"panel-bar"}>
            <div>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <b>learner@docker-lab:~/notes-api</b>
            <span>bash</span>
          </div>
          <div className={"terminal-output"} id={"terminalOutput"}>
            <div className="terminal-history" id="terminalHistory" aria-live="polite"></div>
            <form id={"terminalForm"} className={"terminal-prompt"}>
              <label htmlFor={"terminalInput"}>learner@docker-lab:~/notes-api $</label>
              <input id={"terminalInput"} autoComplete={"off"} spellCheck={"false"} aria-label={"Terminal command"} />
              <div id={"commandSuggestions"} className={"command-suggestions"} hidden></div>
            </form>
          </div>
        </section>
        <section className={"engine-panel"}>
          <nav className={"engine-tabs"} aria-label={"Docker runtime views"}>
            <button className={"active"} data-view={"objects"}>
Objects
              <span id={"objectCount"}>0</span>
            </button>
            <button data-view={"files"}>
Project
                files
            </button>
            <button data-view={"network"}>Network</button>
            <button data-view={"build"}>
Build
                layers
            </button>
          </nav>
          <div className={"engine-view active"} id={"view-objects"}>
            <div id={"engineOffline"} className={"engine-offline"}>
              <span className={"offline-label"}>
                <i></i>
ENGINE NOT
                  STARTED
              </span>
              <h3>Start Docker before running Docker commands</h3>
              <p>
In a real setup, the Docker CLI needs the Docker Engine daemon. Use the Start Docker Engine control above, then
                  confirm the connection with{" "}
                <code>docker info</code>
.
              </p>
              <div className={"offline-steps"} id={"engineStartupSteps"}>
                <span>1 · Start the modeled engine above</span>
                <span>2 · Wait for the daemon</span>
                <span>3 · Check the connection</span>
              </div>
              <small>
This is a guided browser simulation; it does not
                  start software on your computer.
              </small>
            </div>
            <div className={"engine-summary"} id={"engineSummary"}></div>
            <div className={"object-section"}>
              <div className={"object-heading"}>
                <h3>Containers</h3>
                <span id={"containerCount"}>0</span>
              </div>
              <div id={"containerList"} className={"container-list"}></div>
            </div>
            <div className={"object-split"}>
              <div className={"object-section"}>
                <div className={"object-heading"}>
                  <h3>Images</h3>
                  <span id={"imageCount"}>0</span>
                </div>
                <div id={"imageList"} className={"compact-list"}></div>
              </div>
              <div className={"object-section"}>
                <div className={"object-heading"}>
                  <h3>Storage</h3>
                  <span id={"volumeCount"}>0</span>
                </div>
                <div id={"volumeList"} className={"compact-list"}></div>
              </div>
            </div>
          </div>
          <div className={"engine-view"} id={"view-files"}>
            <nav className={"file-browser-path"} id={"fileBrowserPath"} aria-label={"Project folder path"}></nav>
            <div className={"file-tabs"} id={"fileTabs"}></div>
            <div className={"file-editor-head"}>
              <span id={"activeFileName"}>Dockerfile</span>
              <span id={"fileDirty"}>SAVED</span>
            </div>
            <textarea id={"fileEditor"} className={"file-editor"} spellCheck={"false"} aria-label={"Project file editor"}></textarea>
            <div className={"file-actions"}>
              <p>Terminal file changes save automatically; save editor changes before the next build.</p>
              <div className={"file-action-buttons"}>
                <button id={"restoreStarter"} type={"button"}>Restore starter</button>
                <button id={"saveFile"} type={"button"}>Save file</button>
              </div>
            </div>
          </div>
          <div className={"engine-view"} id={"view-network"}>
            <div className={"network-canvas"} id={"networkCanvas"}></div>
            <div className={"port-table"} id={"portTable"}></div>
          </div>
          <div className={"engine-view"} id={"view-build"}>
            <div className={"build-empty"} id={"buildEmpty"}>
              <span>▦</span>
              <h3>No image built yet</h3>
              <p>
Run{" "}
                <code>docker build -t notes-api .</code>
 to turn the Dockerfile into visible layers.
              </p>
            </div>
            <div className={"layer-list"} id={"layerList"}></div>
          </div>
        </section>
      </div>
      <section className={"runtime-bottom"}>
        <div className={"event-stream"}>
          <div className={"bottom-heading"}>
            <div>
              <span>ENGINE EVENTS</span>
              <h3>What Docker changed</h3>
            </div>
            <button id={"clearEvents"}>Clear</button>
          </div>
          <div id={"eventStream"}></div>
        </div>
        <div className={"diagnostic"}>
          <div className={"bottom-heading"}>
            <div>
              <span>COMMAND COACH</span>
              <h3>Read the result</h3>
            </div>
          </div>
          <div id={"diagnosticContent"}>
            <div className={"diagnostic-empty"}>
              <span>?</span>
              <p>
Run a command. Successes explain the state change; errors explain the cause and a useful next step.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
    <section className={"capstone"} id={"capstone"} hidden>
      <div className={"section-label"}>FINAL LAB · COMPLETE APP</div>
      <h2>Ship the Notes API stack</h2>
      <p>
Build and verify a small app-and-database system. Follow the resource dependencies: build the image, start
          the database, create the network, then run and test the API. Hints explain each step.
      </p>
      <div className={"capstone-progress"} id={"capstoneProgress"} aria-live={"polite"}>0 / 14 goals complete</div>
      <div id={"capstoneMissions"} className={"capstone-grid"}></div>
      <section className={"interview-practice"} aria-labelledby={"dockerInterviewTitle"}>
        <div className={"interview-heading"}>
          <div>
            <div className={"section-label"}>INTERVIEW PRACTICE · EXPLAIN YOUR CHOICES</div>
            <h2 id={"dockerInterviewTitle"}>Docker concepts in real situations</h2>
            <p>
Choose the strongest answer, then read the explanation. These questions build on the lab rather than
                replace it.
            </p>
          </div>
          <span id={"dockerInterviewScore"} className={"interview-score"} aria-live={"polite"}>0 / 12 correct</span>
        </div>
        <div id={"dockerInterviewQuestions"} className={"interview-question-list"}></div>
        <section className={"spoken-practice"}>
          <div className={"section-label"}>SAY IT IN YOUR OWN WORDS</div>
          <h3>Four interview scenarios</h3>
          <p>
Pause before opening the notes. Explain your approach aloud, then compare the points a clear answer
              should cover.
          </p>
          <div className={"spoken-grid"}>
            <details>
              <summary>The CLI is installed, but Docker says it cannot connect. What do you check?</summary>
              <p>
Separate client from Engine. Check daemon state and selected context, then verify with docker info.
                  Explain that docker --version does not prove the daemon is reachable.
              </p>
            </details>
            <details>
              <summary>The API process is running, but a browser cannot reach it. How do you investigate?</summary>
              <p>
Check container status and logs, confirm the app listens on the expected container port and
                  interface, inspect the host-to-container mapping, then test from the host. EXPOSE alone does not
                  publish a port.
              </p>
            </details>
            <details>
              <summary>
A database container was replaced and its data disappeared. What should the design use?
              </summary>
              <p>
Use a named volume mounted at the database data path. Explain that the volume has its own lifecycle
                  and that Compose down normally keeps named volumes unless asked to remove them.
              </p>
            </details>
            <details>
              <summary>How would you prepare a Node image for a release?</summary>
              <p>
Discuss a multi-stage build, small supported runtime base, non-root user, ignored local secrets,
                  versioned image tag or digest, health signal, and a deployment platform that supplies runtime secrets.
              </p>
            </details>
          </div>
        </section>
        <details className={"official-reading"}>
          <summary>Keep learning from Docker’s documentation</summary>
          <div>
            <a href={"https://docs.docker.com/get-started/docker-overview/"} target={"_blank"} rel={"noreferrer"}>
Docker
                concepts and objects
            </a>
            <a href={"https://docs.docker.com/compose/gettingstarted/"} target={"_blank"} rel={"noreferrer"}>Compose multi-container quickstart</a>
            <a href={"https://docs.docker.com/build/cache/"} target={"_blank"} rel={"noreferrer"}>Build cache fundamentals</a>
            <a href={"https://docs.docker.com/engine/storage/volumes/"} target={"_blank"} rel={"noreferrer"}>
Volumes and
                persistent data
            </a>
            <a href={"https://docs.docker.com/get-started/docker-concepts/building-images/multi-stage-builds/"} target={"_blank"} rel={"noreferrer"}>Multi-stage builds</a>
            <a href={"https://docs.docker.com/build/building/secrets/"} target={"_blank"} rel={"noreferrer"}>
Build
                secrets
            </a>
            <a href={"https://docs.docker.com/engine/containers/start-containers-automatically/"} target={"_blank"} rel={"noreferrer"}>Container restart policies</a>
            <a href={"https://docs.docker.com/reference/dockerfile/#healthcheck"} target={"_blank"} rel={"noreferrer"}>Dockerfile health checks</a>
          </div>
        </details>
      </section>
    </section>
    <footer className={"docker-footer"}>
      <a href={"/"}>← Learning Studio</a>
      <span>Understand the object. Then run the command.</span>
    </footer>
  </main>
</div>
      </div>
      <PageScripts scripts={scripts} />
    </>
  );
}
