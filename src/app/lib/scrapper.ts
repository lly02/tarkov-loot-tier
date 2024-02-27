import puppeteer from "puppeteer";
import type { Page } from "puppeteer";
import { FLEA_PRICES_PAGE } from "../constants";

export default async function scrapeFlea() {
  const browser = await puppeteer.launch({ headless: "shell" });

  const page = await browser.newPage();
  await page.goto(FLEA_PRICES_PAGE);

  await browser.close();
}
