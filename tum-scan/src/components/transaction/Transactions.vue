<template>
  <el-row class="warp-body">
    <el-row class="breadcrumb">
      <el-col :span="20">
      </el-col>
      <el-col :span="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>交易列表</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

  </el-row>
</template>
