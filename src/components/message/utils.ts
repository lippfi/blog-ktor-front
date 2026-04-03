import { formatInstant, formatInstantDateOnly } from '@/utils/dateTime';

export function getDateTimeString(instant: string) {
    const date = new Date(instant);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffHours > 24) {
        return formatInstantDateOnly(instant);
    } else {
        return formatInstant(instant);
    }
}
