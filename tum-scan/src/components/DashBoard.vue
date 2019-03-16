<template>

  <el-row v-loading='loading' element-loading-text="拼命加载中">
    <el-row :gutter="40" class="first-row">
      <!--  左侧的仪表展示盘 -->
      <!--<el-col :span="12">-->
      <el-col :xs="24" :md="12">
        <el-card class="left-card">
          <el-row>
            <el-col :span="4">
              <img src="../assets/icon/浏览器2.png" style="margin-right: 16px"/>
            </el-col>
            <el-col :span="20">
              <span style="color: white;">总容量￥59.99 BILLION</span>
              <!--<h4>1 SWT @ 0.03867 CNY</h4>-->
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <small>最后账本</small>
              <h4>
                <span style="color: white;">{{data.ledgers[0].ledger_index}}</span>
              </h4>
            </el-col>
            <el-col :span="12">
              <small>交易</small>
              <h4>
                <span style="color: white;">199.39M</span>
              </h4>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <small>&nbsp;</small>
              <h4>
                <a><span style="color: white;">&nbsp; </span></a>
              </h4>
            </el-col>
            <el-col :span="12">
              <small>&nbsp;</small>
              <h4>
                <a><span style="color: white;"> &nbsp;</span></a>
              </h4>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!--  右侧的echarts图表展示 -->
      <el-col :xs="24" :md="12">
        <div class="grid-content bg-purple-light" id="chartLine" style="width:100%;"></div>
      </el-col>
    </el-row>

    <el-row :gutter="40" class="second-row">
      <!-- 左侧区块展示区域 -->
      <el-col :xs="24" :md="12">
        <el-card shadow="never" :body-style="{ padding: '2px'}">
          <div slot="header">
            <span>账本</span>
            <el-button @click="viewAllLedgers" style="float: right; padding: 3px 0" size="medium" type="text">查看全部
            </el-button>
          </div>
          <div>
            <el-card :body-style="{ padding: '10px',height: '100px' }" shadow="hover" v-for="ledger in data.ledgers"
                     :key="ledger.ledger_index">
              <el-col :span="8" class="block">
                <el-row style="height: 65px" type="flex" justify="center">
                  <a href="javascript:void(0);" v-on:click="handleLedger(ledger.ledger_hash)"
                     style="color: white; padding-top: 15%">
                    账本号：{{ledger.ledger_index}}</a>
                </el-row>
              </el-col>
              <el-col :span="16">
                <el-row style="height: 65px" type="flex" justify="center">
                  <el-col :span="16">
                    <div style="text-align: center">交易数：{{ledger.txn_count}}</div>
                    <div style="text-align: center; margin-top: 5%">创建时间：{{ledger.ledger_time}}</div>
                  </el-col>
                </el-row>
              </el-col>
            </el-card>

          </div>
        </el-card>
      </el-col>

      <!-- 右侧交易展示区域 -->
      <el-col :xs="24" :md="12">
        <el-card class="transaction" shadow="never" :body-style="{ padding: '2px'}">
          <div slot="header">
            <span>交易</span>
            <!--<el-button @click="viewAllTransactions" style="float: right; padding: 3px 0" type="text">查看全部</el-button>-->
          </div>

          <el-card :body-style="{  padding: '10px',height: '100px' }" shadow="hover"
                   v-for="transaction in data.transactions"
                   :key="transaction.hash">
            <el-col :span="24">
              <div class="transaction-item">
                <div class="text-overflow">哈希：
                  <a href="javascript:void(0)"
                     v-on:click="handleTransaction(transaction.hash)"> {{transaction.hash}}</a>
                </div>
                <div>交易类型：
                  <el-tag v-if="transaction.type === 'sent'" type="success">卖出</el-tag>
                  <el-tag v-else-if="transaction.type === 'received'" type="danger">买入</el-tag>
                  <el-tag v-else-if="transaction.type === 'offernew'" type="info">挂单</el-tag>
                  <el-tag v-else-if="transaction.type === 'offercancel'" type="primary">取消挂单</el-tag>
                  <el-tag v-else-if="transaction.type === 'offereffect'" type="success">成交挂单</el-tag>
                  <el-tag v-else-if="transaction.type === 'convert'" type="warning">兑换</el-tag>
                </div>
                <div>交易时间： {{transaction.date}}</div>
              </div>
            </el-col>
          </el-card>
        </el-card>
      </el-col>

    </el-row>

    <el-row class="third-row">
      <div style="height: 50px">

      </div>
    </el-row>
  </el-row>

</template>

<script>
  import API from '../api/api_jingtum';
  import util from '../common/util';
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue";
  import ElTag from "../../node_modules/element-ui/packages/tag/src/tag.vue";

  export default {
    components: {
      ElTag,
      ElButton,
      ElCol,
      ElRow
    },
    name: "dashBoard",
    data() {
      return {
        loading: false,
        // 初始化页面数据集
        data: {
          ledgers: [
            {
              ledger_index: 9422438,
              ledger_time: 577382240,
              txn_count: 2
            }
          ],
          transactions: [
            {
              date: 1524067040,
              type: "sent",
              hash: 'EC7EA80C1927BEF52B821B859D9C56D3057B1E39309C6623EFD52A59C0717DE6'
            }
          ]
        }
      }
    },
    methods: {
      init() {
        let that = this;
        that.loading = true;
        API.dashBoardInit().then(function (result) {
          that.loading = false;
          if (result.success === true) {
            that.data = result.data;
            that.data.ledgers.map(function (ledger) {
              ledger.ledger_time = util.formatDate.generate2000(ledger.ledger_time);
            });
            that.data.transactions.map(function (transaction) {
              transaction.date = util.formatDate.format(new Date(transaction.date * 1000), 'yyyy-MM-dd hh:mm:ss');
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
      handleTransaction(hash) {
        this.$router.push({
          name: 'transaction',
          params: {hash}
        })
      },
      handleLedger(ledger_hash) {
        this.$router.push({
          name: 'ledger',
          params: {ledger_hash}
        })
      },
      viewAllLedgers() {
        this.$router.push({
          name: 'ledgers'
        })
      },
      viewAllTransactions() {
        this.$router.push({
          name: 'transactions'
        })
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .second-row {
    margin-top: 40px;
  }

  .left-card {
    background-color: #3498db;
    color: white;
  }

  .block {
    background-color: gray;
    margin-bottom: 10px
  }

  .transaction-item {
    height: 75px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }
</style>
