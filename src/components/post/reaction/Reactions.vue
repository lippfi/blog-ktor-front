<script setup lang="ts">
import type { ReactionDto } from '@/api/dto/postServiceDto.ts'
import type { BasicReactionResponse } from '@/api/reactionService.ts'
import { getCurrentUserLogin, getCurrentUserNickname } from '@/api/userClient.ts'
import AddReaction from '@/components/post/reaction/AddReaction.vue'
import {ref, watch} from 'vue'
import {reactionClient} from "@/api/postClient/reactionClient.ts";
import Reaction from "@/components/Reaction.vue";
import type {ReactionPackDto} from "@/api/dto/reactionServiceDto.ts";

const props = defineProps<{
  reactions: ReactionDto[],
  isReactable: boolean,
  type: 'post' | 'comment',
  postLogin?: string,
  postUri?: string,
  commentId?: string,
  basicReactions: ReactionPackDto[],
  recentReactions: BasicReactionResponse[],
}>()

const emit = defineEmits<{
  (e: 'reaction-added', reaction: BasicReactionResponse): void
}>();

const localReactions = ref<ReactionDto[]>([...props.reactions])

// Keep localReactions in sync with props
watch(() => props.reactions, (newReactions) => {
  localReactions.value = [...newReactions]
})

async function handleReactionRemove(reactionToRemove: ReactionDto) {
  const index = localReactions.value.findIndex(r => r.name === reactionToRemove.name)
  if (index !== -1) {
    // Store the reaction before removing it from the UI
    const removedReaction = localReactions.value[index]
    // Update UI
    localReactions.value.splice(index, 1)

    try {
      // Send request to backend
      if (props.type === 'post') {
        if (!props.postLogin || !props.postUri) {
          throw new Error('Post login and URI are required for post reactions')
        }
        await reactionClient.removePostReaction(props.postLogin, props.postUri, reactionToRemove.name)
      } else {
        if (!props.commentId) {
          throw new Error('CommentComponent ID is required for comment reactions')
        }
        await reactionClient.removeCommentReaction(props.commentId, reactionToRemove.name)
      }
    } catch (error) {
      console.error('Error removing reaction:', error)
      // Revert UI changes on error
      localReactions.value.splice(index, 0, removedReaction)
    }
  }
}

async function handleReactionSelect(reaction: BasicReactionResponse) {
  emit('reaction-added', reaction)
  const existingReaction = localReactions.value.find(r => r.name === reaction.name)

  if (existingReaction) {
    const login = getCurrentUserLogin()
    if (existingReaction.users.some(u => u.login === login)) {
      return
    }

    existingReaction.users.push({ login: login!, nickname: await getCurrentUserNickname() })
    existingReaction.count++

    try {
      if (props.type === 'post') {
        if (!props.postLogin || !props.postUri) {
          throw new Error('PostComponent login and URI are required for post reactions')
        }
        await reactionClient.addPostReaction(props.postLogin, props.postUri, existingReaction.name)
      } else {
        if (!props.commentId) {
          throw new Error('CommentComponent ID is required for comment reactions')
        }
        await reactionClient.addCommentReaction(props.commentId, existingReaction.name)
      }
    } catch (error) {
      console.error('Error sending reaction update:', error)
      // Revert UI changes on error
      existingReaction.users.pop()
      existingReaction.count--
    }
    return
  }

  const login = getCurrentUserLogin()
  const newReaction: ReactionDto = {
    name: reaction.name,
    iconUri: reaction.iconUri,
    count: 1,
    anonymousCount: 0,
    users: [{ login: login!, nickname: await getCurrentUserNickname() }],
  }

  localReactions.value.push(newReaction)
  try {
    if (props.type === 'post') {
      if (!props.postLogin || !props.postUri) {
        throw new Error('PostComponent login and URI are required for post reactions')
      }
      await reactionClient.addPostReaction(props.postLogin, props.postUri, newReaction.name)
    } else {
      if (!props.commentId) {
        throw new Error('CommentComponent ID is required for comment reactions')
      }
      await reactionClient.addCommentReaction(props.commentId, newReaction.name)
    }
  } catch (error) {
    console.error('Error sending reaction update:', error)
    // Revert UI changes on error
    localReactions.value.pop()
  }
}
</script>

<template>
  <div v-if="isReactable || localReactions.length > 0" style="display: flex; align-items: center;">
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
    <AddReaction 
      v-if="isReactable" 
      :basic-reactions="basicReactions"
      :recent-reactions="recentReactions"
      @reaction-selected="handleReactionSelect"
    />
  </div>
</template>

<style scoped>
</style>
