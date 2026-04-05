export function getMenuTopOffset(headerHeight: number, scrollY: number): number {
    const safeScrollY = Math.max(0, scrollY);
    return Math.max(0, headerHeight - safeScrollY);
}

export function getRightMenuStyle(menuTopOffset: number): Record<string, string> {
    const safeMenuTop = Math.max(0, menuTopOffset);

    return {
        paddingTop: `${safeMenuTop}px`,
    };
}