import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageScripts from "../../../components/PageScripts";
import { SESSION_COOKIE } from "../../../lib/session-cookie";
import { verifyFirebaseIdToken } from "../../../lib/firebase-session";

const scripts = [
  { src: "/scripts/progress-tracker.js" },
  { src: "/scripts/courses/graphql/advanced-curriculum.js" },
  { src: "/scripts/courses/graphql/app.js" },
  { src: "/scripts/firebase-client.js", module: true },
];

export const metadata = { title: "GraphQL Learning Lab · Learning Studio" };
export const dynamic = "force-dynamic";

export default async function GraphQLCoursePage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifyFirebaseIdToken(token))) {
    redirect("/auth/?mode=signin&next=%2Fcourses%2Fgraphql%2F");
  }

  return (
    <>
      <div className="graphql-page min-h-screen bg-[#fbfbfd] font-sans text-sm text-[#222331]">
<header className="sticky top-0 z-[4] flex h-16 items-center justify-between border-b border-[#eaeaf0] bg-white px-[17px] sm:px-9">
  <a className="flex items-center gap-2.5 font-display text-base font-bold text-inherit no-underline" href="/">
    <img className="block h-[30px] w-[30px] flex-none object-contain" src="/brand-mark.svg" width={30} height={30} alt="" aria-hidden="true" />
    <span>
learning
      <span className={"muted"}>.studio</span>
    </span>
  </a>
  <div className="flex items-center gap-5">
    <span className="font-mono text-[10px] font-medium tracking-[1px] text-[#787989]">
      <i className="mr-[7px] inline-block h-[7px] w-[7px] rounded-full bg-[#41b88d] shadow-[0_0_0_3px_#e6f6f0]"></i>
 LOCAL PLAYGROUND
    </span>
    <div className="auth-mount course-account-mount" aria-label="Account"></div>
  </div>
</header>
<div className="mx-auto grid max-w-[1440px] grid-cols-[205px_1fr] min-[951px]:grid-cols-[252px_1fr] max-[720px]:block">
  <aside className="sticky top-16 flex h-[calc(100vh-64px)] min-h-[calc(100vh-64px)] flex-col border-r border-[#eaeaf0] bg-white px-[13px] py-9 min-[951px]:px-5 min-[951px]:pl-7 max-[720px]:relative max-[720px]:top-auto max-[720px]:h-auto max-[720px]:min-h-0 max-[720px]:border-x-0 max-[720px]:border-b max-[720px]:px-4 max-[720px]:py-[15px]">
    <a href="/" className="mb-2.5 inline-block text-xs text-[#5e5d6b] no-underline hover:text-accent-warm">← Back to Learning Studio</a>
    <div className="font-mono text-[9px] tracking-[1.1px] text-[#b7007c] max-[720px]:hidden">API DEVELOPMENT</div>
    <h2 className="mb-1 mt-2.5 font-display text-[17px] font-bold max-[720px]:hidden">GraphQL learning path</h2>
    <p className="m-0 text-xs text-[#777989] max-[720px]:hidden">One chapter at a time, from query to resolver.</p>
    <div className="course-position" aria-live="polite">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold text-[#777989]">Your place</span>
        <span className="font-mono text-[10px] text-[#6253ba]" id="lessonProgressLabel">Chapter 00 of 20</span>
      </div>
      <progress id="lessonProgress" max={20} value={1} aria-label="Course position" />
    </div>
    <nav className="mt-[30px] grid gap-[5px] max-[720px]:m-0 max-[720px]:flex max-[720px]:gap-1.5 max-[720px]:overflow-auto" id="lessonNav"></nav>
    <div className={"side-tip"}>
      <span>✦</span>
      <div>
        <b>Try it yourself</b>
        <p>Each chapter includes a live workbench. Run its example, then change it.</p>
      </div>
    </div>
    <div className={"side-footer"}>A hands-on learning project</div>
  </aside>
  <main id="main-content" className="mx-auto w-full max-w-[1070px] px-[30px] pt-[33px] min-[951px]:px-[52px] max-[720px]:px-[17px] max-[720px]:pt-6">
    <div className={"crumb"}>
      <a href={"/"}>
        <img className={"brand-mark-small"} src={"/brand-mark.svg"} width={16} height={16} alt={""} aria-hidden={"true"} />
 ALL COURSES
      </a>
      <span>/</span>
 GRAPHQL LEARNING PATH
    </div>
    <section className="flex min-h-[192px] items-center justify-between py-5 pb-[10px] max-[720px]:min-h-0 max-[720px]:py-[25px] max-[720px]:pb-[23px]">
      <div>
        <div className={"eyebrow"}>
          <span className={"spark"}>✳</span>
 FOUNDATIONS TO INTERVIEW PRACTICE
        </div>
        <h1 className="my-[13px] font-display text-[34px] font-extrabold tracking-[-1.3px] max-[720px]:text-[29px]">
Learn GraphQL by{" "}
          <em className="not-italic text-[#b7007c]">doing.</em>
        </h1>
        <p className="m-0 max-w-[510px] text-[13px] leading-[1.65] text-[#777989]">
GraphQL gives your app a clear way to ask an API for exactly the data it needs. Explore the
                        ideas, then try real queries below.
        </p>
      </div>
      <div className={"hero-art"}>
        <div className={"orbit o1"}></div>
        <div className={"orbit o2"}></div>
        <div className={"globe"}>
          <img src={"/brands/graphql-hexagraph.svg"} width={72} height={72} alt={"GraphQL hexagraph logo"} />
        </div>
        <div className={"float-card fc1"}>query &#123; ... &#125;</div>
        <div className={"float-card fc2"}>&#123; data &#125;</div>
        <span className={"star s1"}>✦</span>
        <span className={"star s2"}>✧</span>
      </div>
    </section>
    <details className="mb-4 rounded-[11px] border border-[#e4e0ef] bg-white text-[#403e50]">
      <summary className="cursor-pointer list-inside px-[15px] py-3 text-xs font-semibold text-[#5b5479]">20 chapters · start here → fundamentals → applied API work → interview practice</summary>
      <div className="grid grid-cols-2 gap-2 px-[14px] pb-[10px] min-[721px]:grid-cols-4">
        <article className="grid gap-1 rounded-[7px] bg-[#f7f6fb] p-2.5">
          <b className="font-mono text-[10px] text-[#6958b7]">00 · Start here</b>
          <span className="text-[11px] leading-[1.5] text-[#777687]">What GraphQL is, what it is not, and how a request reaches the server</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f7f6fb] p-2.5">
          <b className="font-mono text-[10px] text-[#6958b7]">01–03 · Foundations</b>
          <span className="text-[11px] leading-[1.5] text-[#777687]">Client/server flow, schema, fields and relationships</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f7f6fb] p-2.5">
          <b className="font-mono text-[10px] text-[#6958b7]">04–11 · Applied work</b>
          <span className="text-[11px] leading-[1.5] text-[#777687]">Arguments, variables, mutations, errors, React, lists, fragments and reviews</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f7f6fb] p-2.5">
          <b className="font-mono text-[10px] text-[#6958b7]">12–18 · Interview &amp; operations</b>
          <span className="text-[11px] leading-[1.5] text-[#777687]">Cursor pagination, error behavior, authorization, N+1, query security, subscriptions, mutation input design</span>
        </article>
        <article className="grid gap-1 rounded-[7px] bg-[#f7f6fb] p-2.5">
          <b className="font-mono text-[10px] text-[#6958b7]">19 · Final lab</b>
          <span className="text-[11px] leading-[1.5] text-[#777687]">All examples, 14 hands-on challenges, response reasoning</span>
        </article>
      </div>
      <p className="m-0 px-[15px] pb-[13px] text-xs leading-[1.6] text-[#777687]">By the end, aim to build and explain a small client-to-server GraphQL feature, read error responses, and discuss common design and performance trade-offs. The sample API intentionally leaves production authentication and query-cost controls as design exercises.</p>
    </details>
    <section className="rounded-[11px] border border-[var(--line)] bg-white px-[25px] pb-[18px] pt-[22px] shadow-[0_4px_14px_#35304c05]">
      <div className="flex items-center justify-between">
        <div>
          <div className={"eyebrow"} id={"lessonKicker"}>CHAPTER 00 · START HERE</div>
          <h2 className="mt-[7px] font-display text-[19px] font-bold tracking-[-0.35px]" id="lessonTitle">What GraphQL is—and what it isn’t</h2>
        </div>
      <span className="rounded-full bg-[#f7f7fa] px-[9px] py-1.5 text-[10px] text-[#898997]" id="lessonTime">6 min read</span>
      </div>
      <p id="lessonBody" className="mb-2.5 mt-[14px] max-w-[750px] text-[15px] leading-[1.75] text-[#686a78]"></p>
      <div id={"lessonExtra"}></div>
    </section>
    <section id={"chapterDetail"} className={"chapter-detail"}></section>
    <div id={"finalLab"}>
      <section className={"flow-card"}>
        <div className={"eyebrow"}>UNDER THE HOOD</div>
        <h2>What happens when you run a query?</h2>
        <div className={"flow-steps"}>
          <article>
            <span>1</span>
            <div>
              <b>Your app sends a request</b>
              <p>The query and any variables are sent to the GraphQL endpoint.</p>
            </div>
          </article>
          <article>
            <span>2</span>
            <div>
              <b>The schema checks it</b>
              <p>
