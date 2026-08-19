"use client";

import React, { useState } from "react";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  location: "",
  message: "",
};

/**
 * Reusable contact form for COES-WIO, COESSING, and Global Ocean Corps.
 *
 *   <ContactForm siteName="COES-WIO" siteLink="https://coeswio.org" imageLink="/photo.jpg" />
 *   <ContactForm siteName="COESSING" siteLink="https://coessing.org" />
 */
export default function ContactForm({
  siteName = "COES-WIO",
  siteLink = "https://coeswio.org",
  imageLink = "",
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const hasImage = Boolean(imageLink);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, siteName, siteLink }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }

      setForm(EMPTY_FORM);
      setStatus("sent");
      setFeedback("Thank you. Your message has been sent.");
    } catch (error) {
      setStatus("error");
      setFeedback(error.message || "Something went wrong. Please try again.");
    }
  };

  const fieldClassName =
    "w-full border border-white/35 bg-transparent px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/45 focus:border-white";

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden text-white"
    >
      {/* Blurred background image */}
      {hasImage && (
        <>
          <img
            src={imageLink}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover scale-105"
          />
          {/* Dark + blur overlay so form stays readable */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        </>
      )}

      {/* Form content — sits above the blurred bg */}
      <div className="relative z-10 px-4 py-16 md:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-3">
          <h2 className="m-0 text-3xl font-semibold md:!text-[4em] text-white">
            Contact us
          </h2>
          <p className="m-0 max-w-md text-sm leading-relaxed text-white/80">
            Send a message and we will get back to you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-2 grid w-full grid-cols-1 gap-3 text-left md:grid-cols-2"
          >
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={fieldClassName}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={fieldClassName}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Phone</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={fieldClassName}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">Location</span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                autoComplete="address-level2"
                className={fieldClassName}
              />
            </label>

            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-medium">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className={`${fieldClassName} min-h-[110px] resize-y`}
              />
            </label>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="primary_button px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 !text-white"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
              {feedback ? (
                <p
                  className={`m-0 text-sm ${
                    status === "error" ? "text-red-400" : "text-white/80"
                  }`}
                >
                  {feedback}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
