export function getDateTimeString(localDateTime: String) {
    const creationDate = new Date(localDateTime);
    const now = new Date();
    const diffHours = (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60);

    const time = creationDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (diffHours > 24) {
        return `${time} ${creationDate.toLocaleDateString(undefined)}`
    } else {
        return time
    }
}
