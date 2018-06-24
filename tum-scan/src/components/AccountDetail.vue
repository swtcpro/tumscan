<template>
  <el-row class="warp-body">
    <el-row class="breadcrumb">
      <el-col :xs="24" :md="20">
        <h5 style="margin-top: 12px">钱包地址：{{address}}</h5>
      </el-col>
      <el-col :xs="24" :md="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>钱包详情</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class="label-row">
      <h3>余额</h3>
    </el-row>

    <el-row class="content" v-loading='loading' element-loading-text="拼命加载中">
      <el-row class="balance-row" :gutter='40'>
        <!--<el-col :xs="24" :md="8">-->
        <!--<el-card shadow="never" :body-style="{ padding: '0px' }" v-model="data.data.swt">-->
        <!--<div style="background-color: darkred; height: 50px; padding: 15px">-->
        <!--<el-row type="flex" justify="center">-->
        <!--<span><b> SWT </b></span>-->
        <!--</el-row>-->
        <!--</div>-->
        <!--<div class="balance-item">-->
        <!--余额：{{data.data.swt.value}}-->
        <!--</div>-->
        <!--<div class="balance-item">-->
        <!--冻结的金额：{{data.data.swt.freezed}}-->
        <!--</div>-->
        <!--</el-card>-->
        <!--</el-col>-->

        <el-col :xs="24" :md="8" v-for="balance in wallet.balances" :key="balance.value">
          <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div style="background-color: #3498dd; height: 50px; padding: 15px">
              <el-row type="flex" justify="center">
                <span><b> {{balance.currency}} </b></span>
              </el-row>
            </div>
            <div class="balance-item">
              余额：{{balance.value}}
            </div>
            <div class="balance-item">
              发行方：{{balance.issuer}}
            </div>
          </el-card>
        </el-col>

      </el-row>

      <el-row class="label-row">
        <h3>交易记录</h3>
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

      <el-row>
        <el-table :data="wallet.transactions" style="width: 100%"
                  @row-click="transactionTableClick">
          <el-table-column prop="hash" label="交易编号">
            <template slot-scope="scope">
              <a class="text-overflow"
                 href="javascript:void(0)"> {{scope.row.hash}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期" sortable></el-table-column>
          <el-table-column prop="amount" label="交易金额" width="150" sortable></el-table-column>
          <!--<el-table-column prop="account" label="交易本家"></el-table-column>-->
          <el-table-column
            prop="type"
            :filters="[{ text: '买入', value: 'received'}, { text: '卖出', value: 'sent'},
          {text: '挂单', value: 'OfferCreate'}, {text: '取消挂单', value: 'offercancel'},
          {text: '成交挂单', value: 'offereffect'}, {text: '兑换', value: 'convert'}]"
            :filter-method="filterTransactionType"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 'sent'"
                      type="danger">卖出
              </el-tag>
              <el-tag v-else-if="scope.row.type === 'received'"
                      type="success">买入
              </el-tag>
              <el-tag v-else-if="scope.row.type === 'offernew'"
                      type="info">挂单
              </el-tag>
              <el-tag v-else-if="scope.row.type === 'offercancel'"
                      type="primary">取消挂单
              </el-tag>
              <el-tag v-else-if="scope.row.type === 'offereffect'"
                      type="success">成交挂单
              </el-tag>
              <el-tag v-else-if="scope.row.type === 'convert'"
                      type="warning">兑换
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="counterparty" label="交易对家"></el-table-column>
        </el-table>
      </el-row>

      <el-row class="pagination-row">
        <el-col :md="16" :xl="16" :xs="12">
          &nbsp;
          <!--<span style="margin: 1em">交易总量：{{pagination.total}}</span>-->
        </el-col>
        <el-col :md="8" :xl="8" :xs="12">
          <el-pagination
            background
            layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"
            :total="pagination.total">
          </el-pagination>
        </el-col>
      </el-row>

    </el-row>
  </el-row>
</template>

<script>
  import API from '../api/api_jingtum';
  import util from '../common/util'
  import ElCol from "element-ui/packages/col/src/col";
  import ElRow from "element-ui/packages/row/src/row";
  import ElTag from "../../node_modules/element-ui/packages/tag/src/tag.vue";
  import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";

  export default {

    components: {
      ElButton,
      ElTag,
      ElRow,
      ElCol
    },
    data() {
      return {
        loading: false,
        // 钱包的基本信息
        address: 'j4Zdsk3tQSvQ4aEiaN1BD2Wk3ztzBBRWHc',
        // 账户相关信息
        wallet: {},
        pagination: {
          page: 1,
          limit: 20,
          total: 20
        }
      }
    },
    methods: {
      // getParams() {
      //   let pathVariable = this.$route.params.pathVariable;
      //   if (pathVariable) {
      //     this.address = pathVariable;
      //   }
      //   return pathVariable;
      // },
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
      dataInit() {
        let that = this;
        that.loading = true;
        let params = {
          address: that.address,
          page: that.pagination.page,
          limit: that.pagination.limit
        };
        API.queryWallet(params).then(function (result) {
          that.loading = false;
          if (result) {
            that.wallet = result;
            that.pagination.total = result.total;
            that.wallet.transactions.map(function (transaction) {
              transaction.date = util.formatDate.format(new Date(transaction.date * 1000), 'yyyy-MM-dd hh:mm:ss')
            });
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        })
      },
      flipOver(page) {
        this.pagination.page = page;
        this.dataInit();
      }
    },
    mounted() {
      // this.getParams();
      this.dataInit();
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': function () {
        // this.$route.params.pathVariable
        // this.$store.dispatch('updatePathVariable', this.$route.params.pathVariable);
        // console.log('pathVariable: ', this.$route.params.pathVariable)
        this.address = this.$route.params.pathVariable;
        // 通过更新Vuex中的store的数据，让数据发生变化
        this.dataInit();
      }
    }
  }
</script>
<style>

  .balance-item {
    font-size: 14px;
    margin: 18px;
  }

  .pagination-row {
    margin-top: 20px;
  }
</style>