The server checks field names, types, and required inputs against its API contract.
              </p>
            </div>
          </article>
          <article>
            <span>3</span>
            <div>
              <b>Resolvers find the data</b>
              <p>
A resolver is the server function that supplies a field’s value, perhaps from a
                                    database or another service.
              </p>
            </div>
          </article>
          <article>
            <span>4</span>
            <div>
              <b>You get a shaped response</b>
              <p>
The server returns JSON containing the fields you selected, or helpful errors if the
                                    request is invalid.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className={"playground"} id={"playground"}>
        <div className={"play-head"}>
          <div>
            <div className={"eyebrow"}>THE PLAYGROUND</div>
            <h2>Make a request</h2>
            <p>Choose an example or write your own query. The server will run it for real.</p>
          </div>
          <span className={"api-status"}>
            <i></i>
 API ready
          </span>
        </div>
        <div className={"workbench"}>
          <div className={"editor-pane"}>
            <div className={"pane-head"}>
              <span>
                <i className={"dot-purple"}></i>
 QUERY
              </span>
              <button id={"resetBtn"} className={"quiet-btn"}>↺ Reset</button>
            </div>
            <div className={"query-editor-wrap"}>
              <pre id={"queryHighlight"} aria-hidden={"true"}>
                <code></code>
              </pre>
              <textarea id={"queryInput"} spellCheck={"false"} aria-label={"GraphQL query editor"}></textarea>
            </div>
            <div className={"variables-wrap"}>
              <div className={"pane-head vars-head"}>
                <span>
