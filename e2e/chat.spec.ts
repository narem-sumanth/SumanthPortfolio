import { test, expect } from "@playwright/test";

test("visitor can send a message and receive a reply", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open AI chat" }).click();
  // Scoped to the slide-over panel — the homepage hero has its own, separate
  // textarea (the live "ask" control) that is always present on the page.
  const panel = page.getByRole("dialog");
  await panel.locator("textarea").fill("Tell me about your experience");
  await panel.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByTestId("chat-message-user").last()).toHaveText("Tell me about your experience");

  // The footer row (clear-chat button) only renders once the reply has finished streaming.
  await expect(panel.getByRole("button", { name: "Clear chat" })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("chat-message-assistant").last()).toContainText(/\S/);
});
