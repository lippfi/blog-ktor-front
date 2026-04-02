import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAvatars } from "@/api/userClient"
import { getBasicReactions, getRecentReactions } from "@/api/reactionClient"
import type { ReactionPack, ReactionView } from "@/api/dto/reactionServiceDto"

export const useReactionsStore = defineStore('reactions', () => {
  // State
  const avatars = ref<string[]>([])
  const basicReactions = ref<ReactionPack[]>([])
  const recentReactions = ref<ReactionView[]>([])

  // Actions
  const loadAvatars = async () => {
    const avatarsResponse = await getAvatars()
    avatars.value = Object.values(avatarsResponse)
    console.log('Avatars loaded:', avatars.value)
    return avatars.value
  }

  const loadBasicReactions = async () => {
    try {
      const data = await getBasicReactions()
      basicReactions.value = Array.isArray(data) ? data : [data]
      return basicReactions.value
    } catch (error) {
      console.error('Failed to load basic reactions:', error)
      return []
    }
  }

  const loadRecentReactions = async (limit = 60) => {
    try {
      const data = await getRecentReactions(limit)
      recentReactions.value = Array.isArray(data) ? data : [data]
      return recentReactions.value
    } catch (error) {
      console.error('Failed to load recent reactions:', error)
      return []
    }
  }

  const addReaction = (reaction: ReactionView) => {
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
