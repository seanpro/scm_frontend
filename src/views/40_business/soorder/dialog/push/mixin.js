import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

export default {
  data () {
    return {
      // div高度
      divHieght: 0
    }
  },
  created () {
    // 作为独立页面，通过route路由打开时
    this.$options.name = this.$route.meta.page_code
  },
  beforeMount () {
  },
  mounted () {
    this.setUIheight()
    this.$nextTick(() => {
      addResizeListener(window.document.body, this.doResize)
    })
  },
  updated () {
    this.setUIheight()
  },
  // 生命周期结束时销毁事件
  destroyed () {
    if (this.resizeListener) removeResizeListener(window.document.body, this.doResize)
  },
  methods: {
    doResize () {
      this.setUIheight()
    },
    setUIheight () {
      try {
        // 定义高度
        const elementHeight = document.documentElement.clientHeight - 205
        const rtnVal = elementHeight

        this.divHieght = rtnVal
      } catch (error) {
        console.log('mixin error')
      }
    }
  }
}
