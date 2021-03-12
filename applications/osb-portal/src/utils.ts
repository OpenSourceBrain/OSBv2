export function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
}

export function getBaseDomain() {
    return window.location.host.includes('www.') ? window.location.host.split('.').slice(1).join('.') : window.location.host  // remove the first part of the hostname
}