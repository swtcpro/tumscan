import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Dashboard from '@/components/Dashboard';
import Account from "@/components/AccountDetail";
import Transaction from '@/components/transaction/Transaction';
import Ledger from '@/components/transaction/Ledger'
import Transactions from '@/components/transaction/Transactions';
import Ledgers from '@/components/transaction/Ledgers';
import Chart from '@/components/Chart'
import Forum from '@/components/forum/forum'
import Tokens from '@/components/token/Tokens'
import Ranking from '@/components/token/Ranking'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      // iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: 'dashboard', label: '首页', menuShow: true},
        {path: '/account', component: Account, name: 'account', label: '账户详情', menuShow: false},
      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      leaf: false,
      label: '区块链',
      menuShow: true,
      children: [
        {path: '/transactions', component: Transactions, name: 'transactions', label: '交易列表', menuShow: true},
        {path: '/ledgers', component: Ledgers, name: 'ledgers', label: '账本列表', menuShow: true},
        {path: '/transaction', component: Transaction, name: 'transaction', label: '交易详情', menuShow: false},
        {path: '/ledger', component: Ledger, name: 'ledger', label: '账本详情', menuShow: false}
      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      leaf: true, // 只有一个节点
      menuShow: true,
      children: [
        {path: '/tokens', component: Tokens, name: 'tokens', label: '代币', menuShow: true},
        {path: '/ranking', component: Ranking, name: 'ranking', label: '持仓排名', menuShow: false}
      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      leaf: true, // 只有一个节点
      menuShow: true,
      children: [
        {path: '/chart', component: Chart, name: 'chart', label: '图表分析', menuShow: true},
      ]
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      leaf: true, // 只有一个节点
      menuShow: true,
      children: [
        {path: '/forum', component: Forum, name: 'forum', label: '讨论', menuShow: true},
      ]
    }
  ]
})
