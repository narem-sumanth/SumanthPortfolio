import { test, expect } from "@playwright/test";

test("visitor can reach the contact form and submit a message", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open AI chat" }).click();
  // Scoped to the slide-over panel — the homepage hero has its own, separate
  // textarea (the live "ask" control) that is always present on the page.
  const panel = page.getByRole("dialog");
  await panel.locator("textarea").fill("How can I contact you?");
  await panel.getByRole("button", { name: "Send message" }).click();

  const contactForm = page.locator("form");
  await expect(contactForm.getByLabel("Your name")).toBeVisible({ timeout: 20_000 });

  await contactForm.getByLabel("Your name").fill("Ada Lovelace");
  await contactForm.getByLabel("Your email").fill("ada@example.com");
  await contactForm.getByLabel("Your message").fill("Loved your portfolio, let's talk!");
  await contactForm.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Message sent.")).toBeVisible();
});
