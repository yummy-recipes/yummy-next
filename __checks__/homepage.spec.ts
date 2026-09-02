import { expect, test } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  const response = await page.goto("https://kuchnia-yummy.pl/");

  expect(response?.status()).toBeLessThan(400);
  await expect(
    page.getByRole("heading", { name: "Przepisy kulinarne" }),
  ).toBeVisible();
});
