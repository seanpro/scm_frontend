<template>
  <div class="app-container">
    <!-- 采购合同汇总 -->
    <FloatMenu />
    <el-form
      ref="minusForm"
      :inline="true"
      :model="dataJson.searchForm"
      label-position="getLabelPosition()"
    >
      <el-form-item label="">
        <el-select
          v-model="dataJson.searchForm.owner_id"
          :placeholder="isPlaceholderShow('请选择货主')"
          filterable
          clearable
        >
          <el-option
            v-for="item in dataJson.ownerComboList"
            :key="item.id"
            :label="item.short_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <select-supplier
          v-model.trim="dataJson.searchForm.supplier_name"
          :placeholder="isPlaceholderShow('请选择供应商')"
          :type="CONSTANTS.DICT_SUPPLIER"
          :reset="settings.reset2"
          placement="left"
          @onReturnData="handleSupplierReturnData"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.goods_name"
          clearable
          placeholder="请输入物料名称"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="dataJson.searchForm.goods_prop"
          clearable
          placeholder="请输入商品属性"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <select-dict
          v-model="dataJson.searchForm.batch"
          :para="CONSTANTS.DICT_BUSINESS_START_TIME"
          init-placeholder="业务启动日期"
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          v-popover:popover
          type="primary"
          plain
          icon="perfect-icon-reset"
          @click="doResetSearch"
        >重置</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button
          type="primary"
          plain
          icon="el-icon-search"
          :loading="settings.loading"
          @click="handleSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>

    <el-button-group>
      <el-button
        v-permission="'P_LOSS_IN:EXPORT'"
        :disabled="!settings.btnShowStatus.showExport"
        type="primary"
        icon="el-icon-s-management"
        :loading="settings.loading"
        @click="handleExport"
      >导出</el-button>
    </el-button-group>

    <div class="div-sum">
      <div class="right">
        <span class="count-title">合计采购数量：</span><span class="count-data">{{ dataJson.sumData.qty === null?'0':dataJson.sumData.qty>0? isZhongLin ? formatNumber3(dataJson.sumData.qty) : formatNumberTwo(dataJson.sumData.qty,true,2) :0 }}</span>
        <span class="count-title">实际入库数量：</span><span class="count-data">{{ dataJson.sumData.actual_count === null?'0':dataJson.sumData.actual_count>0? isZhongLin ? formatNumber3(dataJson.sumData.actual_count) : formatNumberTwo(dataJson.sumData.actual_count,true,2) :0 }}</span>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="settings.loading"
      :data="dataJson.listData"
      columns_index_key="true"
      :element-loading-text="'正在拼命加载中...'"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :height="settings.tableHeight"
      stripe
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'owner', order: 'ascending'}"
      style="width: 100%"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDbClick"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="45"
        prop="id"
      />
      <el-table-column
        type="index"
        width="45"
        prop="No"
        label="No"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        align="left"
        prop="owner"
        label="货主"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="130"
        align="left"
        prop="supplier_name"
        label="供应商"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        align="left"
        prop="goods_name"
        label="物料名称"
      />
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        align="right"
        prop="qty"
        label="采购数量"
      >
        <template v-slot="scope">
          <router-link :to="{name:dataJson.constants_program.P_IN_ORDER,query:{goods_name:scope.row.goods_name, goods_code:scope.row.goods_code, owner_name:scope.row.owner, supplier_name: scope.row.supplier_name,batch: dataJson.searchForm.batch, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.qty === null?'': isZhongLin ? formatNumber3(scope.row.qty) : formatNumberTwo(scope.row.qty,true,2) }}</a></router-link>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :sort-orders="settings.sortOrders"
        :auto-fit="true"
        min-width="160"
        align="right"
        prop="actual_count"
        label="实际入库数量"
      >
        <template v-slot="scope">
          <router-link :to="{name:dataJson.constants_program.P_IN,query:{goods_name:scope.row.goods_name, goods_code:scope.row.goods_code, owner_name:scope.row.owner, supplier_name: scope.row.supplier_name, type: '0',batch: dataJson.searchForm.batch, fullpath:true}}"><a href="javascript:void(0)">{{ scope.row.actual_count === null?'': isZhongLin ? formatNumber3(scope.row.actual_count) : formatNumberTwo(scope.row.actual_count,true,2) }}</a></router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      ref="minusPaging"
      :total="dataJson.paging.total"
      :page.sync="dataJson.paging.current"
      :limit.sync="dataJson.paging.size"
      @pagination="getDataList"
    />

  </div>
