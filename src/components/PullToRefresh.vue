<template>
  <div class="pull-to-refresh-wrapper" :class="{ 'loading-wrapper': isRefresh }">
    <div
        class="pull-to-refresh-container"
        ref="pullToRefreshContainer"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        :style="`transform: translateY(${this.refreshHegiht}px)`"
    >
      <div class="refresh-box">
        <div
            class="refresh-indicator"
            :class="{ loading: isRefresh }"
            :style="{ transform: `rotate(${refreshIndicatorRotation}deg)` }"
        ></div>
        {{ isRefresh ? '업데이트 중입니다' : '당겨서 업데이트' }}
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      startY: 0,
      refreshIndicatorRotation: 0,
      refreshHegiht: 0,
      isRefresh: false,
    };
  },
  emits: ['refresh'],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    loading(val) {
      if (this.isRefresh && !val) {
        setTimeout(() => {
          return this.animationHeight(0);
        }, 1000);
      }
    },
  },
  methods: {
    checkScrollTop() {
      return this.$refs.pullToRefreshContainer.scrollTop <= 0;
    },
    blockingPullStatus() {
      return !this.checkScrollTop() || this.loading;
    },
    handleTouchStart(event) {
      if (this.blockingPullStatus()) return;
      this.startY = event.touches[0].clientY;
    },
    handleTouchMove(event) {
      if (this.blockingPullStatus()) return
      this.doRefresh(event);
    },
    handleTouchEnd(event) {
      if (this.blockingPullStatus()) return;
      const deltaY = event.changedTouches[0].clientY - this.startY;
      //높이 90이상당기고 스크롤탑이 0일떄
      if (deltaY >= 90) {
        this.$emit('refresh');
        this.isRefresh = true;
        document.body.style.overflow = 'hidden';
        this.animationHeight(90);
      } else {
        this.animationHeight(0);
      }
      this.refreshIndicatorRotation = 0;
    },
    doRefresh(event) {
      const deltaY = Math.min(event.touches[0].clientY - this.startY, 150);
      if (deltaY < 0) return;
      this.refreshHegiht = deltaY;
      this.refreshIndicatorRotation = deltaY * 2;
    },
    animationHeight(targetHeight) {
      if (this.blockingPullStatus()) return;
      const startTime = performance.now();
      const startHeight = this.refreshHegiht;
      const animationDuration = 450;
      let animationFrameId;
      const animateHeight = (timestamp) => {
        const elapsedTime = timestamp - startTime;
        if (elapsedTime < animationDuration) {
          this.refreshHegiht = Math.max(
              targetHeight,
              startHeight - (startHeight / animationDuration) * elapsedTime
          );
          animationFrameId = requestAnimationFrame(animateHeight);
        } else {
          this.refreshHegiht = targetHeight;
          if (this.refreshHegiht === 0) {
            document.body.style.overflow = 'auto';
            this.isRefresh = false;
          }
        }
      };

      animationFrameId = requestAnimationFrame(animateHeight);
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    },
  },
  mounted() {
    window.pulltorefresh = false;
  },
};
</script>
<style scoped>
/* .pull-to-refresh-wrapper */
.pull-to-refresh-wrapper {
  scroll-behavior: smooth;
  width: 100%;
  height: 100vh;
}
.loading-wrapper {
  pointer-events: none;
}

/* .pull-to-refresh-container */
.pull-to-refresh-container {
  scroll-behavior: smooth;
  overflow: hidden;
  overscroll-behavior: contain;
  height: calc(100vh + 90px);
  overflow-y: auto;
  position: relative;
  left: 0;
  top: -90px;
  width: 100%;
}

/* .refresh-box */
.refresh-box {
  height: 90px;
  gap: 0.8rem;
  overflow: hidden;
  position: relative;
  top: 0;
  left: 0;
  overscroll-behavior: contain;
  width: 100%;
  max-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  color: #8b8b8b;
  flex-direction: column;
}

/* .refresh-indicator */
.refresh-indicator {
  background-color: transparent;
  background-image: url('@/assets/logo.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% auto;
  width: 2.4rem;
  height: 2.4rem;
  margin-bottom: 0.8rem;
}

.refresh-indicator.loading {
  animation: spin 1.5s infinite linear;
}

/* @keyframes spin */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>