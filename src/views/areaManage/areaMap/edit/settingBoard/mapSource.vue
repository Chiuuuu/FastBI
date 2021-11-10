<template>
  <div class="map-setting-source">
    <!-- 维度度量窗口 -->
    <div class="map-setting-field-list">
      <!-- 头部 -->
      <div class="map-setting-header">
        <span>配置数据源</span>
        <a-icon class="close" type="close" @click="$emit('close')" />
      </div>

      <!-- 下拉框添加及字段搜索栏 -->
      <div class="map-setting-choose">
        <div class="options">
          <a-select v-model="currentTableId" class="select" style="width:125px" placeholder="请选择数据接入" @change="getFieldList">
            <a-select-option v-for="item in tableOptions" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
          <a-button style="margin-left:10px" @click="handleAddSource">添加</a-button>
        </div>
        <a-select
          style="width:100%"
          :value="fieldKeyword"
          show-search
          placeholder="请输入关键字搜索"
          :filter-option="fieldFilterOptions"
          @change="handleFocusField"
        >
          <a-select-option v-for="item in dimensions.concat(measures)" :key="item.id" :value="item.id">{{ item.alias }}</a-select-option>
        </a-select>
      </div>

      <!-- 维度度量列表 -->
      <div class="field-list">
        <a-spin :spinning="fieldSpinning">
          <div class="area border-bottom">
            <div class="title">维度</div>
            <ul ref="dimensions" class="list scrollbar">
              <a-tooltip
                v-for="item in dimensions"
                :key="item.id" class="list-item"
                :title="item.alias"
              >
                <!-- <li
                  :tabindex="100"
                  draggable
                  @dragstart="handleDragstart(item)"
                  @dragend="handleDragend(item)"
                  >
                  <img src="@/assets/images/icon_dimension.png" />
                  <span>{{ item.alias }}</span>
                </li> -->
                <li
                  :tabindex="100"
                  @dragstart="handleDragstart(item)"
                  @dragend="handleDragend(item)"
                  >
                  <img src="@/assets/images/icon_dimension.png" />
                  <span>{{ item.alias }}</span>
                </li>
              </a-tooltip>
            </ul>
          </div>
          <div class="area">
            <div class="title">度量</div>
            <ul ref="measures" class="list scrollbar">
              <a-tooltip
                v-for="item in measures"
                :key="item.id" class="list-item"
                :title="item.alias"
              >
                <!-- <li
                  :tabindex="100"
                  draggable
                  @dragstart="handleDragstart(item)"
                  @dragend="handleDragend(item)"
                  >
                  <img src="@/assets/images/icon_measure.png" />
                  <span>{{ item.alias }}</span>
                </li> -->
                <li
                  :tabindex="100"
                  @dragstart="handleDragstart(item)"
                  @dragend="handleDragend(item)"
                  >
                  <img src="@/assets/images/icon_measure.png" />
                  <span>{{ item.alias }}</span>
                </li>
              </a-tooltip>
            </ul>
          </div>
        </a-spin>
      </div>
    </div>

    <!-- 滑动窗口(数据接入列表) -->
    <div :class="['map-setting-source-list', { show: showSourceList }]">
      <div class="map-setting-header">
        <span>选择数据源</span>
        <a-icon class="close" type="right" @click="showSourceList = false;showSourceTable = false" />
      </div>
      <!-- 搜索框 -->
      <a-input-search
        class="source-search"
        placeholder="请输入关键字搜索"
        autocomplete="off"
        @search="handleSearchSource"
        ></a-input-search>
      <!-- 列表 -->
      <div class="source-list menu-wrap">
        <a-spin :spinning="sourceSpinning">
          <div
            class="group"
            :class="folder.fileType === 0 ? 'is-folder' : ''"
            v-for="(folder, index) in searchSourceList"
            :key="folder.id"
          >
            <template v-if="folder.fileType === 0">
              <MenuFolder
                :folder="folder"
                :index="index"
              >
                <template v-slot:file="slotProps">
                  <MenuFile
                    icon="dataSource"
                    :file="slotProps.file"
                    :index="slotProps.index"
                    :parent="folder"
                    @fileSelect="handleSelectSource"
                  ></MenuFile>
                </template>
              </MenuFolder>
            </template>
            <template v-else>
              <ul class="items">
                <MenuFile
                  icon="dataSource"
                  :file="folder"
                  :index="index"
                  @fileSelect="handleSelectSource"
                ></MenuFile>
              </ul>
            </template>
          </div>
        </a-spin>
      </div>
    </div>

    <!-- 选择接入后继续选择库表 -->
    <div :class="['map-setting-source-table', { show: showSourceTable }]">
      <div class="map-setting-header">
        <span>{{ sourceName }}</span>
        <a-icon class="close" type="close" @click="showSourceTable = false" />
      </div>
      <!-- 下拉框搜索框 -->
      <div class="map-setting-choose">
        <div class="options">
          <span>库组: </span>
          <a-select v-model="databaseId" class="select" @change="getTableList" style="width:223px" placeholder="请选择数据接入">
            <a-select-option v-for="item in databaseList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </div>
        <a-input-search placeholder="请输入关键字搜索" autocomplete="off" @search="handleSearchTable"></a-input-search>
      </div>
      <!-- 列表 -->
      <div class="table-list scrollbar">
        <div class="table-list-item" v-for="item in searchTableList" :key="item.id" @click="handleSaveTableId(item)">{{ item.alias }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { menuSearchLoop } from '@/utils/menuSearch'
import MenuFile from '@/components/dataSource/menu-group/file'
import MenuFolder from '@/components/dataSource/menu-group/folder'
export default {
  name: 'mapSource',
  inject: ['settingInstance'],
  components: {
    MenuFolder,
    MenuFile
  },
  data() {
    return {
      sourceSpinning: false,
      tableSpinning: false,
      fieldSpinning: false,
      showSourceList: false, // 显示数据源列表
      showSourceTable: false, // 显示数据源库表

      sourceId: '', // 选中的数据源id
      sourceName: '', // 选中的数据源名称
      sourceList: [], // 数据源列表
      searchSourceList: [], // 搜索结果

      databaseList: [], // 数据库列表
      databaseId: '', // 数据库id

      tableList: [], // 数据表列表
      tableId: '', // 数据表id
      searchTableList: [], // 搜索结果
      tableOptions: [], // 已添加的库表
      currentTableId: undefined, // 当前查询的库表id

      fieldKeyword: undefined, // 搜索字段关键字
      searchFieldList: [], // 搜索字段结果
      dimensions: [], // 维度
      measures: [] // 度量
    }
  },
  created () {
    this.getTableOptions()
  },
  methods: {
    // 获取已添加的数据源
    getTableOptions() {
      this.tableOptions = [
        { name: '源1', id: '1' }
      ]
      this.getFieldList()
    },
    // 获取该源下的字段列表
    getFieldList() {
      this.dimensions = [
        { alias: '维度1111111111111111111111111111111111111111111', id: '1', role: 1 },
        { alias: '维度2', id: '2', role: 1 },
        { alias: '维度3', id: '3', role: 1 },
        { alias: '维度4', id: '4', role: 1 },
        { alias: '维度5', id: '5', role: 1 },
        { alias: '维度6', id: '6', role: 1 },
        { alias: '维度7', id: '7', role: 1 },
        { alias: '维度8', id: '8', role: 1 },
        { alias: '维度9', id: '9', role: 1 },
        { alias: '维度10', id: '10', role: 1 }
      ]
      this.measures = [
        { alias: '度量1', id: '11', role: 2 },
        { alias: '度量222222222222222222222222222222222222222222222', id: '22', role: 2 },
        { alias: '度量3', id: '33', role: 2 },
        { alias: '度量4', id: '44', role: 2 }
      ]
    },
    fieldFilterOptions(input, option) {
      if (!input) return []
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 搜索聚焦字段
    handleFocusField(id) {
      let dIndex = this.dimensions.findIndex(item => item.id === id)
      let mIndex = this.measures.findIndex(item => item.id === id)
      if (dIndex > -1) {
        const dimensions = this.$refs.dimensions.children
        dimensions[dIndex].focus()
      } else if (mIndex > -1) {
        const measures = this.$refs.measures.children
        measures[mIndex].focus()
      }
      this.fieldKeyword = undefined
    },
    // 字段拖拽初始化
    handleDragstart(item) {
      this.settingInstance.dragField = item
    },
    handleDragend(e) {
      this.settingInstance.dragField = {}
    },
    // 点击添加数据源
    handleAddSource() {
      this.showSourceList = true
      this.getSourceList()
    },
    // 获取数据源列表
    async getSourceList() {
      this.sourceSpinning = true
      const result = await this.$server.common.getMenuList('/datasource/catalog/list/1').finally(() => {
        this.sourceSpinning = false
      })
      if (result && result.code === 200) {
        this.sourceList = result.rows
        this.searchSourceList = result.rows
      } else {
        this.$message.error(result.msg || '请求错误')
      }
    },
    // 搜索数据源
    handleSearchSource(value) {
      let result = []
      if (!value) {
        result = this.sourceList
      } else {
        this.sourceList.map(item => {
          const newItem = menuSearchLoop(item, value)
          if (newItem) result.push(newItem)
        })
      }
      this.searchSourceList = result
    },
    // 选中数据源
    async handleSelectSource(file) {
      this.sourceId = file.id
      this.sourceName = file.name
      this.getDataBaseList(file.id)
    },
    // 获取数据库列表(下拉框)
    async getDataBaseList(id) {
      const res = await this.$server.dataModel.getDataBaseDataInfoList(id, '')
      if (res && res.code === 200) {
        this.showSourceTable = true
        this.databaseList = res.data
        if (res.data.length && res.data.length > 0) {
          this.databaseId = res.data[0].id
          this.getTableList()
        }
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 获取当前库下的所有表
    async getTableList() {
      const res = await this.$server.dataModel.getTableListById(this.databaseId)
      if (res && res.code === 200) {
        this.tableList = res.data
        this.searchTableList = res.data
      } else {
        this.$message.error(res.msg || '请求错误')
      }
    },
    // 搜索库表
    handleSearchTable(value) {
      if (!value) {
        this.searchTableList = this.tableList
      } else {
        this.searchTableList = this.tableList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
      }
    },
    // 点击库表获取id
    handleGetTable(table) {
      this.tableId = table.id
      this.handleSaveTableId()
    },
    handleSaveTableId(table) {
      this.tableId = table
      this.tableOptions.push(table)
      this.getFieldList()
    }
  }
}
</script>

<style lang="less" scoped>
@theme-color: #627cff;
@border-color: #d8d8d8;
.map-setting-source {
  float: left;
  width: 220px;
  height: 100%;
  border-left: 1px solid @border-color;
  box-shadow: -1px 0px 5px rgba(0,0,0,.2);
  overflow: hidden;

  .map-setting-header {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid @border-color;
    .close {
      float: right;
      margin-top: 13px;
      cursor: pointer;
    }
  }
  .map-setting-choose {
    margin: 10px 0;
    .select {
      margin-bottom: 10px;
    }
  }

  .map-setting-field-list {
    width: 220px;
    height: 100%;
    padding: 0 10px;
    .field-list {
      height: calc(100% - 140px);
      .area {
        height: 50%;
        line-height: 24px;
        padding-bottom: 10px;
        &.border-bottom {
          border-bottom: 1px solid @border-color;
        }
      }
      .title {
        padding: 0 10px;
      }
      .list {
        height: calc(100% - 24px);
        overflow-y: auto;
      }
      .list-item {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        padding: 0 10px;
        &:hover,
        &:focus {
          background: @theme-color;
          color: #fff;
        }
        & > span {
          margin-left: 8px;
        }
        & > img {
          vertical-align: top;
          padding-top: 5px;
        }
      }
    }
  }

  .map-setting-source-list {
    position: absolute;
    top: 0;
    right: -219px;
    z-index: 10;

    width: 219px;
    height: 100%;
    background: #fff;
    transition: right 0.3s ease-in;
    padding: 0 10px;

    &.show {
      right: 0;
    }
    .source-search {
      margin: 10px 0;
    }
    .source-list {
      height: calc(100% - 100px);
      width: 100%;
      overflow-y: auto;
    }
  }
  .map-setting-source-table {
    display: none;
    position: absolute;
    right: 220px;
    top: 0;
    width: 278px;
    height: 100%;
    background: #fff;
    transition: right 0.3s ease-in;
    padding: 0 10px;

    &.show {
      display: block;
    }
    .table-list {
      height: calc(100% - 140px);
      width: 100%;
      overflow-y: auto;
    }
    .table-list-item {
      line-height: 24px;
      cursor: pointer;
      &:hover {
        background: @theme-color;
        color: #fff;
      }
    }
  }
}
</style>
