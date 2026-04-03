const SESSION_INFO_KEY = 'sessionInfo';

function getSessionTimezone(): string | undefined {
    try {
        const raw = localStorage.getItem(SESSION_INFO_KEY);
        if (raw) {
            const sessionInfo = JSON.parse(raw);
            return sessionInfo.timezone;
        }
    } catch {
        // ignore
    }
    return undefined;
}

export function formatInstant(instant: string): string {
    const date = new Date(instant);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    const timezone = getSessionTimezone() ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    const time = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    });

    if (diffHours > 24) {
        const dateStr = date.toLocaleDateString(undefined, { timeZone: timezone });
        return `${time} ${dateStr}`;
    } else {
        return time;
    }
}

export function formatInstantDateOnly(instant: string): string {
    const date = new Date(instant);
    const timezone = getSessionTimezone() ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    return date.toLocaleDateString(undefined, { timeZone: timezone });
}
