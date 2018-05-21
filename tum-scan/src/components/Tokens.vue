<template>
  <el-container>
    <el-row class="breadcrumb">
      <el-col :span="24">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>交易详情</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  import ElContainer from "element-ui/packages/container/src/main";

  export default {
    components: {ElContainer},
    name: "tokens"
  }
</script>

<style scoped>

</style>
