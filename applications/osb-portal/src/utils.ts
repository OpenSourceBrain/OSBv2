import { OSBApplication, OSBApplications as OSBAllApplications } from "./types/workspace";

declare let window: any;

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface NamedUser {
  firstName?: string;
  lastName?: string;
  username?: string;
}

/**
 * Returns a human readable name for a user, falling back to the username when
 * the first/last name are not available. Since the move from keycloak-js to the
 * cookie based authentication, the user object may not always be fully
 * populated, so we must not assume firstName/lastName are present.
 */
export function getUserName(user?: NamedUser): string {
  if (!user) {
    return "";
  }
  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || user.username || "";
}

/**
 * Returns the initials for a user's avatar, falling back to the first letter of
 * the username when no first/last name are available.
 */
export function getUserInitials(user?: NamedUser): string {
  if (!user) {
    return "";
  }
  const initials =
    (user.firstName?.charAt(0) || "") + (user.lastName?.charAt(0) || "");
  return (initials || user.username?.charAt(0) || "").toUpperCase();
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