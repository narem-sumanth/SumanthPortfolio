"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { track, useApiClient } from "@/features/shell";
import { TEXT_BODY, TEXT_LEAD } from "../lib/type-scale";

type Status = "idle" | "loading" | "success" | "error";

// Filled wells, not outlined boxes — the focus ring is the only line, and it is functional.
const FIELD =
  "w-full rounded-xl bg-raised px-5 py-4 text-foreground placeholder:text-foreground-subtle transition-colors focus:bg-elevated focus:outline-2 focus:outline-offset-2 focus:outline-foreground";

export function ContactForm() {
  const api = useApiClient();
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "loading" || status === "success") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      await api.submitContact({ name: form.name, email: form.email, message: form.message });
      track("contact_submitted");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "That did not send. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-elevated p-8 md:p-12"
        role="status"
      >
        <p className={`${TEXT_LEAD} font-bold text-foreground`}>Delivered. Thank you.</p>
        <p className={`mt-3 ${TEXT_BODY} text-foreground`}>I read everything that lands here and will reply by email.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className={`mt-8 ${TEXT_BODY} font-semibold text-foreground underline underline-offset-4`}
        >
          Write another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-5 ${TEXT_BODY}`}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="font-semibold text-foreground">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            className={FIELD}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="font-semibold text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className={FIELD}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="font-semibold text-foreground">
          What are you building?
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={5}
          rows={5}
          value={form.message}
          onChange={handleChange}
          className={`${FIELD} resize-none`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-raised px-5 py-4 font-semibold text-danger">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex items-center justify-center gap-2 self-start rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send it"}
        <ArrowUpRight
          className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
