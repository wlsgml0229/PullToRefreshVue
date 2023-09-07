<template>
  <PullToRefresh :loading="loading" @refresh="refreshHandler">
    <div style="background: pink; height: 800px;"></div>
  </PullToRefresh>
</template>

<script>
import PullToRefresh from './components/PullToRefresh.vue';
export default {
  name: 'App',
  components: {
    PullToRefresh
},
  data() {
    return {
      loading: false
    }
  },
  methods: {
    refreshHandler() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      },2000)
    }
  }
}
</script>

