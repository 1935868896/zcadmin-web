<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>

    </div>

    <!-- 表格功能  -->
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!-- 方法1 -->

      <!-- label 列名  {{内容}} -->

      <el-table-column label="菜单标题" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" min-width="80px" style="text-align: center;">
        <template slot-scope="{ row }">
          <svg-icon :icon-class="row.icon ?row.icon : ''" />
        </template>
      </el-table-column>
      <el-table-column label="链接地址" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件名称" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.menuSort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="外链" min-width="150px">
        <template slot-scope="{ row }">
          <span v-if="row.iFrame">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="缓存" min-width="150px">
        <template slot-scope="{ row }">
          <span v-if="row.cache">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="展示" min-width="150px">
        <template slot-scope="{ row }">
          <span v-if="row.hidden">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <!-- 操作1：简单的按钮模式 -->
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单功能 el-dialog  -->
    <!-- 表单功能 el-dialog  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        :inline="true"
        label-position="left"
        label-width="80px"
        style="width: 580px; margin-left: 15px"
      >
        <el-form-item label="菜单类型" prop="temp.type">
          <el-radio-group v-model="temp.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.type !== '2'" label="菜单图标" prop="temp.icon">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="temp.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="temp.icon" slot="prefix" :icon-class="temp.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="上级类目" prop="pid">
          <treeselect
            v-model="temp.pid"
            :options="selectTreeData"
            :normalizer="normalizer"
            style="width: 450px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
        <el-form-item v-show="temp.type !== '2'" label="是否外链">
          <el-radio-group v-model="temp.iframe" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.type === '1'" label="缓存">
          <el-radio-group v-model="temp.cache" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.type !== '2'" label="是否隐藏">
          <el-radio-group v-model="temp.hidden" size="mini">
            <el-radio-button label="true">是</el-radio-button>
            <el-radio-button label="false">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="temp.type !== '2'" label="菜单标题">
          <el-input v-model="temp.title" style="width: 180px;" />
        </el-form-item>
        <el-form-item v-show="temp.type === '2'" label="按钮标题">
          <el-input v-model="temp.title" style="width: 180px;" />
        </el-form-item>
        <el-form-item v-show="temp.iframe !== 'true' && temp.type === '1'" label="组件名称">
          <el-input v-model="temp.name" style="width: 180px;" />
        </el-form-item>
        <el-form-item v-show="temp.iframe !== 'true' && temp.type === '1'" label="组件">
          <el-input v-model="temp.component" style="width: 180px;" />
        </el-form-item>

        <el-form-item v-show="temp.type === '1'" label="链接地址">
          <el-input v-model="temp.path" style="width: 180px;" />
        </el-form-item>

        <el-form-item v-show="temp.type !== '0'" label="权限">
          <el-input v-model="temp.permission" style="width: 180px;" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.menuSort" style="width: 180px;" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          Confirm
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入模块
import {
  fetchList,
  create,
  update,
  deleteData,
  getTree
} from '@/api/system-mange/sys-menu'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
export default {
  name: 'ComplexTable',
  components: { Treeselect, IconSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableData: null,
      selectTreeData: null,
      dateTime: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        size: 10,
        current: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        beginTime: undefined,
        afterTime: undefined
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],

      normalizer(tableData) {
        return {
          id: tableData.menuId,
          label: tableData.title,
          children: tableData.children
        }
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '1',
        status: 'published',
        icon: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getMenuTree()
  },
  methods: {

    selected(name) {
      this.temp.icon = name
    },
    // 方法: 增删改查:
    // getList() 查: 不带任何参数,根据分页查询数据
    // handleFilter() 查: 带参查询
    // handleCreate() 创建: 调出create表单
    // hanleUpdate() 修改: 调出update表单
    // createData() 根据参数 插入数据
    // updateData() 根据参数 修改数据
    // handleDownload() 下载数据    // formatJson()
    //

    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '0',
        icon: ''
      }
    },

    getMenuTree() {
      this.listLoading = true
      getTree().then((response) => {
        this.tableData = response.data[0].children
        this.selectTreeData = response.data
        console.log(this.tableData)
      })
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.dateTime != null) {
        this.listQuery.beginTime = this.dateTime[0]
        this.listQuery.afterTime = this.dateTime[1]
      }
      this.getList()
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.author = 'vue-element-admin'
          create(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.type = this.temp.type.toString()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          update(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteData(row.menuId).then((res) => {
            this.list.splice(index, 1)
            this.$message({
              type: 'info',
              message: '已成功删除'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
