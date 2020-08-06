<template>
  <div class="menu">
    <div class="menu_title">
      <span>数据连接</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            添加连接
          </a-menu-item>
          <a-modal
            v-model="visible"
            title="添加连接"
            :footer="null"
            :bodyStyle="{
              maxHeight: `calc( 100vh - 160px )`,
              overflowY: 'auto'
            }"
          >
            <a-row :gutter="[8,8]">
              <a-col
                v-for="item in modelList"
                :key="item.id"
                :span="24 / 3"
              >
                <a-card hoverable :bodyStyle="{padding:'10px 0',fontSize: '12px'}" @click="handleSelectModelType($event,item)">
                    <img
                      slot="cover"
                      :alt="item.name"
                      class="card-img"
                      :src="item.imgurl"
                    />
                    <div class="card-title">{{item.name}}</div>
                  </a-card>
              </a-col>
            </a-row>
          </a-modal>
          <a-menu-item key="1" @click="handleAddNewFolder">
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-empty v-if="tableList.length === 0" class="table_list-_empty">
      <span slot="description">暂无数据库连接</span>
    </a-empty>
    <template v-else>
      <div class="menu_search">
        <a-input placeholder="搜索数据连接名称">
          <a-icon slot="prefix" type="search" />
        </a-input>
      </div>
      <p class="menu_tips">右键文件夹或选项有添加，重命名等操作</p>
      <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
        @click="handleClick"
        @select="handleSelect"
      >
        <template v-for="item in tableList">
          <a-menu-item
            v-if="item.items && item.items.length === 0"
            :key="item.id"
          >
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <a-icon type="folder" /><span>{{ item.name }}</span>
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-sub-menu v-else :key="item.id">
            <span slot="title">
              <a-dropdown :trigger="['contextmenu']">
                <div>
                  <a-icon type="folder" /><span>{{ item.name }}</span>
                </div>
                <a-menu slot="overlay">
                  <a-menu-item>
                    重命名
                  </a-menu-item>
                  <a-menu-item>
                    删除
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
            <a-menu-item v-for="item in item.items" :key="item.id">
              <a-dropdown :trigger="['contextmenu']">
                <div @mouseenter="mouseenter" @mouseleave="mouseleave">
                  <!-- <img
                    src="@/assets/images/icon_my_sql.png"
                    style="width:15px;height:15px"
                  /> -->
                  {{ item.name
                  }}<a-icon type="more" style="margin-left:170px" v-if="icon" />
                </div>
                <a-menu slot="overlay">
                  <a-menu-item>
                    重命名
                  </a-menu-item>
                  <a-menu-item>
                    删除
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </template>
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
export default {
  props: {
    menuData: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tableList: [],
      modelList: ['mysql','oracle','csv'].map(function(item){
        return {
          imgurl: require(`@/assets/images/icon_${item}.png`),
          name: item,
          type: item
        }
      }),
      icon: false,
      current: ["mail"],
      openKeys: ["sub1"],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    };
  },
  mounted() {
    console.log(this.menuData);
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleAddNewFolder() {
      const item = {
        id: this.tableList.length + 1,
        name: "新近文件夹",
        items: []
      };
      this.tableList.push(item);
    },
    handleSelectModelType(event,item){
      event.stopPropagation();
      console.log('model-type', item.type)
      this.visible = false
      this.$store.dispatch('dataAccess/setModelType', item.type);
    },
    handleOk(e) {
      this.visible = false;
    },
    handleClick({ item, key, keyPath }) {
      console.log("click", item);
    },
    handleSelect({ item, key, selectedKeys }) {
      console.log("select", selectedKeys);
    },
    mouseenter(icon) {
      this.icon = true;
    },
    mouseleave() {
      this.icon = false;
    }
  }
};
</script>

<style lang="styl" scope>
@import "./menu.styl";
</style>
