/**
\* Created with IntelliJ IDEA.
\* User: 彭诗杰
\* Date: 2018/5/16
\* Time: 0:14
\* Description: 单个账本页面组件
\*/
<template>
  <div>
    <el-row class="breadcrumb">
      <el-col :xs="24" :md="20">
        <h5 style="margin-top: 12px">账本高度 #{{ledger.ledger_index}}</h5>
      </el-col>
      <el-col :xs="24" :md="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>账本详情</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :xs="24" :md="20">
        <h5 style="margin-top: 12px">账本哈希：{{ledger_hash}}</h5>
      </el-col>
    </el-row>

    <el-row class="ledger_content" v-loading="loading" element-loading-text="拼命加载中">
      <el-row gutter="40" style="height: 300px">
        <el-col :xs="24" :md="12">
          <el-card shadow="never" :body-style="{ padding: '0px', height: '260px'}" v-model="ledger">
            <div style="height: 50px; padding: 15px">
              <el-row type="flex">
                <span><b> 概况 </b></span>
              </el-row>
            </div>
            <ul>
              <li>
                <div class="transaction-item">
                  关闭时间：{{ledger.close_time_human}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  高度：{{ledger.ledger_index}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易数量：{{ledger.transactions.length}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  SWT总量：{{ledger.total_coins}}
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="never" :body-style="{ padding: '0px', height: '260px' }" v-model="ledger">
            <div style="height: 50px; padding: 15px">
              <el-row type="flex">
                <span><b> &nbsp; </b></span>
              </el-row>
            </div>
            <ul>
              <li>
                <div class="transaction-item">
                  上一个区块：
                  <div>{{ledger.parent_hash}}</div>
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  状态哈希树根：
                  {{ledger.account_hash}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易哈希树根：
                  {{ledger.transaction_hash}}
                </div>
              </li>

            </ul>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-row class="label-row">
          <h3>交易记录</h3>
        </el-row>

        <el-row>
          <el-table :data="ledger.transactions" style="width: 100%"
                    @row-click="transactionTableClick">
            <el-table-column prop="hash" label="交易编号">
              <template slot-scope="scope">
                <a class="text-overflow"
                   href="javascript:void(0)"> {{scope.row.hash}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="200" label="日期" sortable></el-table-column>
            <el-table-column label="交易金额" sortable>
              <template slot-scope="scope">
                <span v-if="scope.row.Amount.value">{{scope.row.Amount.value}} {{scope.row.Amount.currency}}</span>
                <span v-else>{{scope.row.Amount}} SWT</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="Account" label="交易本家"></el-table-column>-->
            <el-table-column
              prop="TransactionType"
              :filters="[{ text: '买入', value: 'received'}, { text: '卖出', value: 'sent'},
          {text: '挂单', value: 'OfferCreate'}, {text: '取消挂单', value: 'offercancel'},
          {text: '成交挂单', value: 'offereffect'}, {text: '兑换', value: 'convert'}]"
              :filter-method="filterTransactionType"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.TransactionType === 'Payment'"
                        type="success">卖出
                </el-tag>
                <el-tag v-else-if="scope.row.TransactionType === 'received'"
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
                <el-tag v-else-if="scope.row.TransactionType === 'convert'"
                        type="warning">兑换
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="Destination" label="交易对家"></el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<style scoped>

</style>

<script>

  import API from '../../api/api_jingtum';
  import util from '../../common/util';

  export default {
    data() {
      return {
        loading: false,
        ledger_hash: '',
        ledger: {
          accepted: true,
          account_hash: 'E64648702393BD4AEEEAEBFA5144030874070C83D3079A5367FDF8282C45E1EB',
          close_time: 572790860,
          close_time_human: '2018-Feb-24 12:34:20',
          close_time_resolution: 10,
          closed: true,
          txn_count: 3,
          ledger_hash: 'BBFE0C3F25EE707F79A0E4B361A00B2F9254C7DC7AB6B8FED3A804B51F864392',
          ledger_index: '8488670',
          parent_hash: 'AB78480BDA1B6BA3E328713FD477209D35D3665DC13F5AD38E3AA58CD9CA0DCA',
          seqNum: '8488670',
          totalCoins: '599999999996231320',
          total_coins: '599999999996231320',
          transaction_hash: 'B0E15F21E416E2C720E2F5C4FD2B0B9B6A3EA619ADA3461BDB1242D022273336'
        }
      }
    },
    methods: {
      getParams() {
        console.log(this.$route.params.ledger_hash);
        this.ledger_hash = this.$route.params.ledger_hash;
        return this.ledger_hash;
      },
      filterTransactionType: function (value, row) {
        return row.type === value;
      },
      // table单个交易点击事件
      transactionTableClick(row, event, column) {
        let hash = row.hash;
        // go to 单个交易页面
        this.$router.push({
          name: 'transaction',
          params: {hash}
        })
      },
      init() {
        let that = this;
        that.loading = true;
        API.queryLedger(that.ledger_hash).then(function (result) {
          that.loading = false;
          if (result) {
            that.ledger = result;
            that.ledger.transactions.forEach(transaction => {
              transaction.date = util.formatDate.generate2000(transaction.date);
            });
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          that.$message.error({showClose: true, message: error.toString(), duration: 2000});
        })
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    },
    mounted() {
      this.getParams();
      this.init();
    }
  }
</script>
