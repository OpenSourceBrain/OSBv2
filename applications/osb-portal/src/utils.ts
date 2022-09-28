declare var window: any;

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getBaseDomain() {
  if (window.process && window.process?.env?.DOMAIN) {
    // Dev
    return window.process.env.DOMAIN;
  }
  return window.location.host.includes("www.")
    ? window.location.host.split(".").slice(1).join(".")
    : window.location.host; // remove the first part of the hostname
}
