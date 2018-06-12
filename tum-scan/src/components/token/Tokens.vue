<template>
  <div>
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <h4>代币 Tracker</h4>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>代币信息</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <!--<el-col :md="8" :xl="8" :xs="16">-->
      <!--<el-input placeholder="通过名称/issue查询" v-model="searchInput" class="input-with-button">-->
      <!--<el-button slot="append" icon="el-icon-search" v-on:click="handleSearch"></el-button>-->
      <!--</el-input>-->
      <!--</el-col>-->
    </el-row>
  </div>
</template>

<script>
  import ElContainer from "element-ui/packages/container/src/main";

  export default {
    components: {ElContainer},
    name: "tokens",

    data() {
      return {}
    },
    methods: {}
  }

</script>

<style scoped>

</style>
