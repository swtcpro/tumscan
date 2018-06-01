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
      <el-row class="balance-row" gutter="40">
        <el-col :xs="24" :md="8">
          <el-card shadow="never" :body-style="{ padding: '0px' }" v-model="data.data.swt">
            <div style="background-color: darkred; height: 50px; padding: 15px">
              <el-row type="flex" justify="center">
                <span><b> SWT </b></span>
              </el-row>
            </div>
            <div class="balance-item">
              余额：{{data.data.swt.value}}
            </div>
            <div class="balance-item">
              冻结的金额：{{data.data.swt.freezed}}
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8" v-for="line in data.data.lines" :key="line">
          <el-card shadow="never" :body-style="{ padding: '0px' }">
            <div style="background-color: #3498dd; height: 50px; padding: 15px">
              <el-row type="flex" justify="center">
                <span><b> {{line.currency}} </b></span>
              </el-row>
            </div>
            <div class="balance-item">
              余额：{{line.value}}
            </div>
            <div class="balance-item">
              发行方：{{line.issuer}}
            </div>
          </el-card>
        </el-col>

      </el-row>


      <el-row class="label-row">
        <h3>交易记录</h3>
      </el-row>

      <el-row>
        <el-table :data="txns.transactions" style="width: 100%"
                  @row-click="transactionTableClick">
          <el-table-column prop="hash" label="交易编号">
            <template slot-scope="scope">
              <a class="text-overflow"
                 href="javascript:void(0)"> {{scope.row.hash}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="100" label="日期" sortable></el-table-column>
          <el-table-column prop="pays.value" label="交易金额" width="150" sortable></el-table-column>
          <el-table-column prop="account" label="交易本家"></el-table-column>
          <el-table-column
            prop="type"
            width="100"
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

      <el-row type="flex" justify="center" class="pagination-row">
        <el-col :xs="12" :md="3">
          <el-button type="primary">上一页</el-button>
        </el-col>
        <el-col :xs="12" :md="3">
          <el-button type="primary">下一页</el-button>
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
        address: '0xE19f6cEca18887032D17CCAFAc3A07Bd0858A2da',
        // 账户相关信息
        "data": {
          "success": true,
          "data": {
            "type": "wallet",
            "swt": {
              "value": 4266315.384861,
              "freezed": 30
            },
            "lines": [{
              "value": "2.09369306739",
              "currency": "CNY",
              "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
            },
              {
                "value": "0",
                "currency": "VCC",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
              }],
          }
        },

        "txns": {
          "account": "jwxJZE6ft5X4HoGG7wULSYVt6oEJ8t4Szn",
          "ledger_index_max": 9422391,
          "ledger_index_min": 266955,
          "limit": 10,
          "marker": {
            "ledger": 8900077,
            "seq": 3
          },
          "transactions": [{
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
            }]
          },
            {
              "date": 1522903080,
              "hash": "3E563FFD48550B4DC80A2DC283674260DBEB73C4BB382B3830EB69ABDEEDFC60",
              "type": "offereffect",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "effects": [{
                "effect": "offer_funded",
                "counterparty": {
                  "account": "jho7CNveKV6jgZowGhJbkowxPTWNH4iBeL",
                  "seq": 1384,
                  "hash": "3E563FFD48550B4DC80A2DC283674260DBEB73C4BB382B3830EB69ABDEEDFC60"
                },
                "got": {
                  "value": "100",
                  "currency": "SWT",
                  "issuer": ""
                },
                "paid": {
                  "value": "4.166",
                  "currency": "CNY",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or"
                },
                "type": "bought",
                "seq": 677,
                "price": "0.04166",
                "deleted": true
              }]
            },
            {
              "date": 1522903010,
              "hash": "E5A3F68B9F12F22FDE92A948523F59D7AE562C641FCF93939A6ABBB0553FDF4D",
              "type": "offernew",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "offertype": "buy",
              "gets": {
                "currency": "CNY",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "4.166"
              },
              "pays": {
                "value": "100",
                "currency": "SWT",
                "issuer": ""
              },
              "seq": 677,
              "effects": [{
                "effect": "offer_created",
                "gets": {
                  "currency": "CNY",
                  "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                  "value": "4.166"
                },
                "pays": {
                  "value": "100",
                  "currency": "SWT",
                  "issuer": ""
                },
                "type": "buy",
                "seq": 677,
                "price": "0.04166"
              }]
            },
            {
              "date": 1521260500,
              "hash": "2C6A9BFC905EA36D0B32DBCE0DFB6A8B2319F26CF108CCB4604F8AD5B1B71D1B",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "jJuLBgEL7PDa74wY2qUWQzJFkQtA8MrShT",
              "amount": {
                "value": "1003",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            },
            {
              "date": 1518960570,
              "hash": "4857866ABBD99656F298D0F5A1AF891B2771A3AF45E1BF7C36056C16518D7D66",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "jwgZrskF7MkiscTq9bmJCNSr7uyzLZbj4x",
              "amount": {
                "value": "8063",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            },
            {
              "date": 1518960530,
              "hash": "CA28D131BBF579CBC592245C5F52F7ADBD351CB4E2FE3E4DE635EF0002C5FA01",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "jwgZrskF7MkiscTq9bmJCNSr7uyzLZbj4x",
              "amount": {
                "currency": "CNY",
                "issuer": "jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or",
                "value": "31"
              },
              "effects": []
            },
            {
              "date": 1518847380,
              "hash": "D7D4A24DA07FD4FECDB51E57818864666B8E8C1D58AFFFA58C12D95D35FB3817",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "j95ALTcLFDAVwcJMHZoZQLqcUUTm6ZF2k2",
              "amount": {
                "value": "669",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            },
            {
              "date": 1518846890,
              "hash": "818F7FFAA6D38A8FDD1F6D594468EDD6B46021C5F642B71561B4DC5FFC5F0152",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "jMYGdkuSJmqK2CXr9UerRGrmxfNWFpi53D",
              "amount": {
                "value": "1605",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            },
            {
              "date": 1518846750,
              "hash": "649B709FB33B38A59F8579204722D272E98D8160CA0609E1B421780EDF1FEA96",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "j4zU9vYuP4u3R7Lb7hQ3HtQYRY4q72eytH",
              "amount": {
                "value": "1443",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            },
            {
              "date": 1518843720,
              "hash": "99A4F5D098EDF2F9A54B0CE90B46D154966E42B5A684542FF5835C683FC00742",
              "type": "received",
              "fee": "0.01",
              "result": "tesSUCCESS",
              "memos": [],
              "counterparty": "jNVUEZhDZvq1YLqs93fiPZeBBUcta3xCrS",
              "amount": {
                "value": "1044",
                "currency": "SWT",
                "issuer": ""
              },
              "effects": []
            }]
        }
      }
    },
    methods: {
      getParams() {
        let pathVariable = this.$route.params.pathVariable;
        this.address = pathVariable;
        console.log(pathVariable);
        return pathVariable;
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

      dataInit() {
        let that = this;
        that.loading = true;
        API.queryWallet(that.address).then(function (result) {
          that.loading = false;
          if (result.success === true) {
            that.data = result.data;
            that.txns = result.data.data.txns;
            that.txns.transactions.map(function (item) {
              item.account = that.txns.account;
              item.date = util.formatDate.format(new Date(item.date * 1000), 'yyyy-MM-dd hh:mm:ss')
              console.log(item.toString());
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
<style>

  .balance-item {
    font-size: 14px;
    margin: 18px;
  }

  .pagination-row {
    margin-top: 20px;
  }
</style>
