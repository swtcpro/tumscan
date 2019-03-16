<template>
  <div v-loading='loading' element-loading-text="正在加载">
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <b style="font-size: 1.2em">账本</b>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>账本列表</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class="pagination-row">
      <el-col :md="16" :xl="16" :xs="12">
        <span>账本总量：{{pagination.total}}</span>
      </el-col>
      <el-col :md="8" :xl="8" :xs="12">
        <el-form inline="true">
          <el-form-item>
            <el-input v-model="ledgerHeight" placeholder="请输入账本高度"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryHeight">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--<el-col :md="14" :xl="14" :xs="12">-->
      <!--<el-pagination-->
      <!--background-->
      <!--layout="prev, pager, sizes, next, jumper" :page-size="pagination.limit" @current-change="flipOver"-->
      <!--:total="pagination.total">-->
      <!--</el-pagination>-->
      <!--</el-col>-->
    </el-row>

    <el-row class="ledgers-row">
      <el-table :data="ledgers" style="width: 100%" :header-cell-style="{backgroundColor: '#f9f9f9'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="账本hash">
          <template slot-scope="scope">
            <a style="width: 15em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" href="javascript:void(0)"
               v-on:click="handleLedger(scope.row.hash)">{{scope.row.hash}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="index"
          label="账本高度">
        </el-table-column>
        <el-table-column
          prop="transNum"
          label="交易数">
        </el-table-column>
        <el-table-column
          prop="time"
          label="创建时间">
        </el-table-column>
      </el-table>
    </el-row>

    <el-row class="pagination-row">
      <el-col :md="10" :xl="10" :xs="12">
        <span style="margin: 1em"></span>
      </el-col>
      <el-col :md="14" :xl="14" :xs="12">
        <el-pagination
          background
          layout="prev, pager, sizes, next, jumper" :page-size="pagination.limit" @current-change="flipOver"
          :total="pagination.total">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import API from '../../api/api_jingtum';
  import uitl from '../../common/util'

  export default {
    data() {
      return {
        loading: false,
        ledgerHeight: '',
        pagination: {
          limit: 20,
          page: 1,
          total: 100
        },
        ledgers: []
      }
    },
    methods: {
      init() {
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };
        this.queryLedgers(params);
      },
      queryLedgers(params) {
        let that = this;
        that.loading = true;
        API.queryLedgersPaging(params).then(result => {
          that.loading = false;
          if (result.err) {
            that.$message.error({showClose: true, message: result.err, duration: 3000});
          } else {
            // 填充分页数据
            that.pagination.total = result.total;
            that.ledgers = result.ledgers;
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
      queryHeight() {
        if (uitl.isStrEmpty(this.ledgerHeight)) {
          this.init();
        } else {
          this.loading = true;
          API.queryLedgerByHeight(this.ledgerHeight).then(ledger => {
            this.ledgers = [];
            this.ledgers.push(ledger);
            this.pagination.total = 1;
            this.loading = false;
          }, err => {
            this.loading = false;
            this.$message.error({showClose: true, message: err});
          }).catch(error => {
            this.loading = false;
            this.$message.error({showClose: true, message: error});
          })
        }
      },
      flipOver(page) {
        this.pagination.page = page;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };
        this.queryLedgers(params);
      },
      handleLedger(ledger_hash) {
        this.$router.push({
          name: 'ledger',
          params: {ledger_hash}
        })
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .ledgers-row {
  }
</style>
