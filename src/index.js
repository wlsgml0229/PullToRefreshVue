import PullToRefresh from "./components/PullToRefresh.vue";

const MyVueLibrary = {
  install(Vue) {
    Vue.component("PullToRefresh", PullToRefresh);
  },
};

export default MyVueLibrary