var localAddrs = ["localhost", "127.0.0.1", ""];

// make sure we don't activate google analytics if the developer is
// inspecting the book locally...
if (localAddrs.indexOf(document.location.hostname) === -1) {

    let script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-L0N9LPFQ32";
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-L0N9LPFQ32');
}

// Cookbook Onboard integration

// The API Key is public, so we could just hardcode it here.
const COOKBOOK_PUBLIC_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmIzZTI0YTU1N2UxOGI0Yjk2MTE0ODYiLCJpYXQiOjE3MjMwNjQ5MDYsImV4cCI6MjAzODY0MDkwNn0.40K0d6-uER66iUF96Zm6l4f2PDpDPjuztJRpZ43QhV4';
function initCookbook() {
  let element = document.getElementById('__cookbook');
  if (!element) {
    element = document.createElement('div');
    element.id = '__cookbook';
    element.dataset.apiKey = COOKBOOK_PUBLIC_API_KEY;
    document.body.appendChild(element);
  }
  let script = document.getElementById('__cookbook-script');
  if (!script) {
    script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@cookbookdev/docsbot/dist/standalone/index.cjs.js';
    script.id = '__cookbook-script';
    script.defer = true;
    document.body.appendChild(script);
  }
};
initCookbook();
