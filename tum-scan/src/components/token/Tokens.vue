<template>
  <div v-loading='loading' element-loading-text="拼命加载中">
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
    </el-row>

    <el-row class="search-row">
      <el-col :offset="18" :md="6" :xl="6" :xs="12">
        <el-input placeholder="通过名称/issue查询" v-model="searchInput" class="input-with-button">
          <el-button slot="append" icon="el-icon-search" v-on:click="handleSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-row class="pagination-row">
      <el-col :offset="16" :md="8" :xl="8" :xs="12">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </el-col>
    </el-row>

    <el-row class="token-table">

      <el-table :data="tokens" border style="width: 100%">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column
          label="代币"
          width="800">
          <template slot-scope="scope">
            <h5><a href="javascript:void(0)">currency:&nbsp&nbsp&nbsp{{scope.row.currency}}</a></h5>
            <h5><a href="javascript:void(0)">issuer:&nbsp&nbsp&nbsp&nbsp({{scope.row.issuer}})</a></h5>
            <!--<p></p>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="总量">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价值">
        </el-table-column>
      </el-table>
    </el-row>

    <el-row class="pagination-row">
      <el-col :offset="16" :md="8" :xl="8" :xs="12">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import ElContainer from "element-ui/packages/container/src/main";
  import API from '../../api/api_jingtum'

  export default {
    components: {ElContainer},
    name: "tokens",

    data() {
      return {
        loading: false,
        tokens: [
          {
            currency: '2714255365294C90B87CD11A1B2CED3E8A49EBA1',
            issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
            total: 4779910000
          },
          {
            currency: 'SPC',
            issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or',
            total: 1030000
          }],
        pagination: {
          total: 0,
          page: 1,
          limit: 20
        }
      }
    },
    methods: {
      initData() {
        let params = {
          page: pagination.page,
          limit: this.pagination.limit,
          param: null
        };
        this.searchTokens(params);
      },
      searchTokens(params) {
        let that = this;
        that.loading = true;
        API.queryTokens(params).then(result => {
          that.loading = false;
          if (result) {
            that.pagination.total = result.total;
            that.tokens = result.tokens;
          }
        }, err => {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(error => {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        })
      }
    },
    mounted() {
      this.initData();
    }
  }

</script>

<style scoped>

</style>
