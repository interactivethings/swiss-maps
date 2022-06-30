export function domDataUrlDownload(dataURL: string, name: string) {
  const dl = document.createElement("a");
  document.body.appendChild(dl); // This line makes it work in Firefox.
  dl.setAttribute("href", dataURL);
  dl.setAttribute("download", name);
  dl.click();
  dl.remove();
}
