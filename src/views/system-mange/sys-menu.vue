<template>
  <div class="app-container">
    <div class="filter-container" />

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
      <el-table-column label="图标" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否外链" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.iFrame }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缓存" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.cache }}</span>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.hidden }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.permission }}</span>
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
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="left"
        label-width="90px"
        style="width: 750px; margin-left: 30px"
      >
        <el-form-item label="上级菜单ID">
          <el-input v-model="temp.pid" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="子菜单数目">
          <el-input v-model="temp.subCount" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-input v-model="temp.type" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="菜单标题">
          <el-input v-model="temp.title" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="组件名称">
          <el-input v-model="temp.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="组件">
          <el-input v-model="temp.component" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.menuSort" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="temp.icon" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="temp.path" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="是否外链">
          <el-input v-model="temp.iFrame" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="缓存">
          <el-input v-model="temp.cache" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="隐藏">
          <el-input v-model="temp.hidden" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="temp.permission" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="创建者">
          <el-input v-model="temp.createBy" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="更新者">
          <el-input v-model="temp.updateBy" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-input v-model="temp.createTime" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="temp.updateTime" style="width: 220px;" />
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

export default {
  name: 'ComplexTable',
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
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
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
        type: ''
      }
    },

    getMenuTree() {
      this.listLoading = true
      getTree().then((response) => {
        this.tableData = response.data
        console.log(this.tableData)
        // Just to simulate the time of the request
          .setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
      })
    },

    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
            this.list.unshift(this.temp)
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
            const index = this.list.findIndex((v) => v.id === this.temp.menuId)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
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
