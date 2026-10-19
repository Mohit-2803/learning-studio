import PageScripts from "../../components/PageScripts";

const scripts = [
  { src: "/scripts/progress-tracker.js" },
  { src: "/scripts/firebase-client.js", module: true },
];

type AuthSearchParams = Promise<{ mode?: string | string[] | undefined }>;

export async function generateMetadata({ searchParams }: { searchParams: AuthSearchParams }) {
  const { mode } = await searchParams;
  return {
    title: mode === "signup" ? "Create account · Learning Studio" : "Sign in · Learning Studio",
  };
}

export default async function AuthPage({ searchParams }: { searchParams: AuthSearchParams }) {
  const { mode } = await searchParams;
  const isSignup = mode === "signup";

  return (
    <>
      <div className="auth-page min-h-screen bg-[#f8f8f6] font-sans text-[#202a30]" data-auth-page="true" data-auth-mode={isSignup ? "signup" : "signin"}>
<header className="mx-auto flex h-[62px] max-w-[1180px] items-center justify-between border-b border-[#e8e9e8] px-[18px] sm:h-[72px] sm:px-7">
  <a className="flex items-center gap-[9px] font-display text-sm font-bold tracking-[-0.4px] text-[#202a30] no-underline sm:text-[15px]" href="/">
    <img className="block w-[31px] flex-none rounded-[9px] object-contain" src="/brand-mark.svg" width={31} height={31} alt="" aria-hidden="true" />
 learning
    <span className="-ml-[9px] font-medium text-[#858d90]">.studio</span>
  </a>
  <a className="text-sm font-medium text-[#64737a] no-underline hover:text-[#7160ce]" href="/">Back to course library</a>
</header>
<main id="main-content" className="mx-auto grid min-h-[calc(100vh-72px)] w-[min(1080px,calc(100%-32px))] grid-cols-1 items-center gap-7 py-[34px] sm:w-[min(1080px,calc(100%-48px))] sm:py-11 min-[681px]:grid-cols-[minmax(0,1fr)_minmax(340px,410px)] min-[851px]:grid-cols-[minmax(0,1fr)_minmax(380px,440px)] min-[851px]:gap-20">
  <section className="max-w-[490px]" aria-labelledby="welcomeTitle">
    <div className="text-[13px] font-medium tracking-[0.01em] text-[#7160ce]">
      Your learning space
    </div>
    <h1 className="my-4 max-w-[460px] font-display text-[36px] font-bold leading-[1.1] tracking-[-1.4px] sm:my-5 sm:text-[clamp(40px,4.2vw,52px)] sm:tracking-[-2px]" id="welcomeTitle">
      {isSignup ? "Start learning by doing." : "Make learning stick."}
    </h1>
    <p className="max-w-[440px] text-[14px] leading-[1.75] text-[#68777d]" id="welcomeCopy">
      {isSignup
        ? "Explore a course, try what you learn, and keep your progress in one place."
        : "Your courses, lab work, and progress stay together wherever you learn."}
    </p>
    <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5">
      <article className="flex items-start gap-3.5">
        <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-xl bg-[#eeeafd] text-[#7160ce]" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="size-5" fill="none"><path d="M3.5 15.5V10m4.3 5.5V6m4.4 9.5V8m4.3 7.5V4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
        </span>
        <div className="grid gap-1">
          <b className="font-display text-[14px] font-semibold" id="welcomePointOneTitle">{isSignup ? "Choose a course" : "Your progress stays in sync"}</b>
          <small className="text-[13px] leading-[1.55] text-[#68777d]" id="welcomePointOneCopy">{isSignup ? "Start with GraphQL or Docker, at a pace that works for you." : "Chapters and practice are ready when you return."}</small>
        </div>
      </article>
      <article className="flex items-start gap-3.5">
        <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-xl bg-[#eeeafd] text-[#7160ce]" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="size-5" fill="none"><rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="m6.5 8 2 2-2 2m4 0h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg>
        </span>
        <div className="grid gap-1">
          <b className="font-display text-[14px] font-semibold" id="welcomePointTwoTitle">{isSignup ? "Practice as you learn" : "Try ideas in guided labs"}</b>
          <small className="text-[13px] leading-[1.55] text-[#68777d]" id="welcomePointTwoCopy">{isSignup ? "Try real queries and commands in guided labs." : "Explore GraphQL and Docker in a safe workspace."}</small>
        </div>
      </article>
      <article className="flex items-start gap-3.5">
        <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-xl bg-[#eeeafd] text-[#7160ce]" aria-hidden="true">
          <svg viewBox="0 0 20 20" className="size-5" fill="none"><rect x="4.5" y="9" width="11" height="8" rx="1.8" stroke="currentColor" strokeWidth="1.6" /><path d="M7 9V6.8a3 3 0 0 1 6 0V9m-3 3v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" /></svg>
        </span>
        <div className="grid gap-1">
          <b className="font-display text-[14px] font-semibold" id="welcomePointThreeTitle">{isSignup ? "Keep your progress" : "Your learning stays private"}</b>
          <small className="text-[13px] leading-[1.55] text-[#68777d]" id="welcomePointThreeCopy">{isSignup ? "Your courses and lab work stay together across devices." : "Your saved course progress belongs to your account."}</small>
        </div>
      </article>
    </div>
  </section>
  <section id="auth-panel" className="w-full" aria-label="Account access" aria-busy="true">
    <p className="sr-only" role="status">Loading account options</p>
    <div className="auth-dialog auth-skeleton motion-safe:animate-pulse" aria-hidden="true">
      <div className="mb-2 h-2 w-28 rounded bg-[#e8e9e8]"></div>
      <div className="mb-2 h-8 w-52 max-w-full rounded bg-[#e8e9e8]"></div>
      <div className="mb-6 grid gap-2">
        <div className="h-3 w-full rounded bg-[#eef0ef]"></div>
        <div className="h-3 w-4/5 rounded bg-[#eef0ef]"></div>
      </div>
      <div className="mb-5 h-11 w-full rounded-lg border border-[#e8e9e8] bg-[#f5f6f5]"></div>
      <div className="mb-5 h-px w-full bg-[#e8e9e8]"></div>
      <div className="mb-3 h-3 w-20 rounded bg-[#eef0ef]"></div>
      <div className="mb-4 h-11 w-full rounded-lg border border-[#e8e9e8] bg-white"></div>
      <div className="mb-3 h-3 w-24 rounded bg-[#eef0ef]"></div>
      <div className="mb-4 h-11 w-full rounded-lg border border-[#e8e9e8] bg-white"></div>
      <div className="mb-3 h-3 w-16 rounded bg-[#eef0ef]"></div>
      <div className="mb-4 h-11 w-full rounded-lg border border-[#e8e9e8] bg-white"></div>
      <div className="mb-5 h-11 w-full rounded-lg bg-[#ded9f6]"></div>
      <div className="mx-auto mb-3 h-3 w-40 rounded bg-[#eef0ef]"></div>
      <div className="mx-auto h-3 w-28 rounded bg-[#eef0ef]"></div>
      <div className="mt-7 border-t border-[#e8e9e8] pt-5">
        <div className="mx-auto h-3 w-3/4 rounded bg-[#eef0ef]"></div>
      </div>
    </div>
  </section>
</main>
      </div>
      <PageScripts scripts={scripts} />
    </>
  );
}
