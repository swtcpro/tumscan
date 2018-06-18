<template>
  <div v-loading='loading' element-loading-text="拼命加载中">
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
        <span style="margin: 1em">账本总量：{{pagination.total}}</span>
      </el-col>
      <el-col :md="8" :xl="8" :xs="12">
        <el-pagination
          background
          layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"
          :total="pagination.total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-row class="ledgers-row">
      <el-table :data="ledgers" style="width: 100%" :header-cell-style="{backgroundColor: '#f9f9f9'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="账本hash">
          <template slot-scope="scope">
            <a style="width: 15em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" href="javascript:void(0)">{{scope.row.hash}}</a>
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
  import API from '../../api/api_jingtum';

  export default {
    data() {
      return {
        loading: false,
        pagination: {
          limit: 50,
          page: 1,
          total: 100
        },
        ledgers: [
          {
            hash: '0001676F2A7BDF920C0C8FABB7E6478BBDC2D141A95670CDFD76C8EC0B09C525',
            index: 9870622,
            transNum: 3,
            time: '2018-06-09 05:01:40'
          }
        ]
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
          if (result) {
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
      flipOver(page) {
        this.pagination.page = page;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };
        this.queryLedgers(params);
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .ledgers-row {
    margin-top: 3em;
  }
</style>
