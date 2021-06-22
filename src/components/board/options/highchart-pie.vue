<template>
  <!-- highechart 样式设置 -->
  <a-collapse>
    <a-collapse-panel key="title" header="标题">
      <gui-field label="标题名">
        <a-input
          v-model="HighConfig.setting.config.title.text"
          size="small"
          :maxLength="20"
          @change="setSelfProperty"
        ></a-input>
      </gui-field>
      <gui-field label="文本">
        <gui-inline label="字号">
          <a-input-number
            class="longwidth"
            v-model="HighConfig.setting.config.title.style.fontSize"
            size="small"
            :min="12"
            :max="100"
            @change="setSelfProperty"
          ></a-input-number>
        </gui-inline>
        <gui-inline label="颜色">
          <el-color-picker
            v-model="HighConfig.setting.config.title.style.color"
            @change="setSelfProperty"
          ></el-color-picker>
        </gui-inline>
      </gui-field>
      <gui-field label="字体">
        <a-select
          v-model="HighConfig.setting.config.title.style.fontFamily"
          style="width: 164px"
          size="small"
          @change="setSelfProperty"
        >
          <a-select-option
            :value="font.value"
            v-for="(font, index) in fontFamilyList"
            :key="index"
            >{{ font.label }}</a-select-option
          >
        </a-select>
      </gui-field>
      <gui-field label="粗细">
        <a-select
          v-model="HighConfig.setting.config.title.style.fontWeight"
          style="width: 164px"
          size="small"
          @change="setSelfProperty"
        >
          <a-select-option value="normal">正常</a-select-option>
          <a-select-option value="bolder">加粗</a-select-option>
          <a-select-option value="lighter">更细</a-select-option>
        </a-select>
      </gui-field>
      <gui-field label="对齐方式">
        <a-radio-group
          :value="HighConfig.setting.config.title.align"
          size="small"
        >
          <a-radio-button
            value="left"
            @click.native.stop="onRadioChange('title', 'align', 'left')"
          >
            <a-icon type="align-left" value="left" />
          </a-radio-button>
          <a-radio-button
            value="center"
            @click.native.stop="onRadioChange('title', 'align', 'center')"
          >
            <a-icon type="align-center" value="center" />
          </a-radio-button>
          <a-radio-button
            value="right"
            @click.native.stop="onRadioChange('title', 'align', 'right')"
          >
            <a-icon type="align-right" value="right" />
          </a-radio-button>
        </a-radio-group>
      </gui-field>
    </a-collapse-panel>
    <a-collapse-panel key="properties" header="图形属性">
      <gui-field label="中心坐标">
        <gui-inline>
          <a-input
            v-model="HighConfig.setting.config.plotOptions.pie.center[0]"
            size="small"
            placeholder="默认50%"
            @change="setSelfProperty"
          >
            <span slot="prefix">x</span>
          </a-input>
        </gui-inline>
        <gui-inline>
          <a-input
            v-model="HighConfig.setting.config.plotOptions.pie.center[1]"
            size="small"
            placeholder="默认50%"
            @change="setSelfProperty"
          >
            <span slot="prefix">y</span>
          </a-input>
        </gui-inline>
      </gui-field>
      <gui-field label="内环大小">
        <a-input
          v-model="HighConfig.setting.config.plotOptions.pie.innerSize"
          size="small"
          placeholder="默认0"
          @change="setSelfProperty"
        ></a-input>
      </gui-field>
      <gui-field label="外径大小">
        <a-input
          v-model="HighConfig.setting.config.plotOptions.pie.size"
          size="small"
          placeholder="默认50%"
          @change="setSelfProperty"
        ></a-input>
      </gui-field>
    </a-collapse-panel>
    <a-collapse-panel key="legend" header="图例设置">
      <a-switch
        slot="extra"
        v-model="HighConfig.setting.config.legend.enabled"
        default-checked
        @change="switchChange"
        size="small"
      />
      <gui-field label="文本">
        <gui-inline label="字号">
          <a-input-number
            class="longwidth"
            v-model="HighConfig.setting.config.legend.itemStyle.fontSize"
            size="small"
            :min="12"
            :max="40"
            @change="setSelfProperty"
          ></a-input-number>
        </gui-inline>
        <gui-inline label="颜色">
          <el-color-picker
            v-model="HighConfig.setting.config.legend.itemStyle.color"
            @change="setSelfProperty"
          ></el-color-picker>
        </gui-inline>
      </gui-field>
      <gui-field label="位置">
        <gui-inline>
          <a-radio-group
            :value="HighConfig.setting.config.legend.align"
            size="small"
          >
            <a-radio-button
              value="left"
              @click.native.stop="onRadioChange('legend', 'align', 'left')"
              >左</a-radio-button
            >
            <a-radio-button
              value="center"
              @click.native.stop="onRadioChange('legend', 'align', 'center')"
              >中</a-radio-button
            >
            <a-radio-button
              value="right"
              @click.native.stop="onRadioChange('legend', 'align', 'right')"
              >右</a-radio-button
            >
          </a-radio-group>
        </gui-inline>
      </gui-field>
      <gui-field>
        <gui-inline>
          <a-radio-group
            :value="HighConfig.setting.config.legend.verticalAlign"
            size="small"
          >
            <a-radio-button
              value="top"
              @click.native.stop="
                onRadioChange('legend', 'verticalAlign', 'top')
              "
              >顶部</a-radio-button
            >
            <a-radio-button
              value="middle"
              @click.native.stop="
                onRadioChange('legend', 'verticalAlign', 'middle')
              "
              >居中</a-radio-button
            >
            <a-radio-button
              value="bottom"
              @click.native.stop="
                onRadioChange('legend', 'verticalAlign', 'bottom')
              "
              >底部</a-radio-button
            >
          </a-radio-group>
        </gui-inline>
      </gui-field>
      <gui-field label="排列">
        <gui-inline>
          <a-radio-group
            :value="HighConfig.setting.config.legend.layout"
            size="small"
          >
            <a-radio-button
              value="horizontal"
              @click.native.stop="
                onRadioChange('legend', 'layout', 'horizontal')
              "
              >水平</a-radio-button
            >
            <a-radio-button
              value="vertical"
              @click.native.stop="onRadioChange('legend', 'layout', 'vertical')"
              >垂直</a-radio-button
            >
          </a-radio-group>
        </gui-inline>
      </gui-field>
      <gui-field label="主题">
        <a-select
          v-model="HighConfig.setting.config.colors"
          style="width: 164px"
          size="small"
          @change="setSelfProperty"
        >
          <a-select-option value="normal">正常</a-select-option>
          <a-select-option value="bolder">加粗</a-select-option>
          <a-select-option value="lighter">更细</a-select-option>
        </a-select>
      </gui-field>
    </a-collapse-panel>

    <a-collapse-panel key="indicator" header="指标设置">
      <a-switch
        slot="extra"
        v-model="HighConfig.setting.config.plotOptions.pie.dataLabels.enabled"
        default-checked
        @change="switchChange"
        size="small"
      />
      <!-- <gui-field label="显示内容"> -->
      显示内容
      <a-select
        mode="tags"
        placeholder="选择显示内容"
        :default-value="['{point.name}：', '{y}', '({point.percentage:.1f}%)']"
        style="width: 100%"
        @change="onChange"
      >
        <a-select-option
          v-for="i in formatList"
          :key="i.label"
          :value="i.value"
        >
          {{ i.label }}
        </a-select-option>
      </a-select>
      <gui-field label="文本">
        <gui-inline label="字号">
          <a-input-number
            class="longwidth"
            v-model="HighConfig.setting.config.plotOptions.pie.dataLabels.style.fontSize"
            size="small"
            :min="12"
            :max="40"
            @change="setSelfProperty"
          ></a-input-number>
        </gui-inline>
        <gui-inline label="颜色">
          <el-color-picker
            v-model="HighConfig.setting.config.plotOptions.pie.dataLabels.color"
            @change="setSelfProperty"
          ></el-color-picker>
        </gui-inline>
      </gui-field>
      <!-- <gui-field label="显示位置">
        <a-radio-group :value="HighConfig.setting.config.plotOptions.pie.dataLabels.distance" size="small">
          <a-radio-button
            value="-30%"
            @click.native.stop="
              onRadioChange('indicator','distance', '-30%')
            "
            >内部</a-radio-button
          >
          <a-radio-button
            value="30%"
            @click.native.stop="
              onRadioChange('indicator','distance', '30%')
            "
            >外部</a-radio-button
          >
        </a-radio-group>
      </gui-field> -->
    </a-collapse-panel>

    <a-collapse-panel key="background" header="背景设置">
      <a-radio-group
        v-model="HighConfig.setting.background.backgroundType"
        name="radioGroup"
      >
        <a-radio
          :style="radioStyle"
          value="1"
          @click.native.stop="onBgChange('backgroundType', '1')"
        >
          <gui-field label="背景颜色">
            <el-color-picker
              v-model="HighConfig.setting.config.chart.backgroundColor"
              show-alpha
              @change="setBackGround"
            ></el-color-picker>
          </gui-field>
        </a-radio>
        <a-radio
          :style="radioStyle"
          value="2"
          @click.native.stop="onBgChange('backgroundType', '2')"
        >
          <gui-field label="背景图片">
            <a-button
              size="small"
              @click.native.stop="addbgPhoto"
              :disabled="HighConfig.setting.background.backgroundType !== '2'"
              >上传</a-button
            >
            <input
              id="bgPhoto"
              ref="img_input1"
              type="file"
              name
              accept="image/png, image/jpeg, image/gif"
              style="display: none"
              @change="selectPhoto($event, 'plotBackgroundImage')"
            />
          </gui-field>
        </a-radio>
      </a-radio-group>
      <gui-field label="边框颜色">
        <el-color-picker
          v-model="HighConfig.setting.config.chart.borderColor"
          show-alpha
          @change="setBackGround"
        ></el-color-picker>
      </gui-field>
      <gui-field label="边框大小">
        <a-input-number
          v-model="HighConfig.setting.config.chart.borderWidth"
          size="small"
          :formatter="(value) => `${value}px`"
          :parser="(value) => value.replace('px', '')"
          @change="setBackGround"
        ></a-input-number>
      </gui-field>
      <gui-field label="圆角大小">
        <a-input-number
          v-model="HighConfig.setting.config.chart.borderRadius"
          size="small"
          :formatter="(value) => `${value}px`"
          :parser="(value) => value.replace('px', '')"
          @change="setBackGround"
        ></a-input-number>
      </gui-field>
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import GuiField from './gui-field'
import GuiInline from './gui-inline'
import { setBaseProperty } from '@/api/canvasMaps/canvas-maps-request'

