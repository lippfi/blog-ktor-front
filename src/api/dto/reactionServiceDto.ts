export interface ReactionViewDto {
    name: string,
    iconUri: string,
}

export interface ReactionPackDto {
    iconUri: String,
    reactions: ReactionViewDto[],
}
