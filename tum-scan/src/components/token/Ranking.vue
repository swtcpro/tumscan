/**
\* Created with IntelliJ IDEA.
\* User: 彭诗杰
\* Date: 2018/6/4
\* Time: 21:50
\* Description: 代币持仓排名页面
\*/
<template>
  <div v-loading='loading' element-loading-text="拼命加载中">
    <el-row class="breadcrumb">
      <el-col :md="20" :xl="20" :xs="20">
        <h4>TOKEN ({{token.currency}})</h4>
      </el-col>
      <el-col :md="4" :xl="4" :xs="4">
        <el-breadcrumb separator="/" style="margin-top: 12px">
          <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
          <el-breadcrumb-item><b>持仓排名</b></el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row class="summary-row">
      <el-card shadow="never" :body-style="{ padding: '0px', height: '130px'}" v-model="token">
        <el-row>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5> 代币信息 </h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5> &nbsp </h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5 style="display: inline-block"> 代币名称：</h5>
              <h5 style="display: inline-block; margin-left: 3em"> {{token.currency}}</h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5 style="display: inline-block"> 代币发行商：</h5>
              <h5 style="display: inline-block; margin-left: 3em"> {{token.issuer}}</h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5 style="display: inline-block"> 代币总量：</h5>
              <h5 style="display: inline-block; margin-left: 3em"> {{token.total}}</h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
          <el-col :md="12" :xl="12" :xs="24">
            <div class="ranking-item">
              <h5 style="display: inline-block"> 持有账户数：</h5>
              <h5 style="display: inline-block; margin-left: 3em"> {{pagination.total}}</h5>
              <div class="bottom-line"></div>
            </div>
          </el-col>
        </el-row>

      </el-card>
    </el-row>

    <el-row class="tab-row">
      <el-tabs v-model="tab" @tab-click="tabClicked">

        <el-tab-pane label="账户排名" name="holders">
          <!-- 账户排名内容 -->
          <!--<el-row class="pagination-row">-->
            <!--<el-col :offset="16" :md="8" :xl="8" :xs="12">-->
              <!--<el-pagination-->
                <!--background-->
                <!--layout="prev, pager, next" :page-size="pagination.limit" @current-change="flipOver"-->
                <!--:total="pagination.total">-->
              <!--</el-pagination>-->
            <!--</el-col>-->
          <!--</el-row>-->

          <el-row class="ranking-table">
            <el-table :data="rankings" border style="width: 100%">
              <el-table-column type="index"></el-table-column>
              <el-table-column
                label="账户地址">
                <template slot-scope="scope">
                  <h5><a href="javascript:void(0)">{{scope.row.address}}</a></h5>
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="持仓数量">
              </el-table-column>
              <el-table-column
                prop="percentage"
                label="持仓比重">
              </el-table-column>
            </el-table>
          </el-row>

          <el-row class="pagination-row">
            <el-col :offset="14" :md="10" :xl="10" :xs="12">
              <el-pagination
                background
                layout="prev, pager, sizes, next, jumper" :page-size="pagination.limit" @current-change="flipOver"
                :total="pagination.total">
              </el-pagination>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="饼图展示" name="pie">
          <!-- 饼图展示内容 -->
          <el-row>
            <el-col :md="24" :xl="24" :xs="24">
              <div id="chartPie" style="width:100%; height:800px"></div>
            </el-col>
          </el-row>
        </el-tab-pane>

      </el-tabs>
    </el-row>

  </div>
</template>

<script>
  import API from '../../api/api_jingtum';
  import echarts from 'echarts';

  export default {

    data() {
      return {
        tab: 'holders',
        loading: false,
        token: {
          currency: 'SWT',
          issuer: 'SWT',
          total: 4779910000,
          holders: 50
        },
        pagination: {
          total: 100,
          page: 1,
          limit: 20,
        },
        /**
         * 持仓账户信息
         */
        rankings: [
          {
            address: '',
            value: 0,
            percentage: ''
          }
        ],
        pieRankings: [
          {
            address: '',
            value: 0
          }
        ],
        /**
         * 持仓统计饼图
         */
        chartPie: null,
        /**
         * 饼图配置数据
         */
        option: {
          title: {
            text: '持仓排名统计',
            subtext: '排名前20账户',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: ""
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: []
          },
          series: [
            {
              name: '账户地址',
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },

    methods: {
      getParams() {
        let token = this.$route.params.token;
        if (token) {
          this.token = token;
          return this.token;
        }
      },
      tokenInit: function () {

      },
      pieInit() {
        this.option.legend.data = this.pieRankings.map(function (pieRanking, index) {
          return pieRanking.address;
        });
        this.option.series[0].data = this.pieRankings.map(function (pieRanking, index) {
          return {
            value: pieRanking.value,
            name: pieRanking.address
          }
        });
        this.chartPie.setOption(this.option);
        // console.log('pieRanking', this.pieRankings[0].value)
        // console.log('series.data', this.option.series[0].data[0].value + this.option.series[0].data[0].address)
        // console.log('legend.data', this.option.legend.data);
      },
      rankingsInit: async function () {
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          issuer: this.token.issuer,
          currency: this.token.currency
        };
        // 初始化ranking分页数据
        let result = null;
        try {
          result = await this.searchRankings(params);
        } catch (error) {
          console.log(error);
        }
        // 初始化饼图数据
        if (result) {
          this.pieRankings = result.rankings.map(function (ranking, index) {
            return {
              address: ranking.address,
              value: ranking.value
            }
          });
          this.pieInit();
        }
      },
      /**
       * ranking组件初始化，包括代币初始化，持仓排名初始化
       */
      init() {
        this.tokenInit();
        this.rankingsInit();
      },
      flipOver(page) {
        this.pagination.page = page;
        let params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          issuer: this.token.issuer,
          currency: this.token.currency
        };
        this.searchRankings(params);
      },
      searchRankings(params) {
        let that = this;
        return new Promise(function (resolve, reject) {
          that.loading = true;
          API.queryRankings(params).then(result => {
            that.loading = false;
            if (result) {
              // 填充分页数据
              that.pagination.total = result.total;
              that.rankings = result.rankings;
              resolve(result);
            }
          }, err => {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            reject(err);
          }).catch(error => {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            reject(error);
          })
        })
      },
      tabClicked(tab) {
        if (tab && tab.name === 'pie') {
          let that = this;
          setTimeout(function () {
            let chartDiv = document.getElementById('chartPie');
            chartDiv.removeAttribute("_echarts_instance_");//加上这句
            that.chartPie = echarts.init(chartDiv);
            that.chartPie.setOption(that.option);
          }, 100);
        }
      }
    },
    mounted() {
      this.getParams();
      this.chartPie = echarts.init(document.getElementById('chartPie'));
      this.init();
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<style scoped>
  .ranking-item {
    margin-top: 1.5em;
    margin-left: 1.5em;
    margin-right: 1.5em;
  }

  .bottom-line {
    border-bottom: 1px solid #dddddd;
  }

  .tab-row {
    margin-top: 2em;
  }

  .ranking-table {
    margin-top: 2em;
  }
</style>
