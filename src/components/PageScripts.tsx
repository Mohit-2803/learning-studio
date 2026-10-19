"use client";

import { useEffect } from "react";

export interface PageScript {
  src: string;
  module?: boolean;
}

interface PageScriptsProps {
  scripts: PageScript[];
}

export default function PageScripts({ scripts }: PageScriptsProps) {
  useEffect(() => {
    let cancelled = false;
    const loaded: HTMLScriptElement[] = [];

    async function loadScript(source: string, module = false): Promise<void> {
      await new Promise<void>((resolve, reject) => {
        if (cancelled) return resolve();
        const script = document.createElement("script");
        if (module) script.type = "module";
        script.src = source;
        script.async = false;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Could not load ${source}`));
        document.body.append(script);
        loaded.push(script);
      });
    }

    (async () => {
      for (const script of scripts) {
        try {
          await loadScript(script.src, script.module);
        } catch (error) {
          console.error("[Learning Studio] Page script failed:", error);
          break;
        }
      }
    })();

    return () => {
      cancelled = true;
      loaded.forEach((script) => script.remove());
    };
  }, [scripts]);

  return null;
}
