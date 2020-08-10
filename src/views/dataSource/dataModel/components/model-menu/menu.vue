<template>
  <div class="model-menu">
    <div class="menu_title">
      <span>数据模型</span>
      <a-dropdown :trigger="['click']" placement="bottomLeft">
        <a class="ant-dropdown-link">
          <a-icon type="plus-square" class="menu_icon" />
        </a>
        <a-menu slot="overlay" class="drow_menu">
          <a-menu-item v-on:click="showModal">
            添加连接
          </a-menu-item>
          <a-modal v-model="visible" title="选择数据链接" @ok="handleOk">
            <div>
              <a-input
                placeholder="搜索数据链接名称"
                style="width:60%; margin-left:100px"
              ></a-input>
            </div>
            <a style="margin-left:100px;margin-top:100px">新建数据链接</a>
            <a-menu
              :default-selected-keys="['1']"
              :default-open-keys="['sub1']"
              mode="inline"
              style="width:60%; margin-left:78px"
            >
              <a-sub-menu>
                <span slot="title"
                  ><a-icon type="folder" /><span>零售数据</span></span
                >
                <a-menu-item> <a-icon type="project" />数据模型1 </a-menu-item>
                <a-menu-item> <a-icon type="project" />数据模型2 </a-menu-item>
                <a-menu-item> <a-icon type="project" />数据模型3 </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-modal>
          <a-menu-item>
            新建文件夹
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="menu_search">
      <a-input placeholder="搜索数据模型名称">
        <a-icon slot="prefix" type="search" />
      </a-input>
    </div>
    <div class="menu_menu">
      <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        mode="inline"
      >
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder" /><span>金融行业</span></span
          >
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型1
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型2
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型3
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型4
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
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
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="folder" /><span>零售数据</span></span
          >
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型1
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型2
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
                <a-menu-item>
                  重命名
                </a-menu-item>
                <a-menu-item>
                  删除
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-menu-item>
          <a-menu-item>
            <a-dropdown :trigger="['contextmenu']">
              <div>
                <img
                  src="@/assets/images/icon_dimension.png"
                  style="width:15px;height:15px"
                />
                数据模型3
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  复制
                </a-menu-item>
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
      </a-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      openKeys: ['sub1'],
      visible: false
    }
  }
}

</script>

<style lang="styl" scoped>
  @import "./menu.styl";
</style>
