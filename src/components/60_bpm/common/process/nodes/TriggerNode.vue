<template>
  <node
    :title="config.name"
    :show-error="showError"
    :content="content"
    :error-info="errorInfo"
    placeholder="请设置触发器"
    header-bgc="#35b881"
    header-icon="el-icon-set-up"
    @selected="$emit('selected')"
    @delNode="$emit('delNode')"
    @insertNode="type => $emit('insertNode', type)"
  />
</template>

<script>
import Node from './Node'

export default {
  name: 'TriggerNode',
  components: { Node },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      showError: false,
      errorInfo: ''
    }
  },
  computed: {
    content () {
      if (this.config.props.type === 'WEBHOOK') {
        return `发送${this.config.props.http.method}请求`
      } else {
        return '发送邮件'
      }
    }
  },
  methods: {
    // 校验数据配置的合法性
    validate (err) {
      this.showError = false
      if (this.config.props.type === 'WEBHOOK') {
        if (this.$isNotEmpty(this.config.props.http.url)) {
          this.showError = false
        } else {
          this.showError = true
          this.errorInfo = '请设置WEBHOOK的URL地址'
        }
      } else if (this.config.props.type === 'EMAIL') {
        if (!this.$isNotEmpty(this.config.props.email.subject) ||
            this.config.props.email.to.length === 0 ||
            !this.$isNotEmpty(this.config.props.email.content)) {
          this.showError = true
          this.errorInfo = '请设置邮件发送配置'
        } else {
          this.showError = false
        }
      }
      if (this.showError) {
        err.push(`${this.config.name} 触发动作未设置完善`)
      }
      return !this.showError
    }
  }
}
</script>

<style scoped>

</style>