VARIABLES{" "}
                  <small>JSON</small>
                </span>
                <button id={"varsToggle"} className={"quiet-btn"}>
Show{" "}
                  <span>⌄</span>
                </button>
              </div>
              <textarea id={"variablesInput"} spellCheck={"false"} aria-label={"Query variables"} hidden></textarea>
            </div>
            <div className={"run-row"}>
              <span className={"keyboard-hint"}>
⌘ ↵{" "}
                <span>to run</span>
              </span>
              <button id={"runBtn"} className={"run-btn"}>
Run query{" "}
                <span>▶</span>
              </button>
            </div>
          </div>
          <div className={"response-pane"}>
            <div className={"pane-head"}>
              <span>
                <i className={"dot-green"}></i>
 RESPONSE
              </span>
              <span className={"response-meta"} id={"responseMeta"}>JSON</span>
            </div>
            <div id={"requestPipeline"} className={"request-pipeline"} aria-live={"polite"} hidden>
              <div data-step={"client"}>
                <i>1</i>
                <span>Prepare operation</span>
              </div>
              <div data-step={"network"}>
                <i>2</i>
                <span>Send request</span>
              </div>
              <div data-step={"schema"}>
                <i>3</i>
                <span>Validate schema</span>
              </div>
              <div data-step={"resolver"}>
                <i>4</i>
                <span>Resolve data</span>
              </div>
              <div data-step={"response"}>
                <i>5</i>
                <span>Return JSON</span>
              </div>
            </div>
            <pre id={"responseOutput"}>
              <div className={"empty-response"}>
                <span className={"braces"}>&#123; &#125;</span>
                <b>Your response will appear here</b>
                <span>Run a query to see what the API sends back.</span>
              </div>
            </pre>
          </div>
        </div>
        <div id={"explainBox"} className={"explain-box"}>
          <span className={"explain-icon"}>✦</span>
          <div>
            <b id={"explainTitle"}>What to notice</b>
            <p id={"explainText"}>
