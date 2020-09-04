<template>
  <div :class="{'board-options': true, 'is-expand': optionsExpand}"
       :style="config.style">
    <div class="header-title" v-if="config.title&&config.title.enable">
      <span v-if="!currentSelected">{{ config.title.text }}</span>
      <div class="tabs" v-else>
        <div class="tab-item" :class="{'active':tabsType===0}" @click="tabsTypeChange(0)">
          样式
        </div>
        <div class="tab-item" v-if="currentSelected.packageJson.name!=='ve-image'"
          :class="{'active':tabsType===1}" @click="tabsTypeChange(1)">
          数据
        </div>
        <!-- <div class="tab-item" v-if="currentSelected.packageJson.name!=='ve-image'"
          :class="{'active':tabsType===2}" @click="tabsTypeChange(2)">
          交互
        </div> -->
      </div>
    </div>
    <div class="options-body">
      <b-scrollbar style="height: 100%;">
        <div class="page-config" v-if="!currentSelected">
          <gui-field label="页面尺寸">
            <div class="gui-inline">
              <a-input-number v-model="globalSettings.width" size="small"
                              :formatter="value => `宽 ${value}`"
                              @change="setPageSetting"></a-input-number>
            </div>
            <div class="gui-inline">
              <a-input-number v-model="globalSettings.height" size="small"
                              :formatter="value => `高 ${value}`"
                              @change="setPageSetting"></a-input-number>
            </div>
          </gui-field>
          <!-- <gui-field label="背景颜色">
            <el-color-picker v-model="globalSettings.backgroundColor" show-alpha
                             @change="setPageSetting"></el-color-picker>
          </gui-field> -->
          <gui-field label="背景设置">
            <a-radio-group v-model="globalSettings.backgroundType" name="radioGroup">
            <a-radio :style="radioStyle" value="1" @click.native.stop="globalBgChange($event, globalSettings, 'backgroundType')">
              <gui-field label="背景颜色">
                <el-color-picker v-model="globalSettings.backgroundColor" show-alpha
                                @change="setPageSetting"></el-color-picker>
              </gui-field>
            </a-radio>
            <a-radio :style="radioStyle" value="2" @click.native.stop="globalBgChange($event, globalSettings, 'backgroundType')">
              <gui-field label="背景图片">
                <div>
                  <a-button size="small" @click.native.stop="addGlobalPhoto" :disabled="globalSettings.backgroundType!=='2'">上传</a-button>
                  <input
                      id="globalPhoto"
                      ref="img_input1"
                      type="file"
                      name
                      accept="image/png, image/jpeg, image/gif"
                      style="display:none"
                      @change="selectPhoto($event, globalSettings, 'globalSettings')"
                    />
                </div>
              </gui-field>
            </a-radio>
          </a-radio-group>
          </gui-field>

          <gui-field label="栅格间距">
            <a-input-number v-model="globalSettings.gridStep" size="small" :min="2" :max="20"
                            @change="setPageSetting"></a-input-number>
          </gui-field>
          <gui-field label="重置">
            <a-button type="primary" size="small" @click="resetSetting">恢复默认配置</a-button>
          </gui-field>
        </div>
        <div class="block-config" v-else>
          <div v-if="tabsType===0">
            <a-collapse v-model="collapseActive">
              <gui-field label="位置">
                <gui-inline>
                  <a-input-number v-model="baseProperty.x" size="small"
                                  :formatter="value => `X ${value}`"
                                  :parser="value => value.replace(/\X\s?|(,*)/g, '')"
                                  @change="setBaseProperty"></a-input-number>
                </gui-inline>
                <gui-inline>
                  <a-input-number v-model="baseProperty.y" size="small"
                                  :formatter="value => `Y ${value}`"
                                  :parser="value => value.replace(/\Y\s?|(,*)/g, '')"
                                  @change="setBaseProperty"></a-input-number>
                </gui-inline>
              </gui-field>
              <gui-field label="尺寸">
                <gui-inline>
                  <a-input-number v-model="baseProperty.width" size="small"
                                  :formatter="value => `W ${value}`"
                                  :parser="value => value.replace('W', '')"
                                  @change="setBaseProperty"></a-input-number>
                </gui-inline>
                <gui-inline>
                  <a-input-number v-model="baseProperty.height" size="small"
                                  :formatter="value => `H ${value}`"
                                  :parser="value => value.replace(/\H\s?|(,*)/g, '')"
                                  @change="setBaseProperty"></a-input-number>
                </gui-inline>
              </gui-field>

              <!--标题 noTitle图片没有标题-->
              <template v-if="selfConfig.title && !selfConfig.noTitle">
                <a-collapse-panel key="title" header="标题">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('title') > -1" v-model="selfConfig.title.show" default-checked @change="switchChange" size="small" />
                  <gui-field label="标题名">
                    <a-input v-model="selfConfig.title.content" size="small" :maxLength="20" @change="setSelfProperty"></a-input>
                  </gui-field>
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.title.textStyle.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.title.textStyle.color"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="对齐方式">
                    <a-radio-group :value="selfConfig.title.textAlign" size="small" >
                      <a-radio-button value="left" @click.native.stop="onAlignChange(selfConfig.title, $event)">
                        <a-icon type="align-left" value="left" />
                      </a-radio-button>
                      <a-radio-button value="center" @click.native.stop="onAlignChange(selfConfig.title, $event)">
                        <a-icon type="align-center" value="center" />
                      </a-radio-button>
                      <a-radio-button value="right" @click.native.stop="onAlignChange(selfConfig.title, $event)">
                        <a-icon type="align-right" value="right" />
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--grid-->
              <template v-if="showGrid">
                <a-collapse-panel key="grid" header="图形属性">
                  <gui-field label="边距">
                    <gui-inline>
                      <a-input-number v-model="selfConfig.grid.top" size="small"
                                      :formatter="value => `上 ${value}`"
                                      :parser="value => value.replace(/\上\s?|(,*)/g, '')"
                                      :min="0" :max="60" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline>
                      <a-input-number v-model="selfConfig.grid.bottom" size="small"
                                      :formatter="value => `下 ${value}`"
                                      :min="0" :max="60" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="">
                    <gui-inline>
                      <a-input-number v-model="selfConfig.grid.left" size="small"
                                      :formatter="value => `左 ${value}`"
                                      :min="0" :max="60" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline>
                      <a-input-number v-model="selfConfig.grid.right" size="small"
                                      :formatter="value => `右 ${value}`"
                                      :min="0" :max="60" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="区域透明度" v-if="isLine">
                    <a-input-number v-model="selfConfig.series.areaStyle.opacity" size="small"
                                    :max="1" :min="0" :step="0.1" @change="setSelfProperty"></a-input-number>
                  </gui-field>
                  <gui-field label="曲线" v-if="isLine">
                    <a-switch v-model="selfConfig.series.smooth" size="small" @change="setSelfProperty"></a-switch>
                  </gui-field>
                  <!-- <gui-field label="标记点" v-if="isLine"> {{selfConfig.series.symbol}}
                    <a-switch v-model="selfConfig.series.symbol" size="small" @change="setSelfProperty"></a-switch>
                  </gui-field> -->
                  <gui-field label="线宽" v-if="isLine">
                    <a-input-number v-model="selfConfig.series.lineStyle.width" size="small"
                                    :min="0"  @change="setSelfProperty"></a-input-number>
                  </gui-field>
                  <gui-field label="展示数值">
                    <a-switch v-model="selfConfig.series.label.show" size="small" @change="setSelfProperty"></a-switch>
                  </gui-field>
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.series.label.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.series.label.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="柱条宽度" v-if="isHistogram">
                    <a-input size="small" @change="setSelfProperty"
                             v-model="selfConfig.series.barWidth" clearable></a-input>
                  </gui-field>
                </a-collapse-panel>
              </template>

              <template v-if="isPie">
                <a-collapse-panel key="properties" header="图形属性">
                  <gui-field label="中心坐标">
                    <gui-inline>
                      <a-input v-model="selfConfig.series.center[0]" size="small"
                                placeholder="默认50%"
                                @change="setSelfProperty"
                                ><span slot="prefix">x</span></a-input>
                    </gui-inline>
                    <gui-inline>
                      <a-input v-model="selfConfig.series.center[1]" size="small"
                                placeholder="默认50%"
                                @change="setSelfProperty"
                                ><span slot="prefix">y</span></a-input>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="内环大小">
                    <a-input v-model="selfConfig.series.radius[0]" size="small"
                              placeholder="默认0"
                              style="width:100px"
                              @change="setSelfProperty"></a-input>
                  </gui-field>
                  <gui-field label="外径大小">
                    <a-input v-model="selfConfig.series.radius[1]" size="small"
                              placeholder="默认50%"
                              style="width:100px"
                              @change="setSelfProperty"></a-input>
                  </gui-field>
                  <gui-field label="是否启用玫瑰图">
                    <a-switch v-model="selfConfig.series.roseType" size="small"
                              @change="switchChange"></a-switch>
                  </gui-field>
                </a-collapse-panel>
                <a-collapse-panel key="indicator" header="指标设置">
                  <a-switch slot="extra"
                            v-if="collapseActive.indexOf('indicator') > -1"
                            v-model="selfConfig.series.label.show"
                            default-checked @change="switchChange" size="small" />
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.series.label.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.series.label.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="显示位置">
                    <a-radio-group :value="selfConfig.series.label.position" size="small" >
                      <a-radio-button value="inside" @click.native.stop="onRadioChange($event, selfConfig.series.label, 'position')">
                        内部
                      </a-radio-button>
                      <a-radio-button value="outside" @click.native.stop="onRadioChange($event, selfConfig.series.label, 'position')">
                        外部
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                </a-collapse-panel>
              </template>

              <!--图例-->
              <template v-if="selfConfig.legend">
                <a-collapse-panel key="legend" header="图例设置">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('legend') > -1" v-model="selfConfig.legend.show" default-checked @change="switchChange" size="small" />
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.legend.textStyle.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.legend.textStyle.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="样式">
                    <gui-inline label="图例间隔">
                      <a-input-number v-model="selfConfig.legend.itemGap" size="small"
                                      :min="0" :max="50" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="图标">
                      <a-select v-model="selfConfig.legend.icon" style="width: 100px" size="small" @change="setSelfProperty">
                        <a-select-option value="">正常</a-select-option>
                        <a-select-option value="circle">圆形</a-select-option>
                        <a-select-option value="rect">矩形</a-select-option>
                        <a-select-option value="roundRect">圆矩形</a-select-option>
                        <a-select-option value="diamond">菱形</a-select-option>
                      </a-select>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="位置">
                    <gui-inline>
                      <a-radio-group :value="selfConfig.legend.left" size="small" >
                        <a-radio-button value="left" @click.native.stop="onRadioChange($event, selfConfig.legend, 'left')">
                          左
                        </a-radio-button>
                        <a-radio-button value="center" @click.native.stop="onRadioChange($event, selfConfig.legend, 'left')">
                          中
                        </a-radio-button>
                        <a-radio-button value="right" @click.native.stop="onRadioChange($event, selfConfig.legend, 'left')">
                          右
                        </a-radio-button>
                      </a-radio-group>
                    </gui-inline>
                  </gui-field>
                  <gui-field>
                    <gui-inline>
                      <a-radio-group :value="selfConfig.legend.top" size="small" >
                        <a-radio-button value="top" @click.native.stop="onRadioChange($event, selfConfig.legend, 'top')">
                          顶部
                        </a-radio-button>
                        <a-radio-button value="middle" @click.native.stop="onRadioChange($event, selfConfig.legend, 'top')">
                          居中
                        </a-radio-button>
                        <a-radio-button value="bottom" @click.native.stop="onRadioChange($event, selfConfig.legend, 'top')">
                          底部
                        </a-radio-button>
                      </a-radio-group>
                    </gui-inline>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--雷达图独有-->
              <template v-if="isRadar">
                <a-collapse-panel key="radar" header="图形属性">
                  <gui-field label="中心坐标">
                    <gui-inline>
                      <a-input v-model="selfConfig.radar.center[0]" size="small"
                                placeholder="支持百分比或像素"
                                @change="setSelfProperty"
                                ><span slot="prefix">x</span></a-input>
                    </gui-inline>
                    <gui-inline>
                      <a-input v-model="selfConfig.radar.center[1]" size="small"
                                placeholder="支持百分比或像素"
                                @change="setSelfProperty"
                                ><span slot="prefix">y</span></a-input>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="雷达图半径">
                    <a-input v-model="selfConfig.radar.radius" size="small" style="width:100px;" @change="setSelfProperty"></a-input>
                  </gui-field>
                  <gui-field label="雷达图类型">
                    <a-radio-group :value="selfConfig.radar.shape" size="small" >
                      <a-radio-button value="circle" @click.native.stop="onRadioChange($event, selfConfig.radar, 'shape')">
                        圆形
                      </a-radio-button>
                      <a-radio-button value="polygon" @click.native.stop="onRadioChange($event, selfConfig.radar, 'shape')">
                        三角形
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                  <gui-field label="指标">
                    <a-switch v-model="selfConfig.series.label.show" size="small"
                              @change="switchChange"></a-switch>
                  </gui-field>
                  <gui-field label="指标文本" v-if="selfConfig.series.label.show">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.series.label.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.series.label.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="指标位置" v-if="selfConfig.series.label.show">
                    <a-radio-group :value="selfConfig.series.label.position" size="small" >
                      <a-radio-button value="inside" @click.native.stop="onRadioChange($event, selfConfig.series.label, 'position')">
                        内部
                      </a-radio-button>
                      <a-radio-button value="top" @click.native.stop="onRadioChange($event, selfConfig.series.label, 'position')">
                        顶部
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--x轴-->
              <template v-if="showXAxis">
                <a-collapse-panel key="xAxis" header="x轴">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('xAxis') > -1" v-model="selfConfig.xAxis.show" default-checked @change="switchChange" size="small" />
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.xAxis.axisLabel.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.xAxis.axisLabel.color"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="倾斜角度">
                    <a-input-number v-model="selfConfig.xAxis.axisLabel.rotate" size="small"
                                    :min="0" :max="90" @change="setSelfProperty"></a-input-number>
                  </gui-field>
                  <gui-field label="轴线颜色">
                    <el-color-picker v-model="selfConfig.xAxis.axisLine.lineStyle.color"
                                      show-alpha @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="是否网格线">
                    <a-switch v-model="selfConfig.xAxis.splitLine.show" default-checked @change="switchChange" size="small" />
                  </gui-field>
                  <gui-field label="网格线颜色" v-if="selfConfig.xAxis.splitLine.show">
                    <el-color-picker v-model="selfConfig.xAxis.splitLine.lineStyle.color"
                                      show-alpha @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="标题">
                    <a-input v-model="selfConfig.xAxis.name" @change="setSelfProperty" style="width:100px;" size="small"></a-input>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--y轴-->
              <template v-if="showYAxis">
                <a-collapse-panel key="yAxis" header="y轴">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('yAxis') > -1" v-model="selfConfig.yAxis.axisLine.show" default-checked @change="switchChange" size="small" />
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.yAxis.axisLabel.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.yAxis.axisLabel.color"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="轴线颜色">
                    <el-color-picker v-model="selfConfig.yAxis.axisLine.lineStyle.color"
                                      show-alpha @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="是否网格线">
                    <a-switch v-model="selfConfig.yAxis.splitLine.show" default-checked @change="switchChange" size="small" />
                  </gui-field>
                  <gui-field label="网格线颜色" v-if="selfConfig.yAxis.splitLine.show">
                    <el-color-picker v-model="selfConfig.yAxis.splitLine.lineStyle.color"
                                      show-alpha @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--地图独有-->
              <template v-if="isMap">
                <a-collapse-panel key="map" header="视觉映射">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('map') > -1" v-model="selfConfig.visualMap.show" default-checked size="small" @change="switchChange" />
                  <gui-field label="类型">
                    <a-radio-group :value="selfConfig.visualMap.type" size="small" >
                      <a-radio-button value="piecewise" @click.native.stop="onRadioChange($event, selfConfig.visualMap, 'type')">
                        分段型
                      </a-radio-button>
                      <a-radio-button value="continuous" @click.native.stop="onRadioChange($event, selfConfig.visualMap, 'type')">
                        连续型
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                  <gui-field label="极值">
                    <gui-inline label="最小值">
                      <a-input-number v-model="selfConfig.visualMap.min" size="small" :min="0"
                                      @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="最大值">
                      <a-input-number v-model="selfConfig.visualMap.max" size="small" :min="0"
                                      @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.visualMap.textStyle.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.visualMap.textStyle.color"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="图元大小">
                    <gui-inline label="最小值">
                      <a-input-number v-model="selfConfig.visualMap.inRange.symbolSize[0]" size="small" :min="0"
                                      @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="最大值">
                      <a-input-number v-model="selfConfig.visualMap.inRange.symbolSize[1]" size="small" :min="0"
                                      @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="图元颜色">
                    <div>
                      <gui-colors v-for="(c,index) of selfConfig.visualMap.inRange.color" :key="index+c">
                        <el-color-picker v-model="selfConfig.visualMap.inRange.color[index]"
                                         :predefine="predefineColors" @change="setSelfProperty"></el-color-picker>
                      </gui-colors>
                    </div>
                  </gui-field>
                </a-collapse-panel>
                <a-collapse-panel key="geo" header="地理坐标系">
                  <gui-field label="视角缩放">
                    <a-input-number v-model="selfConfig.geo.zoom" size="small" :min="0" :step="0.1"
                                    @change="setSelfProperty"></a-input-number>
                  </gui-field>
                  <gui-field label="文本">
                    <a-switch v-model="selfConfig.geo.label.normal.show" size="small"
                              @change="switchChange"></a-switch>
                  </gui-field>
                  <gui-field label="文本样式" v-if="selfConfig.geo.label.normal.show">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.geo.label.normal.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.geo.label.normal.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="文本悬停">
                    <a-switch v-model="selfConfig.geo.label.emphasis.show" size="small"
                              @change="switchChange"></a-switch>
                  </gui-field>
                  <gui-field label="文本悬停样式" v-if="selfConfig.geo.label.emphasis.show">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.geo.label.emphasis.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.geo.label.emphasis.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="多边形">
                    <gui-inline label="区域" style="width:auto;">
                      <el-color-picker v-model="selfConfig.geo.itemStyle.normal.areaColor"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                    <gui-inline label="边框" style="width:auto;">
                      <el-color-picker v-model="selfConfig.geo.itemStyle.normal.borderColor"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="多边形悬停">
                    <gui-inline label="区域" style="width:auto;">
                      <el-color-picker v-model="selfConfig.geo.itemStyle.emphasis.areaColor"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                    <gui-inline label="边框" style="width:auto;">
                      <el-color-picker v-model="selfConfig.geo.itemStyle.emphasis.borderColor"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                </a-collapse-panel>
                <a-collapse-panel key="mapIndicator" header="指标设置">
                  <a-switch slot="extra" v-if="collapseActive.indexOf('mapIndicator') > -1" v-model="selfConfig.series.label.show" default-checked size="small" @change="switchChange" />
                  <gui-field label="指标文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.series.label.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.series.label.color"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="类型">
                    <el-select v-model="selfConfig.series.type" size="mini"
                                @change="setSelfProperty" :value="selfConfig.series.type">
                      <el-option label="散点/气泡" value="scatter"></el-option>
                      <el-option label="动画气泡" value="effectScatter"></el-option>
                    </el-select>
                  </gui-field>
                  <gui-field label="涟漪动画" v-if="selfConfig.series.type==='effectScatter'">
                    <gui-inline label="最大缩放比">
                      <a-input-number v-model="selfConfig.series.rippleEffect.scale" size="small"
                                      :step="0.5" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="波纹方式">
                      <el-select v-model="selfConfig.series.rippleEffect.brushType" size="mini"
                                  @change="setSelfProperty" :value="selfConfig.series.rippleEffect.brushType">
                        <el-option label="stroke" value="stroke"></el-option>
                        <el-option label="fill" value="fill"></el-option>
                      </el-select>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="气泡悬停">
                    <gui-inline label="边框宽度">
                      <a-input-number v-model="selfConfig.series.itemStyle.emphasis.borderWidth" size="small"
                                      :min="0" :max="2" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="边框颜色" style="width:auto;">
                      <el-color-picker v-model="selfConfig.series.itemStyle.emphasis.borderColor"
                                        @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!--数据系列-->
              <template v-if="selfConfig.series">
                <a-collapse-panel key="series" header="数据系列">
                  <gui-wrap label="指标"
                            v-model="selfConfig.series.label.show" @on-change="setSelfProperty">
                    <gui-field label="指标文本">
                      <gui-inline label="字号">
                        <a-input-number v-model="selfConfig.series.label.fontSize" size="small"
                                        :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                      </gui-inline>
                      <gui-inline label="颜色">
                        <el-color-picker v-model="selfConfig.series.label.color"
                                         @change="setSelfProperty"></el-color-picker>
                      </gui-inline>
                    </gui-field>
                    <gui-field label="指标位置">
                      <el-select v-model="selfConfig.series.label.position" size="mini"
                                 @change="setSelfProperty" :value="selfConfig.series.label.position">
                        <el-option label="inside" value="inside"></el-option>
                        <!--饼图-->
                        <template v-if="isPie">
                          <el-option label="outside" value="outside"></el-option>
                        </template>
                        <template v-else>
                          <el-option label="top" value="top"></el-option>
                        </template>
                      </el-select>
                    </gui-field>
                  </gui-wrap>
                  <gui-wrap label="区域渐变" :value="true" simple v-if="isLine">
                    <gui-field label="区域透明度">
                      <a-input-number v-model="selfConfig.series.areaStyle.opacity" size="small"
                                      :max="1" :step="0.1" @change="setSelfProperty"></a-input-number>
                    </gui-field>
                  </gui-wrap>
                  <gui-field label="近似曲线" v-if="isLine">
                    <b-switch v-model="selfConfig.series.smooth" size="small" @on-change="setSelfProperty"></b-switch>
                  </gui-field>
                  <gui-field label="柱条宽度" v-if="isHistogram">
                    <a-input size="small" @change="setSelfProperty"
                             v-model="selfConfig.series.barWidth" clearable></a-input>
                  </gui-field>
                  <!--饼图独有-->
                  <template v-if="isPie">
                    <gui-field label="玫瑰图">
                      <b-switch v-model="selfConfig.series.roseType" size="small"
                                @on-change="setSelfProperty"></b-switch>
                    </gui-field>
                    <gui-field label="中心坐标">
                      <gui-inline label="offsetX">
                        <a-input v-model="selfConfig.series.center[0]" size="small"
                                 placeholder="默认50%"
                                 @change="setSelfProperty"></a-input>
                      </gui-inline>
                      <gui-inline label="offsetY">
                        <a-input v-model="selfConfig.series.center[1]" size="small"
                                 placeholder="默认50%"
                                 @change="setSelfProperty"></a-input>
                      </gui-inline>
                    </gui-field>
                    <gui-field label="饼图半径">
                      <gui-inline label="内半径">
                        <a-input v-model="selfConfig.series.radius[0]" size="small"
                                 placeholder="默认0"
                                 @change="setSelfProperty"></a-input>
                      </gui-inline>
                      <gui-inline label="外半径">
                        <a-input v-model="selfConfig.series.radius[1]" size="small"
                                 placeholder="默认50%"
                                 @change="setSelfProperty"></a-input>
                      </gui-inline>
                    </gui-field>
                  </template>
                  <!--地图独有-->
                  <template v-if="isMap">
                    <gui-field label="类型">
                      <el-select v-model="selfConfig.series.type" size="mini"
                                 @change="setSelfProperty" :value="selfConfig.series.type">
                        <el-option label="散点/气泡" value="scatter"></el-option>
                        <el-option label="动画气泡" value="effectScatter"></el-option>
                      </el-select>
                    </gui-field>
                    <gui-field label="涟漪动画" v-if="selfConfig.series.type==='effectScatter'">
                      <gui-inline label="最大缩放比">
                        <a-input-number v-model="selfConfig.series.rippleEffect.scale" size="small"
                                        :step="0.5" @change="setSelfProperty"></a-input-number>
                      </gui-inline>
                      <gui-inline label="波纹方式">
                        <el-select v-model="selfConfig.series.rippleEffect.brushType" size="mini"
                                   @change="setSelfProperty" :value="selfConfig.series.rippleEffect.brushType">
                          <el-option label="stroke" value="stroke"></el-option>
                          <el-option label="fill" value="fill"></el-option>
                        </el-select>
                      </gui-inline>
                    </gui-field>
                    <gui-field label="气泡悬停">
                      <gui-inline label="边框宽度">
                        <a-input-number v-model="selfConfig.series.itemStyle.emphasis.borderWidth" size="small"
                                        :min="0" :max="2" @change="setSelfProperty"></a-input-number>
                      </gui-inline>
                      <gui-inline label="边框颜色" style="width:auto;">
                        <el-color-picker v-model="selfConfig.series.itemStyle.emphasis.borderColor"
                                         @change="setSelfProperty"></el-color-picker>
                      </gui-inline>
                    </gui-field>
                  </template>
                </a-collapse-panel>
              </template>
              <!--颜色数组-->
              <template v-if="selfConfig.color">
                <a-collapse-panel key="colors" header="颜色设置">
                  <div style="padding: 5px 13px;">
                    <gui-colors v-for="(c,index) of selfConfig.color" :key="index+c">
                      <el-color-picker v-model="selfConfig.color[index]" :predefine="predefineColors"
                                       @change="setSelfProperty"></el-color-picker>
                    </gui-colors>
                  </div>
                </a-collapse-panel>
              </template>
              <!-- 图片 -->
              <template v-if="isImage">
                <a-collapse-panel key="images" header="图片">
                  <gui-field label="上传">
                    <div class="photo" @click.stop="addPhote">
                      <a-icon type="plus" />
                      <input
                        id="upload_photo"
                        ref="img_input1"
                        type="file"
                        name
                        accept="image/png, image/jpeg, image/gif"
                        style="display:none;"
                        @change="selectPhoto($event, selfConfig, 'selfConfig')"
                      />
                    </div>
                  </gui-field>
                </a-collapse-panel>
              </template>
              <!-- 表格 -->
              <template v-if="isTables && selfConfig.header">
                <a-collapse-panel key="header" header="表头">
                  <a-switch slot="extra"
                            v-if="collapseActive.indexOf('header')>-1"
                            v-model="selfConfig.header.show"
                            default-checked
                            @change="switchChange" size="small" />
                  <gui-field label="背景颜色">
                    <el-color-picker v-model="selfConfig.header.backgroundColor"
                                      @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.header.textStyle.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.header.textStyle.color"
                                      @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="对齐方式">
                    <a-radio-group :value="selfConfig.header.textStyle.textAlign" size="small" >
                      <a-radio-button value="left" @click.native.stop="onRadioChange($event, selfConfig.header.textStyle, 'textAlign')">
                        <a-icon type="align-left" value="left" />
                      </a-radio-button>
                      <a-radio-button value="center" @click.native.stop="onRadioChange($event, selfConfig.header.textStyle, 'textAlign')">
                        <a-icon type="align-center" value="center" />
                      </a-radio-button>
                      <a-radio-button value="right" @click.native.stop="onRadioChange($event, selfConfig.header.textStyle, 'textAlign')">
                        <a-icon type="align-right" value="right" />
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                </a-collapse-panel>
                <a-collapse-panel key="table" header="表格">
                  <gui-field label="文本">
                    <gui-inline label="字号">
                      <a-input-number v-model="selfConfig.table.textStyle.fontSize" size="small"
                                      :min="12" :max="40" @change="setSelfProperty"></a-input-number>
                    </gui-inline>
                    <gui-inline label="颜色">
                      <el-color-picker v-model="selfConfig.table.textStyle.color"
                                      @change="setSelfProperty"></el-color-picker>
                    </gui-inline>
                  </gui-field>
                  <gui-field label="对齐方式">
                    <a-radio-group :value="selfConfig.table.textStyle.textAlign" size="small" >
                      <a-radio-button value="left" @click.native.stop="onRadioChange($event, selfConfig.table.textStyle, 'textAlign')">
                        <a-icon type="align-left" value="left" />
                      </a-radio-button>
                      <a-radio-button value="center" @click.native.stop="onRadioChange($event, selfConfig.table.textStyle, 'textAlign')">
                        <a-icon type="align-center" value="center" />
                      </a-radio-button>
                      <a-radio-button value="right" @click.native.stop="onRadioChange($event, selfConfig.table.textStyle, 'textAlign')">
                        <a-icon type="align-right" value="right" />
                      </a-radio-button>
                    </a-radio-group>
                  </gui-field>
                  <gui-field label="奇行">
                    <el-color-picker v-model="selfConfig.table.oddBackgroundColor"
                                      @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="偶行">
                    <el-color-picker v-model="selfConfig.table.evenBackgroundColor"
                                      @change="setSelfProperty"></el-color-picker>
                  </gui-field>
                  <gui-field label="自动换行">
                    <a-switch v-model="selfConfig.table.ellipsis" size="small"
                              @change="switchChange"></a-switch>
                  </gui-field>
                </a-collapse-panel>
                <!-- <a-collapse-panel key="page" header="翻页器">
                  <a-switch slot="extra"
                            v-if="collapseActive.indexOf('page')>-1"
                            v-model="selfConfig.header.show"
                            default-checked
                            @change="switchChange"
                            size="small" />
                  <gui-field label="每页条数">
                    <a-select style="width:100px" :default-value="10" v-model="selfConfig.table.pageSize" siza="small">
                      <a-select-option :value="10">10</a-select-option>
                      <a-select-option :value="20">20</a-select-option>
                      <a-select-option :value="50">50</a-select-option>
                      <a-select-option :value="100">100</a-select-option>
                    </a-select>
                  </gui-field>
                </a-collapse-panel> -->
              </template>
              <a-collapse-panel key="background" header="背景设置">
                <a-radio-group v-model="backgroundApi.backgroundType" name="radioGroup">
                  <a-radio :style="radioStyle" value="1" @click.native.stop="onBgChange($event, backgroundApi, 'backgroundType')">
                    <gui-field label="背景颜色">
                      <el-color-picker v-model="backgroundApi.backgroundColor" show-alpha
                                      @change="setBackGround"></el-color-picker>
                    </gui-field>
                  </a-radio>
                  <a-radio :style="radioStyle" value="2" @click.native.stop="onBgChange($event, backgroundApi, 'backgroundType')">
                    <gui-field label="背景图片">
                      <a-button size="small" @click.native.stop="addbgPhoto" :disabled="backgroundApi.backgroundType!=='2'">上传</a-button>
                      <input
                          id="bgPhoto"
                          ref="img_input1"
                          type="file"
                          name
                          accept="image/png, image/jpeg, image/gif"
                          style="display:none"
                          @change="selectPhoto($event, backgroundApi, 'backgroundApi')"
                        />
                    </gui-field>
                  </a-radio>
                </a-radio-group>
                <gui-field label="边框颜色">
                  <el-color-picker v-model="backgroundApi.borderColor" show-alpha
                                  @change="setBackGround"></el-color-picker>
                </gui-field>
                <gui-field label="边框大小">
                  <a-input-number v-model="backgroundApi.borderWidth" size="small"
                                  :formatter="value => `${value}px`"
                                  :parser="value => value.replace('px', '')"
                                  @change="setBackGround"></a-input-number>
                </gui-field>
                <gui-field label="边框线型">
                  <a-select style="width: 90px" v-model="backgroundApi.borderStyle" @change="setBackGround" placeholder="无" size="small">
                    <a-select-option value="solid">
                      实线
                    </a-select-option>
                    <a-select-option value="dot">
                      点状
                    </a-select-option>
                    <a-select-option value="dashed">
                      虚线
                    </a-select-option>
                  </a-select>
                </gui-field>
                <gui-field label="圆角大小">
                  <a-input-number v-model="backgroundApi.borderRadius" size="small"
                                  :formatter="value => `${value}px`"
                                  :parser="value => value.replace('px', '')"
                                  @change="setBackGround"></a-input-number>
                </gui-field>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <div v-else-if="tabsType===1">
            <data-source></data-source>
            <!-- <gui-group group-name="数据映射">
              <gui-field label="x">
                <a-input v-model="apis.labelMap.x" size="small" @change="setApiLabelMap"></a-input>
              </gui-field>
              <gui-field label="y">
                <a-input v-model="apis.labelMap.y" size="small" @change="setApiLabelMap"></a-input>
              </gui-field>
              <gui-field label="s">
                <a-input v-model="apis.labelMap.s" size="small" @change="setApiLabelMap"></a-input>
              </gui-field>
            </gui-group>
            <gui-group group-name="数据源">
              <div style="padding: 6px;">
                <a-input v-model="dataSource" type="textarea" @on-keyup.delete.stop autoSize
                         placeholder="enter json data..." @change="dataSourceChange"></a-input>
              </div>
            </gui-group> -->
          </div>
          <div v-else>
            <div flex="main:center">暂无交互事件</div>
          </div>
        </div>
      </b-scrollbar>
    </div>
    <div class="expand-hover" @click="$emit('on-toggle')">
      <div class="inner">
        <b-icon :name="optionsExpand?'ios-arrow-forward':'ios-arrow-back'"></b-icon>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { setBaseProperty } from '../../../api/canvasMaps/canvas-maps-request'
  import { resetPageSettings, setPageSettings } from '../../../api/app/app-request'
  import GuiGroup from './gui-group'
  import GuiWrap from './gui-wrap'
  import GuiField from './gui-field'
  import GuiInline from './gui-inline'
  import GuiColors from './gui-colors'
  import DataSource from '../data-source/data-source'
  import { DEFAULT_COLORS } from '../../../utils/defaultColors'
  import { deepClone } from '../../../utils/deepClone'

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  export default {
    name: 'BoardOptions',
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        tabsType: 0, // 0：配置，1：数据，2：交互
        globalSettings: { width: 0, height: 0, backgroundColor: '', gridStep: 1, backgroundSrc: '', backgroundType: 1, opacity: 1 },
        baseProperty: { width: 0, height: 0, x: 0, y: 0 }, // 配置-基础属性,
        collapseActive: [],
        selfConfig: {},
        apiData: {},
        apis: {},
        backgroundApi: {},
        predefineColors: DEFAULT_COLORS,
        dataSource: '',

        activeKey: ['1'],
        radioStyle: {
          display: 'flex',
          alignItems: 'center'
        }, // 单选radio样式
        showSlide: false, // 显示透明滑动条
        imageUrl: '', // 上传图片url
        loading: false // 是否上传图片中
      }
    },
    methods: {
      tabsTypeChange(num) {
        this.tabsType = num
        this.$store.dispatch('SetTabsType', num)
      },
      // 设置全局配置
      setPageSetting () {
        // setPageSettings(this.globalSettings).then(res => {
        // })
        this.$store.dispatch('SetPageSettings', this.globalSettings)
        this.screenSave()
      },
      // 设置基本属性
      setBaseProperty () {
        this.$store.dispatch('SetBaseProperty', this.baseProperty)
        // 发送请求来保存数据
        setBaseProperty(this.currentSelected)
        this.screenSave()
      },
      // 设置自有属性
      setSelfProperty () {
        this.$store.dispatch('SetSelfProperty', this.selfConfig)
        // 发送请求来保存数据
        setBaseProperty(this.currentSelected)
        this.screenSave()
      },
      // 设置数据映射
      setApiLabelMap () {
        this.$store.dispatch('SetApis', this.apis)
        // 发送请求来保存数据
        setBaseProperty(this.currentSelected)
        this.screenSave()
      },
      setBackGround (val) {
        this.$store.dispatch('SetBackGround', this.backgroundApi)
        // 发送请求来保存数据
        setBaseProperty(this.currentSelected)
        this.screenSave()
      },
      // 重置全局配置
      resetSetting () {
        this.$loading.start()
        resetPageSettings().then(res => {
          this.$store.dispatch('SetPageSettings', res.data)
          this.$loading.done()
          this.screenSave()
        })
      },
      // 数据源改变事件
      dataSourceChange () {
        try {
          let source = JSON.parse(this.dataSource)
          this.apiData.source = [...source]
          this.$store.dispatch('SetSelfDataSource', this.apiData)
          // 发送请求来保存数据
          setBaseProperty(this.currentSelected)
        } catch (e) {
          console.warn('source is not a json string')
        }
      },

      // 点击添加图片
      addPhote() {
        document.getElementById('upload_photo').click()
      },

      // 点击上传全局背景图片
      addGlobalPhoto(e) {
        document.getElementById('globalPhoto').click()
      },

      // 点击上传图形背景图
      addbgPhoto() {
        document.getElementById('bgPhoto').click()
      },

      // 选择上传图片
      selectPhoto(e, data, key) {
        if (!e.target.files[0]) {
          return
        }
        var form = new FormData()
        form.append('avatarfile', e.target.files[0])
        this.$server.screenManage.uploadImage(form).then(res => {
            if (res.data.code === 200) {
              let imageUrl = process.env.VUE_APP_SERVICE_URL + res.data.imgUrl
              if (key === 'globalSettings') {
                data['backgroundSrc'] = imageUrl
                this.setPageSetting()
              }
              if (key === 'selfConfig') {
                data['imageUrl'] = imageUrl
                this.setSelfProperty()
              }
              if (key === 'backgroundApi') {
                data['backgroundSrc'] = imageUrl
                this.setBackGround()
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },

      // 全局设置，选择背景设置
      globalBgChange(e, data, key) {
        if (e.target.value) {
          this.$set(data, key, e.target.value)
          this.setPageSetting()
        }
      },

      // 图表 点击选择背景
      onBgChange(e, data, key) {
        if (e.target.value) {
          this.$set(data, key, e.target.value)
          this.setBackGround()
        }
      },

      // 点击选择对齐方式
      onAlignChange(data, event) {
        this.$set(data, 'textAlign', event.target.value)
        console.log(data, event)
        this.setSelfProperty()
      },

      // 点击显示/隐藏
      switchChange(checked, event) {
        // 阻止默认事件，取消收起
        event.stopPropagation()
        this.setSelfProperty()
      },

      onRadioChange(e, data, key) {
        this.$set(data, key, e.target.value)
        this.setSelfProperty()
      },

      // 保存大屏
      screenSave() {
        const json = {
          setting: this.pageSettings,
          components: this.canvasMap
        }
        let params = {
          id: this.screenId,
          json
        }
        this.$server.screenManage.screenSave(params).then(res => {
          if (res.data.code === 200) {
            this.$store.dispatch('SetScreenId', res.data.id)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    watch: {
      currentSelected: {
        handler (val) {
          if (val) {
            this.baseProperty = { ...val.packageJson.view }
            if (val.packageJson.config) {
              this.selfConfig = deepClone(val.packageJson.config)
            }
            if (val.packageJson.api_data) {
              this.apiData = deepClone(val.packageJson.api_data)
            }
            if (val.packageJson.apis) {
              this.apis = deepClone(val.packageJson.apis)
            }
            if (this.apiData.source) {
              this.dataSource = JSON.stringify(this.apiData.source)
            }
            if (val.packageJson.background) {
              this.backgroundApi = deepClone(val.packageJson.background)
            }
          }
        },
        deep: true
      },
      pageSettings: {
        handler (val) {
          if (val) {
            this.globalSettings = { ...val }
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      ...mapGetters(['pageSettings', 'canvasRange', 'optionsExpand', 'currentSelected', 'screenId', 'canvasMap']),
      chartType () {
        return this.currentSelected ? this.currentSelected.packageJson.name : ''
      },
      isLine () {
        return this.chartType === 've-line'
      },
      isHistogram () {
        return this.chartType === 've-histogram'
      },
      isPie () {
        return this.chartType === 've-pie'
      },
      isRadar () {
        return this.chartType === 've-radar'
      },
      isMap () {
        return this.chartType === 've-map'
      },
      isText () {
        return this.chartType === 've-text'
      },
      isImage () {
        return this.chartType === 've-image'
      },
      isTables () {
        return this.chartType === 've-tables'
      },
      showGrid () {
        return this.selfConfig.grid && (this.isLine || this.isHistogram)
      },
      showXAxis () {
        return this.selfConfig.xAxis && (this.isLine || this.isHistogram)
      },
      showYAxis () {
        return this.selfConfig.yAxis && (this.isLine || this.isHistogram)
      }
    },
    components: { GuiField, GuiInline, GuiColors, GuiWrap, DataSource }
  }
</script>
