/**
\* Created with IntelliJ IDEA.
\* User: 彭诗杰
\* Date: 2018/6/4
\* Time: 21:50
\* Description: 代币持仓排名页面
\*/
<template>
  <div v-loading='loading' element-loading-text="拼命加载中">
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <h4>代币 Tracker</h4>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>代币</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {

    methods: {
      getParams() {
        let token = this.$route.params.token;
        console.log(token);
      },
    },
    mounted() {
      this.getParams();
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<style scoped>

</style>