The server returns only the fields you asked for. Try removing a field
                                and run the query again.
            </p>
          </div>
        </div>
        <section className={"live-inspector"} aria-label={"Live resolver trace and library state"}>
          <article className={"inspector-card"}>
            <div className={"inspector-heading"}>
              <div>
                <div className={"eyebrow"}>SERVER ACTIVITY</div>
                <h3>Resolver trace</h3>
              </div>
              <span id={"traceMeta"}>Run a query to inspect</span>
            </div>
            <div id={"resolverTrace"} className={"trace-list"}>
              <p>Each request reports the resolver functions that ran, including nested fields.</p>
            </div>
          </article>
          <article className={"inspector-card"}>
            <div className={"inspector-heading"}>
              <div>
                <div className={"eyebrow"}>LIVE SAMPLE DATA</div>
                <h3>Library state</h3>
              </div>
              <button id={"refreshState"} className={"quiet-btn"}>Refresh</button>
            </div>
            <div id={"stateSummary"} className={"state-summary"}>
              <p>Loading the current server data…</p>
            </div>
            <button id={"resetLibrary"} className={"quiet-btn reset-data"}>↺ Reset sample data</button>
          </article>
        </section>
      </section>
      <section className={"code-lab"}>
        <div className={"eyebrow"}>FROM AN APP · JAVASCRIPT EXAMPLES</div>
        <h2>See how code sends a GraphQL request</h2>
        <p className={"code-intro"}>
The query editor above is useful for learning GraphQL itself. Real apps send a
                        query from code. Choose an example, run it, and inspect the response returned by this same local
                        API.
        </p>
        <div className={"code-workbench"}>
          <div className={"code-editor"}>
            <div className={"code-tabs"} id={"codeTabs"} role={"tablist"} aria-label={"JavaScript code examples"}></div>
            <pre id={"codeExample"} aria-label={"JavaScript example code"}></pre>
            <div className={"code-run-row"}>
              <span id={"codeDescription"}>
This JavaScript sends a query with
                                    fetch.
              </span>
              <button id={"runCodeBtn"} className={"run-btn"}>
Run JavaScript
                <span>▶</span>
              </button>
            </div>
          </div>
          <div className={"code-result"}>
            <div className={"pane-head"}>
              <span>
                <i className={"dot-green"}></i>
 LIVE OUTPUT
              </span>
              <span id={"codeMeta"} className={"response-meta"}>READY</span>
            </div>
            <pre id={"codeOutput"}>
              <span className={"code-placeholder"}>Choose an example and run it to see the response.</span>
            </pre>
          </div>
        </div>
        <div className={"code-note"}>
          <span>✦</span>
          <p>
These examples run against the local GraphQL API. You can edit the GraphQL query in the
                            playground above and run it there; the JavaScript examples here are ready-to-run
                            demonstrations of the client request pattern.
          </p>
        </div>
      </section>
      <section className={"concepts"}>
        <div className={"eyebrow"}>THE BIG PICTURE</div>
        <h2>Why teams choose GraphQL</h2>
        <div className={"concept-grid"}>
          <article>
            <span className={"concept-num"}>01</span>
            <h3>Ask for just what you need</h3>
            <p>
Choose the fields in the response. Fewer unwanted fields means less data moving over the
                                network.
            </p>
          </article>
          <article>
            <span className={"concept-num"}>02</span>
            <h3>Follow related data</h3>
            <p>
Fetch a book and its related details in one request, instead of stitching together
                                several endpoints.
            </p>
          </article>
          <article>
            <span className={"concept-num"}>03</span>
            <h3>Keep a clear contract</h3>
            <p>
