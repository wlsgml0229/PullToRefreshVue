<template>
  <div class="pull-to-refresh-wrapper" :class="{ 'loading-wrapper': isRefresh }">
    <div
        class="pull-to-refresh-container"
        ref="pullToRefreshContainer"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        :style="`transform: translateY(${this.refreshHeight}px)`"
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
      refreshHeight: 0,
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
  mounted() {
    window.pulltorefresh = false;
  },
  watch: {
    loading(val) {
      if (this.isRefresh && !val) {
        setTimeout(() => {
          document.body.style.overflow = 'auto';
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
      if (this.isRefresh) return;
      const deltaY = event.changedTouches[0].clientY - this.startY;
      if (deltaY >= 90) {
        this.animationHeight(90);
        this.isRefresh = true;
        this.$emit('refresh');
      } else {
        this.animationHeight(0);
      }
      this.refreshIndicatorRotation = 0;
    },
    doRefresh(event) {
      // 더 당겨도 150이 최대값이 되도록 설정
      const deltaY = Math.min(event.touches[0].clientY - this.startY, 150);
      if (deltaY < 0) return;
      this.refreshHeight = deltaY;
      this.refreshIndicatorRotation = deltaY * 2;
    },
    animationHeight(targetHeight) {
      const startTime = performance.now();
      const startHeight = this.refreshHeight;
      const animationDuration = 450;
      let animationFrameId;
      const animateHeight = (timestamp) => {
        const elapsedTime = timestamp - startTime;
        // 이전 시작 시간을 비교해 애니메이션이 동작중인지 판단여부
        if (elapsedTime < animationDuration) {
          this.refreshHeight = Math.max(
              targetHeight,
              startHeight - (startHeight / animationDuration) * elapsedTime
          );
          animationFrameId = requestAnimationFrame(animateHeight);
        } else {
          this.refreshHeight = targetHeight;
          if (this.refreshHeight === 0) {
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

};
</script>
<style scoped>
/* .pull-to-refresh-wrapper */
.pull-to-refresh-wrapper {
  overflow: hidden;
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