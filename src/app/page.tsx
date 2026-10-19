import PageScripts from "../components/PageScripts";
import ContactDialogBehavior from "../components/ContactDialogBehavior";
import HeroIllustrationCarousel from "../components/HeroIllustrationCarousel";

const scripts = [
  { src: "/scripts/progress-tracker.js" },
  { src: "/scripts/firebase-client.js", module: true },
];

export default function HomePage() {
  return (
    <>
      <div className="home-page min-h-screen bg-bg-primary font-sans text-text-primary">
<header className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between border-b border-border-subtle px-5 sm:px-[22px] lg:px-11">
  <a className="flex items-center gap-[9px] font-display text-base font-bold tracking-[-0.5px] text-[#222331] no-underline max-sm:text-sm" href="/">
    <img className="shrink-0" src="/brand-mark.svg" width={32} height={32} alt="" aria-hidden="true" />
 learning
    <span className="-ml-[9px] font-medium text-[#9694a0]">.studio</span>
  </a>
  <nav className="hidden gap-[34px] text-[15px] font-medium text-[#555563] sm:flex">
    <a className="no-underline hover:text-text-primary" href="#courses">Courses</a>
    <a className="no-underline hover:text-text-primary" href="#approach">How it works</a>
  </nav>
  <div className="landing-auth-actions flex items-center gap-3 sm:gap-[18px]" aria-busy="true">
    <span className="sr-only" role="status">Loading account</span>
    <span aria-hidden="true" className="h-3 w-10 rounded bg-[#e7e6eb] motion-safe:animate-pulse"></span>
    <span aria-hidden="true" className="h-9 w-[107px] rounded-lg bg-[#e7e6eb] motion-safe:animate-pulse"></span>
  </div>
</header>
<main id="main-content" className="mx-auto max-w-[1320px]">
  <section className="mx-auto grid min-h-[515px] max-w-[1320px] grid-cols-1 items-center gap-[30px] px-[22px] py-[45px] sm:px-[7%] sm:py-[52px] min-[851px]:min-h-[700px] min-[851px]:grid-cols-[1fr_.95fr] min-[851px]:gap-10 min-[851px]:px-[8%] min-[851px]:py-[64px]">
    <div>
      <div className="font-mono text-xs font-medium tracking-[1.2px] text-[#777686]">
 A SMALL STUDIO FOR PRACTICAL LEARNING
      </div>
      <h1 className="my-6 font-display text-[clamp(42px,5vw,64px)] font-bold leading-[1.08] tracking-[-3.4px] max-sm:tracking-[-2.5px]">
Understand the idea.
        <br />
        <em className="not-italic text-[#7160ce]">Make it work.</em>
      </h1>
      <p className="mb-6 max-w-[490px] text-[13px] leading-[1.8] text-[#727381] sm:text-[15px]">Clear, hands-on courses for the tools behind modern software. Learn the concepts, follow real examples, then try it yourself.</p>
      <a className="inline-flex items-center gap-[26px] rounded-lg bg-[#272532] px-[17px] py-[13px] text-xs font-semibold text-white no-underline" href="#courses">
Find your next course
        <span>↓</span>
      </a>
      <div className="mt-[30px] flex items-center gap-3 text-sm leading-[1.55] text-[#686877]">
        <span className="flex">
          <i className="grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-bg-primary bg-[#e10098] font-display text-[10px] font-bold not-italic text-white">G</i>
          <i className="-ml-[7px] grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-bg-primary bg-[#087eb5] font-display text-[10px] font-bold not-italic text-white">D</i>
          <i className="-ml-[7px] grid h-[26px] w-[26px] place-items-center rounded-full border-2 border-bg-primary bg-[#336791] font-display text-[10px] font-bold not-italic text-white">P</i>
        </span>
        <span>
          <b className="text-sm text-[#3c3b49]">3 guided courses</b>
          <br />
with more learning paths to come
        </span>
      </div>
    </div>
    <HeroIllustrationCarousel />
  </section>
  <section className="border-t border-border-subtle bg-bg-surface px-5 py-[38px] sm:px-[7%] sm:py-[42px] lg:px-[8%] lg:pb-[88px]" id="courses">
    <div className="mb-7 flex items-end justify-between max-sm:block">
      <div>
        <div className="font-mono text-xs font-medium tracking-[1.2px] text-[#777686]">THE COURSE LIBRARY</div>
        <h2 className="mt-3 font-display text-[25px] font-bold tracking-[-1.2px] sm:text-[31px]">Choose a place to start.</h2>
      </div>
      <p className="mb-0 mt-3 max-w-[360px] text-sm leading-[1.65] text-[#747381] sm:mb-0 sm:mt-0">
Learn the idea, see it in action, then try it yourself.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-[15px] min-[601px]:grid-cols-2 min-[601px]:gap-5 min-[1100px]:grid-cols-3">
      <a className="overflow-hidden rounded-[13px] border border-border-subtle text-inherit no-underline transition hover:-translate-y-[3px] hover:shadow-[0_14px_35px_#32284f12]" href="/auth/?mode=signup&next=%2Fcourses%2Fgraphql%2F">
        <div className={"course-art gql-art"}>
          <img className={"gql-logo"} src="/brands/graphql-hexagraph.svg" width={96} height={96} alt="GraphQL hexagraph logo" />
          <span className={"art-chip chip-one"}>query &#123; ... &#125;</span>
          <span className={"art-chip chip-two"}>&#123; data &#125;</span>
        </div>
        <div className="p-[17px] sm:px-[22px] sm:pb-[18px] sm:pt-5">
          <div className="flex justify-between gap-3 font-mono text-xs text-[#777583]">
            <span className="text-[#c40083]">
 API DEVELOPMENT
            </span>
            <span>20 chapters</span>
          </div>
          <h3 className="mb-[7px] mt-[15px] font-display text-base font-bold tracking-[-0.5px] sm:text-lg">GraphQL, from client to server</h3>
          <p className="m-0 max-w-[510px] text-sm leading-[1.65] text-[#686877]">Learn to shape an API, fetch related data, and handle common performance and security problems.</p>
          <div className="course-bottom mt-[17px] flex items-center justify-between gap-3 border-t border-border-subtle pt-[15px] text-sm text-[#686877]">
            <span>Beginner friendly · 19 lessons</span>
            <b className="text-sm text-[#c40083]">
Start learning
              <i className="ml-[7px] not-italic">↗</i>
            </b>
          </div>
        </div>
      </a>
      <a className="postgres-card overflow-hidden rounded-[13px] border border-border-subtle text-inherit no-underline transition hover:-translate-y-[3px] hover:shadow-[0_14px_35px_#32284f12]" href="/auth/?mode=signup&next=%2Fcourses%2Fpostgres%2F">
        <div className="course-art postgres-art">
          <img className="postgres-card-mark" src="/brands/postgresql-elephant.svg" width="120" height="124" alt="PostgreSQL elephant logo" />
        </div>
        <div className="p-[17px] sm:px-[22px] sm:pb-[18px] sm:pt-5">
          <div className="flex justify-between gap-3 font-mono text-xs text-[#777583]"><span className="text-[#336791]">DATABASES &amp; SQL</span><span>20 chapters</span></div>
          <h3 className="mb-[7px] mt-[15px] font-display text-base font-bold tracking-[-0.5px] sm:text-lg">PostgreSQL, by querying it</h3>
          <p className="m-0 max-w-[510px] text-sm leading-[1.65] text-[#686877]">Beginner-friendly SQL: tables, WHERE, joins (inner, left, right), writes, aggregates, and a live sandbox on every chapter.</p>
          <div className="course-bottom mt-[17px] flex items-center justify-between gap-3 border-t border-border-subtle pt-[15px] text-sm text-[#686877]"><span>Beginner friendly · 14 lessons</span><b className="text-sm text-[#336791]">Start learning<i className="ml-[7px] not-italic">↗</i></b></div>
        </div>
      </a>
      <a className="docker-card overflow-hidden rounded-[13px] border border-border-subtle text-inherit no-underline transition hover:-translate-y-[3px] hover:shadow-[0_14px_35px_#32284f12]" href="/auth/?mode=signup&next=%2Fcourses%2Fdocker%2F">
        <div className={"course-art docker-art"}>
          <img className={"docker-course-illustration"} src="/docker-course-illustration.png" width={480} height={220} alt="A blue whale carrying stacked containers" />
        </div>
        <div className="p-[17px] sm:px-[22px] sm:pb-[18px] sm:pt-5">
          <div className="flex justify-between gap-3 font-mono text-xs text-[#777583]">
            <span className="text-[#087eb5]">
 CONTAINERS &amp; DEPLOYMENT
            </span>
            <span>26 chapters</span>
          </div>
          <h3 className="mb-[7px] mt-[15px] font-display text-base font-bold tracking-[-0.5px] sm:text-lg">Docker, by running it</h3>
          <p className="m-0 max-w-[510px] text-sm leading-[1.65] text-[#686877]">Build and inspect a small system in a safe command lab, then practice diagnosing what changes.</p>
          <div className="course-bottom mt-[17px] flex items-center justify-between gap-3 border-t border-border-subtle pt-[15px] text-sm text-[#686877]">
            <span>Beginner friendly · 25 lessons</span>
            <b className="text-sm">
Start learning
              <i className="ml-[7px] not-italic">↗</i>
            </b>
          </div>
        </div>
      </a>
    </div>
  </section>
  <section className="grid grid-cols-1 gap-[23px] bg-[#f4f2ed] px-[22px] py-[45px] sm:gap-[35px] sm:px-[8%] sm:py-[55px] min-[601px]:grid-cols-[.9fr_1.1fr] min-[851px]:gap-[90px] min-[851px]:px-[11%] min-[851px]:py-[74px]" id="approach">
    <div>
      <div className="font-mono text-xs font-medium tracking-[1.2px] text-[#777686]">HOW THE LESSONS WORK</div>
      <h2 className="my-[14px] font-display text-[31px] font-bold leading-[1.16] tracking-[-1.2px] sm:text-[37px]">
See the system.
        <br />
        <em className="not-italic text-[#7160ce]">Then change it.</em>
      </h2>
      <p className="max-w-[360px] text-sm leading-[1.75] text-[#686877]">Each lesson connects a clear explanation to a worked example and a place to experiment.</p>
    </div>
    <div className="grid gap-[17px]">
      <article className="grid grid-cols-[37px_1fr] gap-[15px] border-b border-[#e4e1d9] py-4">
        <span className="pt-[3px] font-mono text-[10px] text-[#8170d0]">01</span>
        <div>
          <h3 className="mb-[5px] font-display text-base font-semibold">Understand the idea</h3>
          <p className="m-0 text-sm leading-[1.6] text-[#686877]">Start with a clear explanation and a useful mental model.</p>
        </div>
      </article>
      <article className="grid grid-cols-[37px_1fr] gap-[15px] border-b border-[#e4e1d9] py-4">
        <span className="pt-[3px] font-mono text-[10px] text-[#8170d0]">02</span>
        <div>
          <h3 className="mb-[5px] font-display text-base font-semibold">See it in action</h3>
          <p className="m-0 text-sm leading-[1.6] text-[#686877]">Follow a worked example one step at a time.</p>
        </div>
      </article>
      <article className="grid grid-cols-[37px_1fr] gap-[15px] border-b border-[#e4e1d9] py-4">
        <span className="pt-[3px] font-mono text-[10px] text-[#8170d0]">03</span>
        <div>
          <h3 className="mb-[5px] font-display text-base font-semibold">Try it yourself</h3>
          <p className="m-0 text-sm leading-[1.6] text-[#686877]">Change something, run it, and learn from the result.</p>
        </div>
      </article>
    </div>
  </section>
</main>
<footer className="mx-auto flex max-w-[1320px] items-center justify-between bg-bg-primary px-[22px] py-5 sm:px-[8%] sm:py-[25px]">
  <a className="flex items-center gap-[9px] font-display text-sm font-bold tracking-[-0.5px] text-[#222331] no-underline" href="/">
    <img className="shrink-0" src="/brand-mark.svg" width={22} height={22} alt="" aria-hidden="true" />
 learning
    <span className="-ml-[9px] font-medium text-[#9694a0]">.studio</span>
  </a>
  <span className="text-xs text-[#777583]">
© 2025 learning.studio •{" "}
    <a className="text-[#67657a] no-underline hover:text-text-primary" href="#contact" id="contactLink">Contact us</a>
 •{" "}
    <a className="text-[#67657a] no-underline hover:text-text-primary" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
  </span>
</footer>
<dialog id="contactDialog">
  <form method={"dialog"}>
    <h3>Contact Learning Studio</h3>
    <p>Questions, feedback, or course suggestions? We'd love to hear from you.</p>
    <label>
Name
      <input type={"text"} name={"name"} required />
    </label>
    <label>
Email
      <input type={"email"} name={"email"} required />
    </label>
    <label>
Message
      <textarea name={"message"} rows={4} required placeholder={"How can we help?"}></textarea>
    </label>
    <div className={"dialog-actions"}>
      <button type={"button"} value={"cancel"}>Cancel</button>
      <button type={"submit"} value={"send"}>Send message</button>
    </div>
  </form>
</dialog>
      </div>
      <ContactDialogBehavior />
      <PageScripts scripts={scripts} />
    </>
  );
}
