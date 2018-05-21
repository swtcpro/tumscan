// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'
import App from './App'
import router from './router'
import * as Uiv from 'uiv'
import ElementUI from 'element-ui'
import 'element-ui/lib/index'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'

Vue.config.productionTip = false;
Vue.use(Uiv, {prefix: 'uiv'});
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
