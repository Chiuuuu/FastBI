
import { setBaseProperty } from '@/api/canvasMaps/canvas-maps-request'
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
      return {
        fontFamilyList: [
            { label: '默认', value: 'not specified' },
            { label: 'simfang', value: 'simfang' },
            { label: '仿宋_GB2312', value: 'fangsong' },
            { label: 'times', value: 'times' },
            { label: '微软雅黑', value: 'msyh' },
            { label: 'simkai', value: 'simkai' },
            { label: '庞门正道标题体', value: 'pangmenzhengdao' },
            { label: 'HuXiaoBoNanShenTi-2', value: 'HuXiaoBoNanShenTi-2' },
            { label: '优设标题黑', value: 'youshe' },
            { label: 'digital-7-4', value: 'digital-7-4' },
        ],
        radioStyle: {
            display: 'flex',
            alignItems: 'center',
        }, // 单选radio样式
        formatList: [
            { label: '维度', value: '{point.name}：' },
            { label: '度量', value: '{y}' },
            { label: '占比', value: '({point.percentage:.1f}%)' }
        ],
      }
    },
    computed: {
        ...mapGetters(['currentSelected']),
    },
    methods: {
        ...mapActions(['saveScreenData', 'updateChartData', 'refreshScreen']),
        // 设置自有属性
        setSelfProperty() {
            this.$store.dispatch('SetSelfProperty', this.HighConfig.setting.config)
            // 发送请求来保存数据
            setBaseProperty(this.currentSelected)
            this.updateChartData()
        },
         //图例点击
        onRadioChange(source, key, value) {
            if(source==='indicator'){
            this.$set(this.HighConfig.setting.config.plotOptions.pie.dataLabels, key, value);
            }else{
            this.$set(this.HighConfig.setting.config[source], key, value);
            }
            this.setSelfProperty()
        },
         // 点击显示/隐藏
        switchChange(checked, event) {
            // 阻止默认事件，取消收起
            event.stopPropagation()
            this.setSelfProperty()
        },
        // 图表 点击选择背景
        onBgChange(key, val) {
            this.$set(this.HighConfig.setting, key, val)
            this.setBackGround()
        },
        // 点击上传图形背景图
        addbgPhoto() {
            document.getElementById('bgPhoto').click()
        },
        setBackGround(val) {
            if (val) {
            setBaseProperty(this.currentSelected)
            this.updateChartData()
            }
            // this.$store.dispatch('SetBackGround', this.backgroundApi)
            // 发送请求来保存数据
        },
        // 选择上传图片
        selectPhoto(e, key) {
            if (!e.target.files[0]) {
            return
            }
            const isLt2M = e.target.files[0].size / 1024 / 1024 < 5
            if (!isLt2M) {
            this.$message.error('图片大小不能超过5M!')
            return
            }
            var form = new FormData()
            form.append('avatarfile', e.target.files[0])
            this.$server.screenManage
            .actionUploadImage(form)
            .then((res) => {
                if (res.code === 200) {
                let imageUrl = process.env.VUE_APP_SERVICE_URL + res.imgUrl
                if (key === 'plotBackgroundImage') {
                    this.HighConfig.setting.config.chart[key] = imageUrl
                    this.setPageSetting()
                }
                // if (key === 'selfConfig') {
                //   data['imageUrl'] = imageUrl
                //   this.setSelfProperty()
                // }
                // if (key === 'backgroundApi') {
                //   data['backgroundSrc'] = imageUrl
                //   this.setBackGround()
                // }
                } else {
                this.$message.error(res.msg)
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
    }
  }
  