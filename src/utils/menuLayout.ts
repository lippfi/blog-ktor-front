export function getMenuTopOffset(headerHeight: number, scrollY: number): number {
    return Math.max(0, headerHeight - scrollY);
}

type ViewportMetrics = {
    height: number;
    offsetTop: number;
};

export function getViewportMetrics(windowObject: Window): ViewportMetrics {
    const visualViewport = windowObject.visualViewport;

    if (!visualViewport) {
        return {
            height: windowObject.innerHeight,
            offsetTop: 0,
        };
    }

    return {
        height: visualViewport.height,
        offsetTop: visualViewport.offsetTop,
    };
}

export function getRightMenuStyle(menuTopOffset: number, viewportHeight: number, viewportOffsetTop = 0): Record<string, string> {
    const safeMenuTop = Math.max(0, menuTopOffset + viewportOffsetTop);
    const safeMenuHeight = Math.max(0, viewportHeight - menuTopOffset);

    return {
        top: `${safeMenuTop}px`,
        height: `${safeMenuHeight}px`,
    };
}