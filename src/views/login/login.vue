<template>
  <div class="login" flex="main:center cross:center">
    <div class="login-form" flex="dir:top">
      <div class="login-title">
        <img src="../../assets/images/login/logo_liantong.png" alt="智能大数据分析平台" />
      </div>
      <div class="login-form-main">
        <a-form-model ref="form" :model="form" :rules="rules" @submit="handleSubmit" @submit.native.prevent>
          <a-form-model-item prop="username">
            <a-input v-model="form.username" size="large" placeholder="请输入用户名">
              <a-icon slot="prefix" type="user" class="login-form-icon" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input v-model="form.password" type="password" size="large" placeholder="请输入登录密码">
              <a-icon slot="prefix" type="lock" class="login-form-icon" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="identity">
            <a-input v-model="form.identity" size="large" placeholder="请输入验证码">
              <a-icon slot="prefix" type="safety-certificate" class="login-form-icon" />
              <div slot="addonAfter" class="login-form-identity">1234</div>
            </a-input>
          </a-form-model-item>
          <!-- <a-form-model-item>
            <a-checkbox
              style="width:100%;height:40px"
              v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true
                }
              ]"
            >记住登录状态</a-checkbox>
          </a-form-model-item>-->
          <a-form-model-item>
            <a-button
              type="primary"
              size="large"
              class="login-form-button"
              block
              html-type="submit"
              :loading="loading"
            >登录</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import omit from 'lodash/omit'
export default {
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        identity: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名！' }],
        password: [{ required: true, message: '请输入登录密码！' }],
        identity: [{ required: true, message: '请输入验证码！' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((ok) => {
        if (ok) {
          if (this.form.identity !== '1234') {
            return this.$message.error('验证码错误')
          }
          let params = {
            username: this.form.username,
            password: this.form.password
          }
          this.loading = true
          this.$server.login.actionLogin(params)
            .then((res) => {
              if (res.code === 200) {
                this.$store.dispatch('common/set_token', res.token)
                const { query } = this.$route
                const { redirect } = query
                this.$router.push({
                  path: redirect && redirect !== '/login' ? redirect : '/',
                  query:
                    redirect && redirect !== '/login'
                      ? omit(query, 'redirect')
                      : ''
                })
              } else {
                this.$message.error(res.msg)
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
@deep: ~'>>>';
// 大背景
.login {
  position: relative;
  background: url('../../assets/images/login/background_liantong.png') no-repeat;
  background-size: auto 100%;
  width: 100%;
  height: 100%;
  overflow: auto;

  // 登录窗口
  .login-form {
    position: absolute;
    right: 153px;
    top: 50%;
    transform: translateY(-190px);

    width: 470px;
    height: 400px;
    background: #fff;
    align-items: center;
    justify-content: center;
    padding: 30px 40px;
    box-shadow: 0 4px 24px 0 rgba(44, 78, 177, 0.5);
    border-radius: 4px;

    @{deep} .ant-input {
      padding-left: 40px !important;
    }
    // 标题背景
    .login-title {
      height: 60px;
      width: 100%;
      padding: 0 24px;
      img {
        width: 100%;
      }
    }
    .login-form-main {
      width: 100%;
      margin-top: 20px;
    }

    .login-form-icon {
      font-size: 16px;
      color: #8e97a8;
    }

    .login-form-identity-box {
      display: flex;
    }

    @{deep} .ant-input-group-addon {
      padding: 0;
    }

    .login-form-identity {
      width: 105px;
      height: 38px;
      line-height: 38px;
      background-image: linear-gradient(to right, #e0e0e0, #f5f5f5);
      text-align: center;
      color: #bb1c23;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
