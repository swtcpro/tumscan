<template>
  <div v-loading='loading' element-loading-text="拼命加载中">
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <b style="font-size: 1.2em">交易</b>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>交易列表</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class="pagination-row">
      <el-col :md="16" :xl="16" :xs="12">
        <span style="margin: 1em">交易总量：{{pagination.total}}</span>
      </el-col>
      <el-col :md="8" :xl="8" :xs="12">
        <el-pagination
          background
          layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"
          :total="pagination.total">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>
