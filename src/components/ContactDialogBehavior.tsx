"use client";

import { useEffect } from "react";

export default function ContactDialogBehavior() {
  useEffect(() => {
    const link = document.getElementById("contactLink");
    const dialog = document.getElementById("contactDialog") as HTMLDialogElement | null;
    if (!link || !dialog) return;

    const openDialog = (event) => {
      event.preventDefault();
      dialog.showModal();
    };
    const handleClose = () => {
      if (dialog.returnValue !== "send") return;
      const form = dialog.querySelector("form") as HTMLFormElement | null;
      if (!form) return;
      console.log("[Contact]", Object.fromEntries(new FormData(form)));
      alert("Thanks! Your message was received (demo).");
      form.reset();
    };

    link.addEventListener("click", openDialog);
    dialog.addEventListener("close", handleClose);
    return () => {
      link.removeEventListener("click", openDialog);
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  return null;
}
