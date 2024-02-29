import puppeteer from "puppeteer";
import { FLEA_PRICES_PAGE } from "../constants";
import { Browser } from "puppeteer";
import { ElementHandle } from "puppeteer";

export default async function scrapeFlea() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(FLEA_PRICES_PAGE);
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // Observe when lazy loading is loaded
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const targetNode = document.getElementsByClassName("cards-list")[0];
      const options = {
        childList: true,
      };

      const callback = (
        mutationList: MutationRecord[],
        observer: MutationObserver
      ) => {
        for (let mutation of mutationList) {
          if (mutation.addedNodes.length > 0) {
            document.getElementsByClassName("load-more")[0].scrollIntoView();
            timeoutId = observerTimeout(observer, timeoutId!);
          }
        }
      };

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, options);

      let timeoutId: NodeJS.Timeout = observerTimeout(observer);

      // Trigger lazy load more
      let loadButton: HTMLElement = document.querySelector(
        "div.page-content > div > button"
      )!;
      loadButton.scrollIntoView();
      loadButton.click();

      const infiniteScrollTrigger = setInterval(async () => {
        window.scrollBy(0, -250);

        await new Promise((resolve) => setTimeout(resolve, 250));

        window.scrollBy(0, 10000);
      }, 1000);

      function observerTimeout(
        observer: MutationObserver,
        timeoutId?: NodeJS.Timeout
      ): NodeJS.Timeout {
        if (timeoutId != undefined) clearTimeout(timeoutId);

        return setTimeout(() => {
          observer.disconnect();
          clearInterval(infiniteScrollTrigger);
          resolve();
        }, 10000);
      }
    });
  });

  browser.close();
}

function processCardItems(cardsList: ElementHandle<Element> | null) {

}