</template>
<style scoped>
::v-deep .el-tabs__item {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__header {
  margin: 0 0 5px;
}
.floatLeft {
  float: left;
}
.el-form-item .el-select {
  width: 100%;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 371px;
}
.el-button-group {
  margin-bottom: 10px;
}
.el-input-group__append_select,
.el-input-group__append {
  color: #ffffff;
  background-color: #1890ff;
  border-color: #1890ff;
}
.el-input-group__append_reset {
  color: #ffffff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}
a {
  color: #52b5f2;
}
.div-sum {
  width: 100%;
  height: 35px;
  padding: 5px 5px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  transition: opacity 0.2s;
  background-color: #fff;
  color: #666;
  font-size: 16px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
}
.right {
  position: absolute;
  right: 10px;
  margin-right: 10px;
}
.left {
  position: absolute;
  left: 10px;
  margin-left: 10px;
}
.count-data {
  color: #1890ff;
  font-size: 20px;
}
.count-title {
  margin-left: 10px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 10px;
}
</style>

<script>
import { getInListApi, getInListSumApi, exportApi, exportAllApi } from '@/api/50_query/qty_loss/in'
import Pagination from '@/components/Pagination'
import deepCopy from 'deep-copy'
import resizeMixin from './mixin/resizeHandlerMixin'
import permission from '@/directive/permission/index.js' // 权限判断指令
import constants_program from '@/common/constants/constants_program'
import { getOwnerComboListApi } from '@/api/30_wms/owner/owner'
import SelectSupplier from '@/views/30_wms/customer/selectgrid/selectCustomer'
import urlUtil from '@/utils/urlUtil'
import SelectDict from '@/components/00_dict/select/SelectDict.vue'
import { mapState } from 'vuex'

export default {
  components: { SelectDict, Pagination, SelectSupplier },
  directives: { permission },
  mixins: [resizeMixin],
  props: {
  },
  data () {
    return {
      dataJson: {
        constants_program: constants_program,
        // 查询使用的json
        searchForm: {
          // 翻页条件
          pageCondition: {
            current: 1,
            size: 20,
            sort: 'owner' // 排序
          },
          goods_name: null,
          goods_prop: null,
          owner_name: null,
          owner_id: null,
          supplier_name: null,
          supplier_id: null,
          // 启动日期
          batch: '',
          // 是否 不包含水稻
          showTips: false

        },
        // 分页控件的json
        paging: deepCopy(this.PARAMETERS.PAGE_JSON),
        // table使用的json
        listData: null,
        sumData: {
          qty: 0
        },
        popSettingsData: {
          dialogFormVisible: false
        },
        // 单条数据 json的，初始化原始数据
        tempJsonOriginal: {
          id: undefined,
          name: '',
          value: '',
          descr: '',
          wlb_data: null
        },
        // 单条数据 json
        currentJson: null,
        tempJson: null,
        inputSettings: {
          maxLength: {
            name: 20
          }
        },
        // 当前表格中的索引，第几条
        rowIndex: 0,
        // 当前选中的行（checkbox）
        multipleSelection: []
      },
      // 页面设置json
      settings: {
        reset1: false,
        reset2: false,
        // 表格排序规则
        sortOrders: deepCopy(this.PARAMETERS.SORT_PARA),
        // 按钮状态
        btnShowStatus: {
          showExport: false
        },
        // loading 状态
        loading: true,
        tableHeight: this.setUIheight(),
        duration: 4000
      }
    }
  },
  computed: {
    ...mapState('dictDefaultValue', ['dict_value']),
    // 判断是否是中林环境
    isZhongLin () {
      const href = window.location.href
      if (href.indexOf('shyiyuanth') !== -1 || href.indexOf('172.21.1.249') !== -1 || href.indexOf('localhost') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  // 监听器
  watch: {
    // 选中的数据，使得导出按钮可用，否则就不可使用
    'dataJson.multipleSelection': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.settings.btnShowStatus.showExport = true
        } else {
          this.settings.btnShowStatus.showExport = false
        }
      }
    }
  },
  created () {
    if (this.$route.query.type !== null && this.$route.query.type !== undefined) {
      this.dataJson.searchForm.type = this.$route.query.type
    }
    if (this.$route.query.code !== null && this.$route.query.code !== undefined) {
      this.dataJson.searchForm.goods_code = this.$route.query.code
    }
    if (this.$route.query.goods_name !== null && this.$route.query.goods_name !== undefined && this.$route.query.goods_name !== 'undefined') {
      this.dataJson.searchForm.goods_name = this.$route.query.goods_name
    }
    if (this.$route.query.goods_prop !== null && this.$route.query.goods_prop !== undefined) {
      this.dataJson.searchForm.goods_prop = this.$route.query.goods_prop
    }
    if (this.$route.query.batch !== null && this.$route.query.batch !== undefined) {
      this.dataJson.searchForm.batch = this.$route.query.batch
    } else {
      this.dataJson.searchForm.batch = this.dict_value
    }
    // 如果类型不是水稻, 查询需要剔除 水稻 商品
    if (this.$route.query.goods_type !== '水稻') {
      this.dataJson.searchForm.showTips = true
    }
    location.href = urlUtil.delParam(window.location.href, 'fullpath')
    // 初始化货主下拉框
    this.getOwnerData()
    // 初始化查询
    this.getDataList()
    // 数据初始化
    this.dataJson.tempJson = Object.assign({}, this.dataJson.tempJsonOriginal)
  },
  mounted () {
    // 描绘完成
  },
  methods: {
    // 获取行索引
    getRowIndex (row) {
      const _index = this.dataJson.listData.lastIndexOf(row)
      return _index
    },
    // 行点击
    handleRowClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleSupplierReturnData (val) {
      this.dataJson.searchForm.supplier_id = val.id
    },
    // 行双点击，仅在dialog中有效
    handleRowDbClick (row) {
      this.dataJson.rowIndex = this.getRowIndex(row)
    },
    handleSearch () {
      // 查询
      this.dataJson.searchForm.pageCondition.current = 1
      this.dataJson.paging.current = 1
      this.getDataList()
      // 清空选择
      this.dataJson.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
    },
    handleSortChange (column) {
      // 服务器端排序
      if (column.order === 'ascending') {
        this.dataJson.searchForm.pageCondition.sort = column.prop
      } else if (column.order === 'descending') {
        this.dataJson.searchForm.pageCondition.sort = '-' + column.prop
      }
      this.getDataList()
    },
    getDataList () {
      this.dataJson.searchForm.pageCondition.current = this.dataJson.paging.current
      this.dataJson.searchForm.pageCondition.size = this.dataJson.paging.size
      // 查询逻辑
      this.settings.loading = true
      getInListApi(this.dataJson.searchForm).then(response => {
        this.dataJson.listData = response.data.records
        this.dataJson.paging = response.data
        this.dataJson.paging.records = {}
      }).finally(() => {
        this.settings.loading = false
      })
      // 查询合计信息
      getInListSumApi(this.dataJson.searchForm).then(response => {
        if (response.data !== null) {
          this.dataJson.sumData = response.data
        } else {
          this.dataJson.sumData.qty = 0
          this.dataJson.sumData.actual_count = 0
        }
      }).finally(() => {
      })
    },
    // 重置查询区域
    doResetSearch () {
      this.dataJson.searchForm = this.$options.data.call(this).dataJson.searchForm
      this.settings.reset1 = !this.settings.reset1
      this.settings.reset2 = !this.settings.reset2
    },

    // 获取row-key
    getRowKeys (row) {
      return row.id
    },
    // table选择框
    handleSelectionChange (val) {
      this.dataJson.multipleSelection = val
    },

    handleOwnerReturnData (val) {
      this.dataJson.searchForm.owner_id = val.id === null ? null : String(val.id)
      this.dataJson.searchForm.owner_name = val.name
    },
    // Placeholder设置
    isPlaceholderShow (val) {
      return val
    },
    // 导出按钮
    handleExport () {
      // 没有选择任何数据的情况
      if (this.dataJson.multipleSelection.length <= 0) {
        this.$alert('请在表格中选择数据进行导出', '未选择数据错误', {
          confirmButtonText: '关闭',
          type: 'error'
        }).then(() => {
          this.settings.btnStatus.showExport = false
        })
      } else if (this.dataJson.multipleSelection.length === this.dataJson.listData.length) {
        // 选择全部的时候
        this.$confirm('请选择：当前页数据导出，全数据导出？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '全数据导出',
          cancelButtonText: '当前页数据导出'
        }).then(() => {
          this.handleExportAllData()
        }).catch(action => {
          // 右上角X
          if (action !== 'close') {
            // 当前页所选择的数据导出
            this.handleExportSelectionData()
          }
        })
      } else {
        // 部分数据导出
        this.handleExportSelectionData()
      }
    },
    // 全部数据导出
    handleExportAllData () {
      // loading
      this.settings.loading = true

      // 开始导出
      exportAllApi(this.dataJson.searchForm).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 部分数据导出
    handleExportSelectionData () {
      // loading
      this.settings.loading = true
      const selectionJson = []
      this.dataJson.multipleSelection.forEach(function (value, index, map) {
        selectionJson.push({ 'id': value.id })
      })
      // 开始导出
      exportApi(selectionJson).then(response => {
        this.settings.loading = false
      }).finally(() => {
        this.settings.loading = false
      })
    },
    // 货主下拉框
    getOwnerData () {
      getOwnerComboListApi().then((_data) => {
        this.dataJson.ownerComboList = _data.data
      }, (_error) => {
      })
    }

  }
}
</script>
