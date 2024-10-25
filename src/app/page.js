"use client";

import { useRef, useState } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

function Form() {
  const form = useRef(null);

  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    sendGTMEvent({ event: "signup_form_submit" });

    try {
      const response = await fetch("/api/signups", {
        body: new FormData(form.current),
        method: "POST",
      });

      if (!response.ok) {
        console.log("Failed to submit the form", response);
      }

      setSuccess(true);
    } catch (error) {
      console.log("Failed to send the request to Google", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <p>Thank you for signing up!</p>;
  }

  return (
    <form
      className="max-w-md space-y-6"
      onChange={() => {
        if (dirty) return;

        setDirty(true);
        sendGTMEvent({ event: "signup_form_start" });
      }}
      onSubmit={handleSubmit}
      ref={form}
    >
      <div className="space-y-4">
        <fieldset className="flex flex-col gap-1 items-stretch">
          <label className="font-medium text-gray-800" htmlFor="name">
            Name
          </label>
          <input
            className="border border-gray-300 font-medium rounded-lg shadow-sm px-4 py-1.5 text-gray-800"
            name="name"
            id="name"
            required
            type="text"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-1 items-stretch">
          <label className="font-medium text-gray-800" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-300 font-medium rounded-lg shadow-sm px-4 py-1.5 text-gray-800"
            name="email"
            id="email"
            required
            type="email"
          />
        </fieldset>
      </div>
      <button
        className="border border-gray-300 font-medium rounded-lg shadow-sm px-4 py-1.5 text-gray-800"
        disabled={submitting}
      >
        Submit
      </button>
    </form>
  );
}

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl tracking-tight">Welcome to Protocol</h1>
      {open ? (
        <Form />
      ) : (
        <button
          className="border border-gray-300 font-medium rounded-lg shadow-sm px-4 py-1.5 text-gray-800"
          onClick={() => {
            setOpen(true);
            sendGTMEvent({ event: "signup_click" });
          }}
        >
          Signup
        </button>
      )}
    </div>
  );
}
