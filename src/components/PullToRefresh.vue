<template>
  <div class='pull-to-refresh-wrapper' :class="{ 'loading-wrapper': isRefresh }">
    <div
      class='pull-to-refresh-container'
      ref='pullToRefreshContainer'
      @touchstart='handleTouchStart'
      @touchmove='handleTouchMove'
      @touchend='handleTouchEnd'
      :style='`transform: translateY(${this.refreshHeight}px)`'
    >
      <div class='refresh-box' :style='{color: color}'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' :fill='color'
             class='bi bi-arrow-clockwise refresh-indicator' viewBox='0 0 16 16' :class='{ loading: isRefresh }'
             :style='{ transform: `rotate(${refreshIndicatorRotation}deg)` }'>
          <path fill-rule='evenodd' d='M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z' />
          <path
            d='M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z' />
        </svg>
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
      isRefresh: false
    };
  },
  emits: ['refresh'],
  props: {
    color: {
      type: String,
      default: '#222'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden';
    window.pulltorefresh = false;
  },
  watch: {
    loading(val) {
      if (this.isRefresh && !val) {
        setTimeout(() => {
          return this.animationHeight(0);
        }, 1000);
      }
    }
  },
  methods: {
    checkScrollTop() {
      return this.$refs.pullToRefreshContainer.scrollTop <= 10;
    },
    blockingPullStatus() {
      return !this.checkScrollTop() || this.loading;
    },
    handleTouchStart(event) {
      if (this.blockingPullStatus()) return;
      this.startY = event.touches[0].clientY;
    },
    handleTouchMove(event) {
      if (this.blockingPullStatus()) return;
      this.doRefresh(event);
    },
    handleTouchEnd(event) {
      if (!this.checkScrollTop() || this.isRefresh) return;
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
    }
  }

};
</script>
<style scoped>
.pull-to-refresh-wrapper {
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

.loading-wrapper {
  pointer-events: none;
}

.pull-to-refresh-container {
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  height: calc(100vh + 90px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  left: 0;
  top: -90px;
  width: 100%;
}

.refresh-box {
  box-sizing: border-box;
  scroll-behavior: smooth;
  height: 90px;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  max-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  flex-direction: column;
}

.refresh-indicator {
  margin-bottom: 8px;
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