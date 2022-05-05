import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'



//导入flexible.js设置rem的基准值
import 'lib-flexible/flexible'
// 导入第三方字体图标
import "./assets/font/iconfont.css";

import {
  Tabbar,
  TabbarItem,
  Icon,
  NavBar,
  Search,
  Swipe,
  SwipeItem,
  Lazyload,
  Tab,
  Tabs,
  Image as VanImage,
  Toast,
  Circle,
  Popup,
  Slider,
  Loading
} from 'vant';

Vue
  .use(VueAxios, axios)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Icon)
  .use(NavBar)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(Tab)
  .use(Tabs)
  .use(VanImage)
  .use(Toast)
  .use(Circle)
  .use(Popup)
  .use(Slider)
  .use(Loading)

axios.defaults.baseURL = 'https://apis.netstart.cn/music/';

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
