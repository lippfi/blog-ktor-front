import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useScrollSync(
  contentRef: Ref<HTMLElement | null>,
  categoryIds: Ref<string[]>,
) {
  const activeCategoryId = ref('')
  let observer: IntersectionObserver | null = null
  const visibleSections = new Map<string, IntersectionObserverEntry>()

  function updateActiveCategory() {
    let topMost: string | null = null
    let topMostTop = Infinity

    for (const [id, entry] of visibleSections) {
      if (entry.isIntersecting && entry.boundingClientRect.top < topMostTop) {
        topMostTop = entry.boundingClientRect.top
        topMost = id
      }
    }

    if (topMost) {
      activeCategoryId.value = topMost
    }
  }

  function setupObserver() {
    cleanupObserver()

    const root = contentRef.value
    if (!root) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.categoryId
          if (!id) continue

          if (entry.isIntersecting) {
            visibleSections.set(id, entry)
          } else {
            visibleSections.delete(id)
          }
        }
        updateActiveCategory()
      },
      {
        root,
        rootMargin: '0px 0px -80% 0px',
        threshold: 0,
      },
    )

    for (const id of categoryIds.value) {
      const el = root.querySelector(`[data-category-id="${id}"]`)
      if (el) observer.observe(el)
    }

  }

  function cleanupObserver() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    visibleSections.clear()
  }

  function scrollToCategory(categoryId: string) {
    const root = contentRef.value
    if (!root) return

    const el = root.querySelector(`[data-category-id="${categoryId}"]`) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      activeCategoryId.value = categoryId
    }
  }

  onMounted(() => {
    setupObserver()
  })

  onBeforeUnmount(() => {
    cleanupObserver()
  })

  return {
    activeCategoryId,
    scrollToCategory,
    setupObserver,
  }
}
