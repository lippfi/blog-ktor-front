<script setup lang="ts">
import type { Reaction as ReactionModel} from '@/models/posts/post.ts'
import type { BasicReactionResponse } from '@/api/reactionService.ts'
import { addPostReaction, addCommentReaction } from '@/api/reactionService.ts'
import { getCurrentUserNickname } from '@/api/userService.ts'
import Reaction from '@/components/Reaction.vue'
import AddReaction from '@/components/post/reaction/AddReaction.vue'
import {ref, watch} from 'vue'

const props = defineProps<{
  reactions: ReactionModel[],
  isReactable: boolean,
  type: 'post' | 'comment',
  postLogin?: string,
  postUri?: string,
  commentId?: string,
}>()

const localReactions = ref<ReactionModel[]>([...props.reactions])

// Keep localReactions in sync with props
watch(() => props.reactions, (newReactions) => {
  localReactions.value = [...newReactions]
})

function handleReactionRemove(reactionToRemove: ReactionModel) {
  const index = localReactions.value.findIndex(r => r.name === reactionToRemove.name)
  if (index !== -1) {
    localReactions.value.splice(index, 1)
  }
}

async function handleReactionSelect(reaction: BasicReactionResponse) {
  // Check if reaction already exists
  const existingReaction = localReactions.value.find(r => r.name === reaction.name)

  if (existingReaction) {
    // If already reacted, do nothing
    if (existingReaction.userReacted) {
      return
    }

    // Update existing reaction
    existingReaction.userReacted = true
    existingReaction.userNicknames.push(await getCurrentUserNickname())
    existingReaction.count++

    // Send request in background
    try {
      if (props.type === 'post') {
        if (!props.postLogin || !props.postUri) {
          throw new Error('Post login and URI are required for post reactions')
        }
        addPostReaction(props.postLogin, props.postUri, existingReaction.name)
      } else {
        if (!props.commentId) {
          throw new Error('Comment ID is required for comment reactions')
        }
        addCommentReaction(props.commentId, existingReaction.name)
      }
    } catch (error) {
      console.error('Error sending reaction update:', error)
      // Revert UI changes on error
      existingReaction.userReacted = false
      existingReaction.userNicknames.pop()
      existingReaction.count--
    }
    return
  }

  // Create new reaction if it doesn't exist
  const newReaction: ReactionModel = {
    name: reaction.name,
    iconUri: reaction.iconUri,
    count: 1,
    anonymousCount: 0,
    userNicknames: [await getCurrentUserNickname()],
    userReacted: true,
  }

  // Add to local reactions and send request in background
  localReactions.value.push(newReaction)
  try {
    if (props.type === 'post') {
      if (!props.postLogin || !props.postUri) {
        throw new Error('Post login and URI are required for post reactions')
      }
      addPostReaction(props.postLogin, props.postUri, newReaction.name)
    } else {
      if (!props.commentId) {
        throw new Error('Comment ID is required for comment reactions')
      }
      addCommentReaction(props.commentId, newReaction.name)
    }
  } catch (error) {
    console.error('Error sending reaction update:', error)
    // Revert UI changes on error
    localReactions.value.pop()
  }
}
</script>

<template>
  <div v-if="isReactable || reactions.length > 0" style="display: flex; align-items: center;">
    <template v-for="(reaction, index) in localReactions" :key="reaction.name">
      <Reaction 
        :reaction="reaction"
        :type="type"
        :post-login="type === 'post' ? postLogin : undefined"
        :post-uri="type === 'post' ? postUri : undefined"
        :comment-id="type === 'comment' ? commentId : undefined"
        @remove="() => handleReactionRemove(reaction)"
      />
      <div v-if="index < localReactions.length - 1 || isReactable" style="width: 5px"/>
    </template>
    <AddReaction v-if="isReactable" @reaction-selected="handleReactionSelect"/>
  </div>
</template>

<style scoped>
</style>
