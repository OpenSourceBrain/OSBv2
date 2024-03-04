import { OSBApplication, OSBApplications as OSBAllApplications } from "./types/workspace";

declare var window: any;

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getBaseDomain() {
  if (window.APP_DOMAIN) {
    // Dev
    return window.APP_DOMAIN;
  }
  return window.location.host.replace("www.", ""); // remove the first part of the hostname
}

export function getApplicationDomain(app: OSBApplication) {
  if (window.location.host.includes("localhost")) {
    // Dev
    return null;
  }
  return `${app.subdomain}.${getBaseDomain()}`
}


export function getNotebooksNamedServerLink() {
  // Wouldn't work for localhost
  if (window.location.host.includes("localhost")) {
    return null;
  }
  return `//${OSBAllApplications.jupyter.subdomain}.${getBaseDomain()}/hub/home`
}

export function getCleanPath(path: string) {
  const pathParts = path.split("/")
  if (pathParts[pathParts.length - 1] === "") {
    pathParts.pop()
  }
  return pathParts
}

export async function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const fileReader: FileReader = new FileReader();

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = reject;

    fileReader.readAsArrayBuffer(file);
  });
}