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
        <span style="margin: 1em">近期交易总量：{{pagination.total}}</span>
      </el-col>
    </el-row>

    <el-row>
      <el-table :data="transactions" style="width: 100%">
        <el-table-column prop="hash" label="交易编号">
          <template slot-scope="scope">
            <a class="text-overflow"
               href="javascript:void(0)" v-on:click="handleTransaction(scope.row.hash)"> {{scope.row.hash}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" sortable></el-table-column>
        <el-table-column prop="Amount" label="交易金额" width="150" sortable>
        </el-table-column>
        <!--<el-table-column prop="account" label="交易本家"></el-table-column>-->
        <el-table-column
          prop="TransactionType"
          :filters="[{ text: '买入', value: 'Received'}, { text: '卖出', value: 'Payment'},
          {text: '挂单', value: 'OfferCreate'}, {text: '取消挂单', value: 'OfferCancel'},
          {text: '成交挂单', value: 'OfferEffect'}, {text: '兑换', value: 'Convert'}]"
          :filter-method="filterTransactionType"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.TransactionType === 'Payment'"
                    type="success">卖出
            </el-tag>
            <el-tag v-else-if="scope.row.TransactionType === 'Received'"
                    type="danger">买入
            </el-tag>
            <el-tag v-else-if="scope.row.TransactionType === 'OfferCreate'"
                    type="info">挂单
            </el-tag>
            <el-tag v-else-if="scope.row.TransactionType === 'OfferCancel'"
                    type="primary">取消挂单
            </el-tag>
            <el-tag v-else-if="scope.row.TransactionType === 'OfferEffect'"
                    type="success">成交挂单
            </el-tag>
            <el-tag v-else-if="scope.row.TransactionType === 'Convert'"
                    type="warning">兑换
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Destination" label="交易对家"></el-table-column>
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

  export default {
    data() {
      return {
        loading: false,
        pagination: {
          limit: 20,
          page: 1,
          total: 100
        },
        transactions: []
      }
    },
    methods: {
      init() {
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };
        this.queryTransactions(params);
      },
      queryTransactions(params) {
        let that = this;
        that.loading = true;
        API.queryTransactionsPaging(params).then(result => {
          that.loading = false;
          if (result.err) {
            that.$message.error({showClose: true, message: result.err, duration: 3000});
          } else {
            // 填充分页数据
            that.pagination.total = result.total;
            that.transactions = result.transactions;
            // 处理Amount
            that.transactions.forEach(function (transaction, index) {
              if (transaction.Amount) {
                transaction.Amount = JSON.parse(transaction.Amount);
                if (transaction.Amount.currency && transaction.Amount.issuer) {
                  transaction.Amount = transaction.Amount.value + ' ' + transaction.Amount.currency;
                  console.log(transaction.Amount)
                }
              }
            })
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
      filterTransactionType: function (value, row) {
        return row.type === value;
      },
      flipOver(page) {
        this.pagination.page = page;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit
        };
        this.queryTransactions(params);
      },
      handleTransaction(hash) {
        this.$router.push({
          name: 'transaction',
          params: {hash}
        })
      }
    },
    mounted() {
      this.init();
    }
  }
</script>
