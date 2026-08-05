"use client";

import { useState } from "react";

const EMAIL = "akshatp439@gmail.com";
const ENDPOINT = "https://api.web3forms.com/submit";

/**
 * Web3Forms delivers the submission to EMAIL without a backend. The key is
 * meant to live in the client, so NEXT_PUBLIC_ is correct here.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export const ContactForm = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  /**
   * Without a key there is nothing to submit to. Rendering the form anyway
   * would take a visitor through the whole message and then drop it, so the
   * section degrades to the plain address instead.
   */
  if (!ACCESS_KEY) {
    return (
      <p>
        The form is not connected yet. Mail{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly and it will reach me
        just the same.
      </p>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    setError("");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          access_key: ACCESS_KEY,
          subject: `hello from ${data.name || "your site"}`,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(result.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setError("Could not reach the server. Check your connection.");
    }
  };

  if (status === "sent") {
    return (
      <p role="status">
        <strong>Thanks, that came through.</strong> I&apos;ll get back to you at
        the address you gave.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot: hidden from people, ticked by bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
      />

      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" autoComplete="name" required />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" rows={6} required />

      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send"}
      </button>

      <p aria-live="polite" className="form-status">
        {status === "error" ? (
          <>
            {error} You can also mail{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.
          </>
        ) : null}
      </p>
    </form>
  );
};
