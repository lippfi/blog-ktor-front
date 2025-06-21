<script setup lang="ts">
import {getCurrentUserLogin, getCurrentUserNickname} from "@/api/userService.ts"
import { ref, watch } from 'vue'
import {useI18n} from "vue-i18n";
import type { Reaction as ReactionModel } from '@/models/posts/post.ts'
import {reactionClient} from "@/api/postClient/reactionClient.ts";

const { t } = useI18n()

const props = defineProps<{
  reaction: ReactionModel
  postLogin?: string,
  postUri?: string,
  commentId?: string,
  type: 'post' | 'comment'
}>()

const emit = defineEmits<{
  (e: 'update'): void
  (e: 'remove'): void
}>()

const localReaction = ref<ReactionModel>({
  ...props.reaction,
  userNicknames: [...props.reaction.userNicknames]
})

// Keep localReaction in sync with props.reaction
watch(() => props.reaction, (newReaction) => {
  localReaction.value = {
    ...newReaction,
    userNicknames: [...newReaction.userNicknames]
  }
}, { deep: true })

async function toggleReaction() {
  // Update UI immediately
  localReaction.value.userReacted = !localReaction.value.userReacted

  // Update userNicknames list
  const userNickname = await getCurrentUserNickname()
  const index = localReaction.value.userNicknames.indexOf(userNickname)
  if (localReaction.value.userReacted && index === -1) {
    localReaction.value.userNicknames.push(userNickname)
    localReaction.value.count += 1
  } else if (!localReaction.value.userReacted && index !== -1) {
    localReaction.value.userNicknames.splice(index, 1)
    localReaction.value.count -= 1

    if (localReaction.value.count === 0) {
      emit('remove')
      return
    }
  }

  // Send request in background
  try {
    if (props.type === 'post') {
      if (!props.postLogin || !props.postUri) {
        throw new Error('PostComponent login and URI are required for post reactions')
      }
      if (localReaction.value.userReacted) {
        await reactionClient.addPostReaction(props.postLogin, props.postUri, props.reaction.name)
      } else {
        await reactionClient.removePostReaction(props.postLogin, props.postUri, props.reaction.name)
      }
    } else {
      if (!props.commentId) {
        throw new Error('CommentComponent ID is required for comment reactions')
      }
      if (localReaction.value.userReacted) {
        await reactionClient.addCommentReaction(props.commentId, props.reaction.name)
      } else {
        await reactionClient.removeCommentReaction(props.commentId, props.reaction.name)
      }
    }
  } catch (error) {
    console.error('Error sending reaction update:', error)
  }
}
</script>

<template>
  <el-popover
      placement="top"
      :width="300"
      show-after="250"
      trigger="hover"
  >
    <template #reference>
      <div class="clickable" @click="toggleReaction">
        <el-tag round size="default" :type="localReaction.userReacted ? 'primary' : 'info'" :effect="localReaction.userReacted ? '' : 'plain'">
          <div class="reaction">
            <img :src="localReaction.iconUri" :alt="localReaction.name">
            <span style="padding-left: 5px;">
              {{ localReaction.count }}
            </span>
          </div>
        </el-tag>
      </div>
    </template>
    <div class="reaction-info">
      <img :src="localReaction.iconUri" :alt="localReaction.name">
      <div>
        <span class="reaction-name">{{ localReaction.name }}</span><br>
        {{ localReaction.userNicknames.join(', ') }}
        <span v-if="localReaction.anonymousCount > 0" class="anonymous-count">
        {{$t('reactions.reaction.anonymous') + localReaction.anonymousCount }}
      </span>
      </div>
    </div>
  </el-popover>
</template>


<style scoped>
.clickable {
  cursor: pointer;
}

.clickable:hover .el-tag {
  border: 1px solid #808080;
  transition: border-color 0.3s;
}

.reaction {
  display: flex;
  align-items: center;
}

.el-popper__reference-wrapper {
  cursor: pointer !important;
}

.reaction > img {
  height: 1.7em;
}

.reaction-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: 'JetBrains Mono', monospace;
}

.reaction-info > img {
  width: 48px;
  padding: 5px 15px 5px 0;
}

.reaction-name {
  margin: 0 auto;
  font-weight: bold;
}

.user-list {
  font-size: 0.9em;
}

.anonymous-count {
  color: #666;
}
</style>