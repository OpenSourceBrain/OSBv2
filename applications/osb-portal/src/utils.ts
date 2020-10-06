export function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
}