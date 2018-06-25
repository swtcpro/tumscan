<template>
  <div>
    <el-row class="breadcrumb">
      <el-col :xs="24" :md="20">
        <h5 style="margin-top: 12px">交易编号：{{hash}}</h5>
      </el-col>
      <el-col :xs="24" :md="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>交易详情</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="content" v-loading="loading" element-loading-text="拼命加载中">
      <el-row :gutter="40" style="height: 300px">
        <el-col :xs="24" :md="12">
          <el-card shadow="never" :body-style="{ padding: '0px', height: '260px'}" v-model="tx">
            <div style="height: 50px; padding: 15px">
              <el-row type="flex">
                <span><b> 详情 </b></span>
              </el-row>
            </div>
            <ul>
              <li>
                <div class="transaction-item">
                  交易类型：
                  <el-tag v-if="tx.type === 'sent'"
                          type="danger">卖出
                  </el-tag>
                  <el-tag v-else-if="tx.type === 'received'"
                          type="success">买入
                  </el-tag>
                  <el-tag v-else-if="tx.type === 'offernew'"
                          type="info">挂单
                  </el-tag>
                  <el-tag v-else-if="tx.type === 'offercancel'"
                          type="primary">取消挂单
                  </el-tag>
                  <el-tag v-else-if="tx.type === 'offereffect'"
                          type="success">成交挂单
                  </el-tag>
                  <el-tag v-else-if="tx.type === 'convert'"
                          type="warning">兑换
                  </el-tag>
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易发起方：<a v-on:click="goToAccount(tx.Account)" href="javascript:void(0)">{{tx.Account}}</a>
                </div>
              </li>
              <li>
                <div class="transaction-item" v-if="tx.type === 'sent'">
                  交易金额：{{tx.amount.value}} SWT
                </div>
                <div class="transaction-item" v-else-if="tx.type === 'received'">
                  交易金额：{{tx.amount.value}} SWT
                </div>
                <div class="transaction-item" v-else>
                  交易金额：{{tx.pays.value}} {{tx.pays.currency}} <-->
                  {{tx.gets.value}} {{tx.gets.currency}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易对家：<a v-if="tx.counterparty" v-on:click="goToAccount(tx.counterparty)"
                          href="javascript:void(0)">{{tx.counterparty}}</a>
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  成交金额：{{tx.freezed}}
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="never" :body-style="{ padding: '0px', height: '260px' }" v-model="tx">
            <div style="height: 50px; padding: 15px">
              <el-row type="flex">
                <span><b> 其他 </b></span>
              </el-row>
            </div>
            <ul>
              <li>
                <div class="transaction-item">
                  账本号：{{ledger_index}}
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易费用：{{tx.fee}} SWT
                </div>
              </li>
              <li>
                <div class="transaction-item">
                  交易时间：{{tx.date}}
                </div>
              </li>
              <li>
                <div class="transaction-item">交易结果：
                  <el-tag v-if="tx.result === 'tesSUCCESS'"
                          type="danger">交易成功
                  </el-tag>
                  <el-tag v-else type="success">交易失败
                  </el-tag>
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>

      <el-row>
        <el-row class="label-row">
          <h3>交易效果</h3>
        </el-row>
        <template v-for="effect in tx.effects">

          <div v-if="effect.effect === 'offer_bought'">
            您以{{effect.pays.value}}的价格买了{{effect.got.value}}{{effect.got.currency}}
          </div>
          <div v-else-if="effect.effect === 'offer_created'">
            您以{{effect.pays.value}} {{effect.pays.currency}}的价格创建了挂单
          </div>
          <div v-else></div>

        </template>
        <div v-if="!tx.effects">暂无说明</div>
      </el-row>

      <el-row>
        <el-row class="label-row">
          <h3>交易备注</h3>
        </el-row>

        <div v-if="tx.memos">
          <div v-for="memo in tx.memos" :key="memo">
            {{memo.MemoData}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <div v-else>
          该交易无备注
        </div>
      </el-row>
    </el-row>


  </div>
</template>

<script>
  import API from '../../api/api_jingtum';
  import util from '../../common/util'
  import ElRow from "element-ui/packages/row/src/row";
  import ElContainer from "element-ui/packages/container/src/main";

  export default {
    components: {
      ElContainer,
      ElRow
    },
    name: "transaction",
    data() {
      return {
        loading: false,
        hash: '',
        // 交易详情
        tx: {
          "date": 1523187180,
          "hash": "32B60EE5F49C73F697DD43AB5B15E445C9E86CC6B21041C21B5EDF0BE88B4CA4",
          "type": "offernew",
          "fee": "0.01",
          "result": "tesSUCCESS",
          "memos": [],
          "offertype": "buy",
          "gets": {
            "currency": "CNY",
            "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
            "value": "35.511"
          },
          "pays": {
            "value": "890",
            "currency": "SWT",
            "issuer": ""
          },
          "seq": 678,
          "effects": [{
            "effect": "offer_bought",
            "counterparty": {
              "account": "jwTdJWmweNY1oeEzB57WDnsPCYnRvBpQAt",
              "seq": 4302,
              "hash": "E38F7186703F8432A039EDD3C8E210A46FEF85189D35833410A7D7078004CA95"
            },
            "paid": {
              "value": "35.511",
              "currency": "CNY",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            },
            "got": {
              "value": "890",
              "currency": "SWT",
              "issuer": ""
            },
            "type": "bought",
            "price": "0.0399"
          }],
          "Account": "jwxJZE6ft5X4HoGG7wULSYVt6oEJ8t4Szn"
        },
        ledger_index: 9334452
      }
    },
    methods: {
      getParams() {
        this.hash = this.$route.params.hash;
        console.log(this.hash);
        return this.hash;
      },
      goToAccount(address) {
        let pathVariable = address;
        this.$router.push({
          name: 'account',
          params: {pathVariable}
        });
      },
      dataInit() {
        let that = this;
        that.loading = true;
        API.queryTx(that.hash).then(function (result) {
          that.loading = false;
          if (result.success === true) {
            that.tx = result.data.data.tx;
            that.ledger_index = result.data.data.ledger_index;
            // 格式化时间
            that.tx.date = util.formatDate.format(new Date(that.tx.date * 1000), 'yyyy-MM-dd hh:mm:ss')
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
    mounted() {
      this.getParams();
      this.dataInit();
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<style scoped>
  .transaction-item {
    margin-top: 15px;
  }
</style>
