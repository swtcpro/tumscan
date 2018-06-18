<template>
  <el-container>
    <el-header class="el-header" height="100">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :xs="0" :md="4" :xl="4" style="margin-top: 30px">
          <a class="logo" href="/" target="_parent" title="Home Page">
            <img src="../assets/icon/SWTC_logo.jpg" style="height: 64px; width: 64px" alt="Logo"/>
            <span style="font-size: 30px">Tumscan</span>
          </a>
        </el-col>
        <el-col :xs="0" :md="4" :xl="4">
        </el-col>
        <el-col :md="6" :xl="6" :xs="24">
          <el-input placeholder="请输入钱包地址/交易哈希" v-model="searchInput" class="input-with-button">
            <el-button slot="append" icon="el-icon-search" v-on:click="handleSearch"></el-button>
          </el-input>
          <!-- 导航菜单 -->
          <el-menu :defaultActive="currentIndex" router mode="horizontal">
            <template v-for="(item, index) in $router.options.routes" v-if="item.menuShow">
              <el-submenu v-if="!item.leaf" :index="index+''">
                <template slot="title"><span slot="title">{{item.label}}</span></template>
                <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
                              :class="$route.path==term.path?'is-active':''">
                  <span slot="title">{{term.label}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                            :class="$route.path==item.children[0].path?'is-active':''">
                <span slot="title">{{item.children[0].label}}</span>
              </el-menu-item>

            </template>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-col :span="24" class="main" v-loading='loading' element-loading-text="拼命加载中">
        <section class="content-container">
          <el-row type="flex" justify="center">
            <!--<el-col :span="16" :offset="4" class="content-wrapper">-->
            <el-col :md="16" :xs="24" class="content-wrapper">
              <router-view></router-view>
            </el-col>
          </el-row>
        </section>
      </el-col>
    </el-main>

    <el-footer height="270px">
      <el-row :gutter="40" type="flex" justify="center" class="footer-row">

        <!-- footer左侧内容展示 -->
        <!--<el-col :span="4" class="footer-left">-->
        <el-col :xs="0" :md="4" :xl="4" class="footer-left">
          <a>
            <img class="footer-logo" src="../assets/icon/Powered-by-hptpd-small.png"/>
            <p style="color: white">Tumscan是一个井通区块链浏览、分析和去中心化智能合同平台</p>
          </a>
        </el-col>

        <!-- footer中间内容展示 -->
        <!--<el-col :span="8" class="footer-center">-->
        <el-col :xs="24" :md="8" class="footer-center">
          <el-row style="margin-top: 17px">
            <!--<el-col :span="20">-->
            <el-col :md="20" :xs="20">
              <h4 style="color: white">最新讨论</h4>
            </el-col>
            <!--<el-col :span="4">-->
            <el-col :md="4" :xs="4">
              <el-button type="text">全部</el-button>
            </el-col>
          </el-row>
          <div class="footline"></div>
          <el-row>

            <ul style="padding-left: 0px">
              <li>
                <el-col :span="23">
                  <img src="../assets/icon/comment-white.png"/><a href="javascript:void(0)"
                                                                  style="margin-left:5px;color: white">
                  someone needs to show us how exactly people are getting ...</a>
                </el-col>
                <el-col :span="1">
                  <img src="../assets/icon/arrow-right.png"/>
                </el-col>
              </li>

            </ul>
          </el-row>
        </el-col>

        <!-- footer右侧内容展示 -->
        <!--<el-col :span="4" class="footer-right">-->
        <el-col :xs="0" :md="4" class="footer-right">
          <el-row style="margin-top: 17px">
            <div>
              <!--<el-col :span="20">-->
              <el-col :xs="20">
                <h4 style="color: white">链接</h4>
              </el-col>
              <!--<el-col :span="4">-->
              <el-col :xs="4">
              </el-col>
            </div>
          </el-row>
          <div class="footline"></div>
          <el-row>
            <address>
              <table>
                <tbody>
                <tr>
                  <td>
                    <i class="iconfont icon-mail"></i>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                    <a href="javascript:void(0)">联系我们</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i class="iconfont icon-qq"></i>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                    <a href="javascript:void(0)">QQ:&nbsp;&nbsp;616958232</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i class="iconfont icon-weixin"></i>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                    <a href="javascript:void(0)">微信:&nbsp;&nbsp;tracy4262</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i class="iconfont icon-xinxiang"></i>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                    <a href="javascript:void(0)">关于我们</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <i class="iconfont icon-blocks"></i>
                    &nbsp;
                  </td>
                  <td>
                    &nbsp;
                    <a href="javascript:void(0)">团队服务</a>
                  </td>
                </tr>

                </tbody>
              </table>
            </address>
          </el-row>

        </el-col>
      </el-row>
    </el-footer>
  </el-container>

</template>

<script>
  import API from '../api/api_jingtum';
  import ElContainer from "element-ui/packages/container/src/main";
  import ElCard from "../../node_modules/element-ui/packages/card/src/main.vue";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    components: {
      ElCol,
      ElCard,
      ElContainer
    },
    name: "home",

    data() {
      return {
        currentIndex: '1',
        loading: false,
        // 地址搜索input绑定数据
        searchInput: '',
      }
    },
    methods: {
      // 地址搜索点击事件回调函数
      handleSearch: function () {
        let that = this;
        that.loading = true;
        let pathVariable = this.searchInput;
        API.verifyWalletAndHash(pathVariable).then(function (result) {
          that.loading = false;
          console.log(result);
          if (result.success === false) {
            // 弹出对话框提示输入地址和交易号有误 result.msg
            that.$message({
              duration: 5000,
              message: result.msg,
              type: 'error'
            });
          } else if (result.success === true && result.type === 'wallet') {
            that.$router.push({
              name: 'account',
              params: {pathVariable}
            });
          } else {
            // 此处应该是跳转到单个交易详情的页面
            let hash = pathVariable;
            that.$router.push({
              name: 'transaction',
              params: {hash}
            });
          }
        }, function (err) {
          that.loading = false;
          console.log(err);
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });


      }
    }
  }
</script>

<style scoped>

  .el-header {
    border-bottom: solid 2px rgb(238, 238, 238);
  }

  .footer-logo {
    margin: 17px 0 20px;
  }

  .footline {
    margin: 0px 0 25px;
    border-bottom: 1px dotted #e4e9f0;
  }

  .el-footer {
    background-color: #272727;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  /*.logo {*/
  /*margin-top: 30px;*/
  /*}*/

  .input-with-button {
    margin-top: 16px;
  }

</style>
