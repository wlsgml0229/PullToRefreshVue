<template>
  <PullToRefresh :loading='loading' @refresh='refreshHandler' :color="'#F3FDE8'">
    <section>
      <header>
        <svg xmlns='http://www.w3.org/2000/svg' width='35' height='35' fill='#F3FDE8' class='bi bi-list'
             viewBox='0 0 16 16'>
          <path fill-rule='evenodd'
                d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z' />
        </svg>
      </header>
      <main>
        <h1>Welecome, Jinhee
          <strong>Schedule</strong>
        </h1>
        <div class='box-wrapper'>
        </div>
        <div class='box-wrapper'>
        </div>
        <div class='box-wrapper'>
        </div>
        <div class='box-wrapper'>
        </div>
        <div class='box-wrapper'>
        </div>
        <div class='box-wrapper'>
        </div>
      </main>
    </section>
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
      }, 2000)
    }
  }
}
</script>
<style>
@import "@/assets/css/reset.css";

body {
  background: #FFBFBF;
  width: 100%;
}

section {
  width: 100%;
  height: auto;
}

header {
  width: 100%;
  height: 45px;
  border-bottom: 2px dotted #F3FDE8;
  color: #F3FDE8;
  display: flex;
  align-items: center;
  font-weight: bold;
  padding: 0 15px;
}

main {
  padding: 40px 30px 100px 30px;
}

main > h1 {
  font-size: 18px;
  color: white;
}

main > h1 > strong {
  font-size: 24px;
  display: block;
  margin-top: 10px;
  color: #F3FDE8;
}

.box-wrapper {
  margin-top: 20px;
  width: 100%;
  height: 150px;
  border-radius: 15px;
  border: 1px solid #F3FDE8;
}
</style>
