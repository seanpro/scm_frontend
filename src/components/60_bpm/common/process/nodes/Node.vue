<template>
  <div :class="{'node': true, 'root': isRoot || !show, 'node-error-state': showError}">
    <div v-if="show" :class="{'node-body': true, 'error': showError}" @click="$emit('selected')">
      <div>
        <div class="node-body-header" :style="{'background-color': headerBgc}">
          <i v-if="(headerIcon || '') !== ''" :class="headerIcon" style="margin-right: 5px" />
          <ellipsis class="name" hover-tip :content="title" />
          <!--          <el-input v-else autofocus v-model="titleContent" @blur="enableEdit = false"></el-input>-->
          <i v-if="!isRoot" class="el-icon-close" style="float:right;" @click="$emit('delNode')" />
        </div>
        <div class="node-body-content">
          <i v-if="leftIcon" :class="leftIcon" />
          <span v-if="(content || '').trim() === ''" class="placeholder">{{ placeholder }}</span>
          <ellipsis v-else :row="3" :content="content" />
          <i class="el-icon-arrow-right" />
        </div>
        <div v-if="showError" class="node-error">
          <el-tooltip effect="dark" :content="errorInfo" placement="top-start">
            <i class="el-icon-warning-outline" />
          </el-tooltip>
        </div>
      </div>
    </div>
    <div :class="{'node-footer': true, 'space': merge}">
      <div v-if="merge" class="branch-merge">
        <img src="../../../image/branch.png" alt="">
      </div>
      <div class="btn">
        <insert-button @insertNode="type => $emit('insertNode', type)" />
      </div>
    </div>
  </div>
</template>

<script>
import InsertButton from '@/components/60_bpm/common/InsertButton.vue'
import ellipsis from '@/components/60_bpm/common/Ellipsis'

export default {
  name: 'Node',
  components: { ellipsis,InsertButton },
  props: {
    // 是否为根节点
    isRoot: {
      type: Boolean,
      default: false
    },
    // 是否显示节点体
    show: {
      type: Boolean,
      default: true
    },
    // 并行网关聚合
    merge: {
      type: Boolean,
      default: false
    },
    // 节点内容区域文字
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题'
    },
    placeholder: {
      type: String,
      default: '请设置'
    },
    // 节点体左侧图标
    leftIcon: {
      type: String,
      default: undefined
    },
    // 头部图标
    headerIcon: {
      type: String,
      default: ''
    },
    // 头部背景色
    headerBgc: {
      type: String,
      default: '#576a95'
    },
    // 是否显示错误状态
    showError: {
      type: Boolean,
      default: false
    },
    errorInfo: {
      type: String,
      default: '无信息'
    }
  },
  data () {
    return {
      enableEdit: false
    }
  },
  computed: {
    titleContent: {
      get () {
        return this.title
      },
      set (val) {
        this.$emit('title:update', val)
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>

/deep/ .el-input{
  width: 80%;
  .el-input__inner{
    padding: 0 !important;
    font-size: 12px;
    height: 20px;
  }
}

.root{
  &:before{
    display: none !important;
  }
}
.node-error-state{
  .node-body{
    box-shadow: 0px 0px 5px 0px #F56C6C !important;
  }
}
.node{
  padding: 0 50px;
  width: 220px;
  position: relative;
  box-sizing: content-box;
  &:before{
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 0;
    border-style: solid;
    border-width: 8px 6px 4px;
    border-color: #CACACA transparent transparent;
    background: #F5F5F7;
  }
  .node-body{
    cursor: pointer;
    max-height: 120px;
    position: relative;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 5px 0px #d8d8d8;
    &:hover{
      box-shadow: 0px 0px 3px 0px @theme-primary;
      .node-body-header {
        .el-icon-close {
          display: inline;
          font-size: medium;
        }
      }
    }
    .node-body-header{
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      padding: 5px 15px;
      color: white;
      font-size: xx-small;
      .el-icon-close{
        display: none;
      }
      .name{
        height: 14px;
        width: 150px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .node-body-content{
      padding: 18px;
      color: #656363;
      font-size: 14px;
      i{
        position: absolute;
        top: 55%;
        right: 5px;
        font-size: medium;
      }
      .placeholder{
        color: #8c8c8c;
      }
    }
    .node-error{
      position: absolute;
      right: -40px;
      top: 20px;
      font-size: 25px;
      color: #F56C6C;
    }
  }

  .node-footer{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .branch-merge{
      font-size: 12px;
      display: flex;
      width: 38px;
      border-radius: 50%;
      position: absolute;
      top: -40px;
      background: white;
      justify-content: center;
      flex-direction: column;
      box-shadow: 0px 0px 5px 0px #d8d8d8;
    }
    .btn{
      width: 100%;
      display: flex;
      padding: 20px 0 32px;
      justify-content: center;
    }
    /deep/ .el-button{
      height: 32px;
    }
    &::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      margin: auto;
      width: 2px;
      height: 100%;
      background-color: #CACACA;
    }
  }
}
.space{
  margin-top: 20px;
}
</style>
