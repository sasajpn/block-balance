// @ts-nocheck

links.forEach((link, index) => {
  const url = link.href;
  const match = url.match(/([^\/]+\.svg)$/);
  if (match) {
    const fileName = match[1];
    downloadFile(url, fileName);
  }
});

function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const links = Array.from(document.querySelectorAll("td a"));
