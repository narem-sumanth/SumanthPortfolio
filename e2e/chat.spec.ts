import { test, expect } from "@playwright/test";

test("visitor can send a message and receive a reply", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open AI chat" }).click();
  await page.locator("textarea").fill("Tell me about your experience");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByTestId("chat-message-user").last()).toHaveText("Tell me about your experience");

  // The footer row (clear-chat button) only renders once the reply has finished streaming.
  await expect(page.getByRole("button", { name: "Clear chat" })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByTestId("chat-message-assistant").last()).toContainText(/\S/);
});