A schema describes the data and actions an API supports. Tools can use it to validate
                                queries and offer help.
            </p>
          </article>
        </div>
      </section>
      <section className={"practice"} id={"practice"}>
        <div className={"practice-heading-row"}>
          <div>
            <div className={"eyebrow"}>PRACTICE · YOUR TURN</div>
            <h2>Try these challenges</h2>
          </div>
          <span id={"practiceProgress"} className={"practice-progress"} aria-live={"polite"}>0 / 14 complete</span>
        </div>
        <p className={"practice-intro"}>
Write each query in the playground above, run it, then check your answer.
                        The hints point you toward the right fields.
        </p>
        <div className={"final-example-library"}>
          <div className={"final-example-head"}>
            <div>
              <div className={"eyebrow"}>ALL CHAPTER EXAMPLES</div>
              <h3>Revisit any experiment</h3>
            </div>
            <span>Loads into the workbench above</span>
          </div>
          <div id={"finalExampleList"} className={"final-example-list"}></div>
        </div>
        <div id={"practiceList"} className={"practice-list"}></div>
        <section className={"spoken-practice"}>
          <div className={"eyebrow"}>SAY IT IN YOUR OWN WORDS</div>
          <h3>Four interview scenarios</h3>
          <p>Answer aloud before opening the notes. Focus on explaining your reasoning and the trade-offs.</p>
          <div className={"spoken-grid"}>
            <details>
              <summary>When is GraphQL useful, and what does the backend need to provide?</summary>
              <p>Explain the graph-shaped schema, client-selected fields, typed validation, resolver layer, and the actual data source. GraphQL is an API layer, not a database or a frontend-only feature.</p>
            </details>
            <details>
              <summary>A nested query is slow. How do you investigate and improve it?</summary>
              <p>Inspect resolver traces and database timings, identify repeated N+1 lookups, batch related keys with request-scoped loaders, add indexes where appropriate, and measure again.</p>
            </details>
            <details>
              <summary>A response contains both data and errors. What should the client do?</summary>
              <p>Inspect errors and their paths alongside data. Explain how nullable fields affect propagation, show partial successful fields when safe, and distinguish validation failures from resolver failures.</p>
            </details>
            <details>
              <summary>How would you design a private, paginated live feed?</summary>
              <p>Cover stable cursor ordering and page limits, identity from trusted server context, per-record authorization, query-cost/rate controls, and whether subscriptions justify their transport and reconnect complexity.</p>
            </details>
          </div>
        </section>
        <section className={"graphql-interview"} aria-labelledby={"graphqlInterviewTitle"}>
          <div className={"interview-heading"}>
            <div>
              <div className={"eyebrow"}>INTERVIEW PRACTICE · EXPLAIN YOUR REASONING</div>
              <h2 id={"graphqlInterviewTitle"}>GraphQL in real situations</h2>
              <p>Choose the strongest answer, then read why it holds up. The topics move from core rules to design and performance.</p>
            </div>
            <span id={"graphqlInterviewScore"} className={"interview-score"} aria-live={"polite"}>0 / 12 correct</span>
          </div>
          <div id={"graphqlInterviewQuestions"} className={"graphql-interview-list"}></div>
          <details className={"graphql-official-reading"}>
            <summary>Continue with the official GraphQL learning guide</summary>
            <div>
              <a href={"https://graphql.org/learn/"} target={"_blank"} rel={"noreferrer"}>Core GraphQL lessons</a>
              <a href={"https://graphql.org/learn/queries/"} target={"_blank"} rel={"noreferrer"}>Queries, variables, aliases, and fragments</a>
              <a href={"https://graphql.org/learn/mutations/"} target={"_blank"} rel={"noreferrer"}>Mutation behavior</a>
              <a href={"https://graphql.org/learn/best-practices/"} target={"_blank"} rel={"noreferrer"}>Pagination, authorization, performance, and security</a>
              <a href={"https://graphql.org/learn/subscriptions/"} target={"_blank"} rel={"noreferrer"}>Subscriptions and real-time trade-offs</a>
            </div>
          </details>
        </section>
      </section>
    </div>
    <footer className={"footer"}>
Keep exploring. GraphQL makes more sense with every query.{" "}
      <span>✳</span>
    </footer>
  </main>
</div>
      </div>
      <PageScripts scripts={scripts} />
    </>
  );
}
