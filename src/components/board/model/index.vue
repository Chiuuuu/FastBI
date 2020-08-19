<!-- 8-14 数据模型侧栏 -->
<template>
  <div class="board-model" :style="config.style">
    <div flex="dir:top" style="height:100%">
      <div class="model-header" v-show="config.title.enable">
        <span class="model-span" v-if="collapse">{{ config.title.text }}</span>
        <a-icon
          type="menu-fold"
          class="model-icon"
          @click="toCollapse"
          :rotate="180"
        ></a-icon>
      </div>
      <!-- 操作界面 -->
      <div class="model-operation" v-if="model">
        <div class="operation_select" v-show="collapse">
          <a-select default-value="电视收拾" style="width:90%">
            <a-select-option value="电视收拾">
              电视收拾
            </a-select-option>
            <a-select-option value="添加数据模型">
              <span @click="handle">添加数据模型</span>
              <a-icon type="rollback" style="margin-left:130px" @click="handle" />
            </a-select-option>
          </a-select>
        </div>
        <div class="operation_search" v-show="collapse">
          <a-input-search placeholder="请输入关键字搜索" style="width:90%" />
        </div>
        <div class="operation_main" v-show="collapse">
          <div class="operation_dim" flex="dir:top">
            <div class="dim_header">
              <span class="d_h_s">维度</span>
              <a-icon class="dicon" type="plus-square" />
            </div>
            <div class="dim_main">
              <a-collapse v-model="activeKey">
                <a-collapse-panel key="1" header="Sheet 1">
                  <a-list
                    item-layout="horizontal"
                    :data-source="dimesion"
                    :split="false"
                  >
                    <a-list-item slot="renderItem" slot-scope="item">
                      <a-list-item-meta>
                        <a slot="title">
                          <img src="@/assets/images/icon_dimension.png" />
                          {{ item.title }}</a
                        >
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
          <div class="operation_mea" flex="dir:top">
            <div class="mea_header">
              <span class="m_h_s">维度</span>
              <a-icon class="micon" type="plus-square" />
            </div>
            <div class="mea_main">
              <a-collapse v-model="activeKey">
                <a-collapse-panel key="2" header="Sheet 1">
                  <a-list
                    item-layout="horizontal"
                    :data-source="measure"
                    :split="false"
                  >
                    <a-list-item slot="renderItem" slot-scope="item">
                      <a-list-item-meta>
                        <a slot="title">
                          <img src="@/assets/images/icon_measure.png" />
                          {{ item.title }}</a
                        >
                      </a-list-item-meta>
                    </a-list-item>
                  </a-list>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </div>
      <!-- 初始界面 -->
      <div class="model-contain" v-else>
        <div class="model-search" v-show="collapse">
          <a-input-search
            placeholder="搜索数据连接名称"
            style="width:90%;margin-left:15px"
          />
        </div>
        <div class="model-main" flex-box="1" v-show="collapse">
          <a-collapse v-model="activeKey" :bordered="false">
            <template #expandIcon="props">
              <a-icon
                type="folder"
                :rotate="props.isActive ? 0 : 0"
                style="font-size:16px"
              />
            </template>
            <a-collapse-panel key="1" header="数据看板" :style="customStyle">
              <div style="margin-left:25px">
                <!-- 暂时写死一个点击事件 -->
                <p @click="handle">电视统计</p>
                <p>用户统计</p>
              </div>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="管理驾驶舱" :style="customStyle">
              <div style="margin-left:25px">
                <p>流失统计</p>
                <p>收入统计</p>
              </div>
            </a-collapse-panel>
            <a-collapse-panel key="3" header="收视分析" :style="customStyle">
              <div style="margin-left:25px">
                <p>月度统计</p>
                <p>年度统计</p>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const dimesion = [
  {
    title: '国家'
  },
  {
    title: '外部账号性质'
  },
  {
    title: '对公对私'
  },
  {
    title: '开户地市'
  },
  {
    title: '开户日期'
  },
  {
    title: '开户省'
  }
]
const measure = [
  {
    title: '余额1'
  },
  {
    title: '余额2'
  },
  {
    title: '余额3'
  },
  {
    title: '余额4'
  },
  {
    title: '余额5'
  }
]

export default {
  name: 'BoardModel',

  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dimesion,
      measure,
      customStyle:
        'background: #ffffff;border-radius: 4px;border: 0;overflow: hidden',
      activeKey: ['1', '2', '3'],
      collapse: true,
      model: false
    }
  },
  methods: {
    // 点击展开收起
    toCollapse() {
      this.collapse = !this.collapse
      this.$emit('on-toggle', this.collapse)
    },
    handle() {
      // this.collapse = !this.collapse
      this.model = !this.model
    }
  }
}
</script>
