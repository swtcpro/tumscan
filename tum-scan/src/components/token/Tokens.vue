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
        <el-input placeholder="通过名称/issue查询" v-model="pagination.param" class="input-with-button">
          <el-button slot="append" icon="el-icon-search" v-on:click="handleTokenSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-row class="pagination-row">
      <el-col :offset="16" :md="8" :xl="8" :xs="12">
        <el-pagination
          background
          layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"
          :total="pagination.total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-row class="token-table">

      <el-table :data="tokens" border style="width: 100%" @row-click="tokenRowClicked">
        <el-table-column type="index"></el-table-column>
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
          layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"
          :total="pagination.total">
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
          limit: 20,
          param: null
        }
      }
    },
    methods: {
      initData() {
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          param: this.pagination.param
        };
        this.searchTokens(params);
      },
      flipOver(page) {
        this.pagination.page = page;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          param: this.pagination.param
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
      },
      /**
       * 代币搜索功能回调函数
       */
      handleTokenSearch() {
        this.pagination.page = 1;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          param: this.pagination.param
        };
        this.searchTokens(params);
      },
      /**
       * 点击代币列表回调函数
       */
      tokenRowClicked(row, event) {
        // go to token ranking
        let token = {
          currency: row.currency,
          issuer: row.issuer,
          total: row.total
        };
        this.$router.push({
          name: 'ranking',
          params: {token}
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
