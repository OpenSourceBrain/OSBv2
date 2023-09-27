import { OSBApplication } from "./types/workspace";

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
