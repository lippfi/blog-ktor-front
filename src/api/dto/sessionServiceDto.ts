export interface RefreshRequest {
    refreshToken: string;
}

export interface DeviceSessionDto {
    id: string;
    deviceName: string;
    location: string;
    firstSeen: string;
    lastSeen: string;
    isMobile: boolean;
    isCurrent: boolean;
}