import { mapGetters, mapActions } from 'vuex'

import HighMinxins from '@/mixins/hight';
export default {
  props: {
    HighConfig: {
      type: Object,
      required: true,
    },
  },
  mixins:[HighMinxins],
  components: { GuiField, GuiInline },
  data() {
    return {
      // fontFamilyList: [
      //   { label: '默认', value: 'not specified' },
      //   { label: 'simfang', value: 'simfang' },
      //   { label: '仿宋_GB2312', value: 'fangsong' },
      //   { label: 'times', value: 'times' },
      //   { label: '微软雅黑', value: 'msyh' },
      //   { label: 'simkai', value: 'simkai' },
      //   { label: '庞门正道标题体', value: 'pangmenzhengdao' },
      //   { label: 'HuXiaoBoNanShenTi-2', value: 'HuXiaoBoNanShenTi-2' },
      //   { label: '优设标题黑', value: 'youshe' },
      //   { label: 'digital-7-4', value: 'digital-7-4' },
      // ],
      // radioStyle: {
      //   display: 'flex',
      //   alignItems: 'center',
      // }, // 单选radio样式
      // formatList: [
      //   { label: '维度', value: '{point.name}：' },
      //   { label: '度量', value: '{y}' },
      //   { label: '占比', value: '({point.percentage:.1f}%)' }
      // ],
    }
  },
  computed: {
    // ...mapGetters(['currentSelected']),
  },
  mounted() {},
  methods: {
    // ...mapActions(['saveScreenData', 'updateChartData', 'refreshScreen']),
    // 设置自有属性
    // setSelfProperty() {
    //   this.$store.dispatch('SetSelfProperty', this.HighConfig.setting.config)
    //   // 发送请求来保存数据
    //   setBaseProperty(this.currentSelected)
    //   this.updateChartData()
    // },
    // //图例点击
    // onRadioChange(source, key, value) {
    //   if(source==='indicator'){
    //     this.$set(this.HighConfig.setting.config.plotOptions.pie.dataLabels, key, value);
    //   }else{
    //     this.$set(this.HighConfig.setting.config[source], key, value);
    //   }
    //   this.setSelfProperty()
    // },
    // // 点击显示/隐藏
    // switchChange(checked, event) {
    //   // 阻止默认事件，取消收起
    //   event.stopPropagation()
    //   this.setSelfProperty()
    // },
    // 图表 点击选择背景
    // onBgChange(key, val) {
    //   this.$set(this.HighConfig.setting, key, val)
    //   this.setBackGround()
    // },
    // 点击上传图形背景图
    // addbgPhoto() {
    //   document.getElementById('bgPhoto').click()
    // },
    // setBackGround(val) {
    //   if (val) {
    //     setBaseProperty(this.currentSelected)
    //     this.updateChartData()
    //   }
    //   // this.$store.dispatch('SetBackGround', this.backgroundApi)
    //   // 发送请求来保存数据
    // },
    // 选择上传图片
    // selectPhoto(e, key) {
    //   if (!e.target.files[0]) {
    //     return
    //   }
    //   const isLt2M = e.target.files[0].size / 1024 / 1024 < 5
    //   if (!isLt2M) {
    //     this.$message.error('图片大小不能超过5M!')
    //     return
    //   }
    //   var form = new FormData()
    //   form.append('avatarfile', e.target.files[0])
    //   this.$server.screenManage
    //     .actionUploadImage(form)
    //     .then((res) => {
    //       if (res.code === 200) {
    //         let imageUrl = process.env.VUE_APP_SERVICE_URL + res.imgUrl
    //         if (key === 'plotBackgroundImage') {
    //           this.HighConfig.setting.config.chart[key] = imageUrl
    //           this.setPageSetting()
    //         }
    //         // if (key === 'selfConfig') {
    //         //   data['imageUrl'] = imageUrl
    //         //   this.setSelfProperty()
    //         // }
    //         // if (key === 'backgroundApi') {
    //         //   data['backgroundSrc'] = imageUrl
    //         //   this.setBackGround()
    //         // }
    //       } else {
    //         this.$message.error(res.msg)
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // },
    onChange(checkedValues) {
      // this.HighConfig.setting.config.plotOptions.pie.dataLabels.format = checkedValues.join('');
      let source = this.HighConfig.setting.config.plotOptions.pie.dataLabels;
      this.$set(source,'format',checkedValues.join(''));
      this.setSelfProperty()
    },
  },
  watch: {},
}
</script>
<style lang="less" scoped>
</style>