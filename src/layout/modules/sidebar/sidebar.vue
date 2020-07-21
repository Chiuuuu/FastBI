<template>
  <div :style="sidebarStyle" class="sidebar">
    <div class="header">
      <!-- <img :style="logoStyle" src="@/static/imgs/logo.png" alt="" /> -->
      <span v-show="sidebarUnfold == false">智能BI可视化平台</span>
    </div>
    <a-menu
      :defaultSelectedKeys="[sidebarActive]"
      :defaultOpenKeys="[sidebarActive.slice(0, 1)]"
      :inlineCollapsed="sidebarUnfold"
      mode="inline"
      theme="dark"
    >
      <a-sub-menu v-for="(item, index) in sidebarArr" :key="index + '_'">
        <template v-if="item.children.length > 0">
          <span slot="title">
            <a-icon :type="item.icon" />
            <span v-show="sidebarUnfold == false">{{ item.name }}</span>
          </span>
          <a-menu-item
            v-for="i in item.children"
            :key="i.id"
            @click="selectMenu(i, i.id)"
            >{{ i.name }}</a-menu-item
          >
        </template>
      </a-sub-menu>
      <a-menu-item v-for="item in sidebarArr" :key="item.id">
        <template v-if="item.children.length == 0">
          <a-icon :type="item.icon" />
          <span v-show="sidebarUnfold == false">{{ item.name }}</span>
        </template>
      </a-menu-item>
    </a-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sidebarStyle: {
        width: ""
      },
      logoStyle: {
        left: "",
        transform: ""
      },
      sidebarArr: [
        {
          name: "大屏管理",
          id: "1",
          icon: "desktop",
          path: "",
          children: [
            { name: "大屏目录", id: "1-1", path: "/userManage/accountManage" }
          ]
        },
        {
          name: "数据源",
          id: "2",
          icon: "apartment",
          path: "",
          children: [
            {
              name: "数据接入",
              id: "2-1",
              path: "/dataSource/dataAccess"
            },
            {
              name: "数据模型",
              id: "2-2",
              path: "/dataSource/dataModel"
            }
          ]
        },
        {
          name: "系统管理",
          id: "3",
          icon: "tool",
          path: "",
          children: [
            { name: "栏目配置", id: "3-1", path: "/columnManage/columnConfig" }
          ]
        }
      ]
    };
  },
  created() {
    if (this.sidebarUnfold == true) {
      this.sidebarStyle = {
        width: "80px"
      };
      this.logoStyle = {
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
    } else {
      this.sidebarStyle = {
        width: "220px"
      };
      this.logoStyle = {
        left: "20px",
        transform: "translateY(-50%)"
      };
    }
  },
  watch: {
    sidebarUnfold() {
      if (this.sidebarUnfold == true) {
        this.sidebarStyle = {
          width: "80px"
        };
        this.logoStyle = {
          left: "50%",
          transform: "translate(-50%, -50%)"
        };
      } else {
        this.sidebarStyle = {
          width: "220px"
        };
        this.logoStyle = {
          left: "20px",
          transform: "translateY(-50%)"
        };
      }
    }
  },
  computed: {
    // 侧边栏展开收起
    sidebarUnfold() {
      return this.$store.state.common.sidebarUnfold;
    },

    sidebarActive() {
      return this.$store.state.common.navMenuActive;
    }
  },
  methods: {
    // 点击选择菜单栏跳转页面
    selectMenu(item, id) {
      console.log(item);
      console.log(id);
      this.$store.commit("common/set_navMenuActive", item.id);
      this.$router.push({
        path: item.path
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./sidebar.scss";
</style>
