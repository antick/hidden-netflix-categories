import { siteOrigin } from "./site-origin.mjs";

export const site = {
  name: "Categories for Netflix (Unofficial)",
  shortName: "Categories for Netflix",
  url: siteOrigin,
  title: "Categories for Netflix: every hidden genre code, one click away",
  description:
    "A free, open-source Chrome extension for searching Netflix's hidden categories and secret genre codes. Save favorites, hide what you don't watch, and open any genre in one click.",
  install:
    "https://chromewebstore.google.com/detail/categories-for-netflix-un/dhmkkdcngbedlfggdpdnoahebcdnmdlj",
  repository: "https://github.com/antick/hidden-netflix-categories",
  issues: "https://github.com/antick/hidden-netflix-categories/issues",
  license:
    "https://github.com/antick/hidden-netflix-categories/blob/main/LICENSE",
  potion: "https://potion.sh",
};

export const navigation = [
  { label: "Codes", href: "/codes" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Privacy", href: "/#privacy" },
  { label: "Questions", href: "/#questions" },
];

export const searchSuggestions = [
  "zombie",
  "anime",
  "christmas",
  "spy",
  "cult",
  "90-minute",
  "stand-up",
  "cyberpunk",
];

export const features = [
  {
    number: "01",
    label: "Search",
    title: "Search names or codes",
    description:
      'Type "zombie" or "1515" and the matching genres appear as you type. The whole catalog ships inside the extension.',
  },
  {
    number: "02",
    label: "Save",
    title: "Favorites, recents, hidden",
    description:
      "Star the genres you come back to, hide the ones you never watch, and find your last ten picks in one place.",
  },
  {
    number: "03",
    label: "Open",
    title: "One click to Netflix",
    description:
      "Open a genre in the current tab or a new one, or copy its code or link to share with someone.",
  },
  {
    number: "04",
    label: "Own it",
    title: "Your lists stay local",
    description:
      "Export your settings to a file, import them on another computer, or reset everything from Options.",
  },
];

export const steps = [
  {
    title: "Add it to Chrome",
    description:
      "Install from the Chrome Web Store and pin it to your toolbar.",
  },
  {
    title: "Find a genre",
    description:
      "Browse 24 groups or search by name or code. Nothing is fetched while you search.",
  },
  {
    title: "Start watching",
    description:
      "Open the genre on Netflix, signed in as usual. What you see depends on your region.",
  },
];

export const questions = [
  {
    question: "What are Netflix genre codes?",
    answer:
      "Netflix groups titles into thousands of small categories, like Campy Zombie Movies or Feel-good Spy Movies. Each one has a number. Visiting netflix.com/browse/genre/ followed by that number opens the category directly, even if it never shows up on your home screen.",
  },
  {
    question: "Is this made by Netflix?",
    answer:
      "No. Categories for Netflix is an independent, open-source project. It is not affiliated with, endorsed by, or sponsored by Netflix.",
  },
  {
    question: "Why is a category empty or missing titles?",
    answer:
      "Netflix's catalog changes by country and over time, so a code that is full in one region can be empty in another. The extension does not unlock titles or change your region.",
  },
  {
    question: "What does the extension have access to?",
    answer:
      "Only Chrome's storage permission, used to keep your favorites, hidden genres, recents, and theme in your browser. It does not read Netflix pages, cookies, your account, or your browsing history.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "No. It is free and licensed under GPLv3. The source code is on GitHub, and you can build the same package yourself.",
  },
];
