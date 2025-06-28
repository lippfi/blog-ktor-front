import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAvatars } from "@/api/userService.ts"
import { reactionClient } from "@/api/postClient/reactionClient.ts"
import type { ReactionPackDto } from "@/api/dto/reactionServiceDto.ts"
import type { BasicReactionResponse } from "@/api/reactionService.ts"

export const useReactionsStore = defineStore('reactions', () => {
  // State
  const avatars = ref<string[]>([])
  const basicReactions = ref<ReactionPackDto[]>([])
  const recentReactions = ref<BasicReactionResponse[]>([])

  // Actions
  const loadAvatars = async () => {
    const avatarsResponse = await getAvatars()
    avatars.value = Object.values(avatarsResponse)
    console.log('Avatars loaded:', avatars.value)
    return avatars.value
  }

  const loadBasicReactions = async () => {
    const basicReactionsResponse = await reactionClient.getBasicReactions()
    if (basicReactionsResponse.type === 'ok') {
      basicReactions.value = Array.isArray(basicReactionsResponse.data)
        ? basicReactionsResponse.data
        : [basicReactionsResponse.data]
      return basicReactions.value
    } else {
      console.error('Failed to load basic reactions:', basicReactionsResponse.message)
      return []
    }
  }

  const loadRecentReactions = async (limit = 60) => {
    const recentReactionsResponse = await reactionClient.getRecentReactions(limit)
    if (recentReactionsResponse.type === 'ok') {
      recentReactions.value = Array.isArray(recentReactionsResponse.data)
        ? recentReactionsResponse.data
        : [recentReactionsResponse.data]
      return recentReactions.value
    } else {
      console.error('Failed to load recent reactions:', recentReactionsResponse.message)
      return []
    }
  }

  const addReaction = (reaction: BasicReactionResponse) => {
    const existingIndex = recentReactions.value.findIndex(r => r.name === reaction.name)
    if (existingIndex !== -1) {
      recentReactions.value.splice(existingIndex, 1)
    }
    recentReactions.value.unshift(reaction)
  }

  return {
    // State
    avatars,
    basicReactions,
    recentReactions,
    
    // Actions
    loadAvatars,
    loadBasicReactions,
    loadRecentReactions,
    addReaction
  }
})