<template>
  <div class="app-container">
    <div class="filter-container" />

    <!-- 表格功能  -->

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色管理</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="handleCreate"
            >操作按钮</el-button>
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
            @sort-change="sortChange"
            @row-click="onRowClick"
          >
            <!-- 方法1 -->

            <!-- label 列名  {{内容}} -->
            <el-table-column
              label="ID"
              prop="id"
              sortable="custom"
              align="center"
              width="80"
              :class-name="getSortClass('id')"
            >
              <template slot-scope="{ row }">
                <span>{{ row.roleId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" min-width="150px">
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="描述" min-width="150px">
              <template slot-scope="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数据权限" min-width="150px">
              <template slot-scope="{ row }">
                <span>{{ row.dataScope }}</span>
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
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleUpdate(row)"
                >
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
        </el-card>
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单权限</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="updateRoleMenu"
            >保存</el-button>
          </div>
          <el-tree
            ref="tree"
            :data="tableData"
            show-checkbox
            :check-strictly="true"
            node-key="menuId"
            :default-checked-keys="checkData"
            :props="defaultProps"
            @check="handleChange"
          /></el-card>
        <div
          class="grid-content bg-purple"
        /></el-col>
    </el-row>

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
        <el-form-item label="名称">
          <el-input v-model="temp.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="角色级别">
          <el-input v-model="temp.level" style="width: 220px" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" style="width: 220px" />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-input v-model="temp.dataScope" style="width: 220px" />
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
  deleteData
} from '@/api/system-mange/sys-role'
import {
  getTree,
  getMenuByRoleId,
  updateBatch
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
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      tableData: null,
      checkData: [],
      checkRoleId: null,
      dateTime: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      updateParam: {
        roleId: null,
        menuIds: []
      },
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
    this.getList()
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
    handleChange(data1, data2) {
      var checked = data2.checkedKeys.indexOf(data1.menuId)

      /** 分几种情况讨论
       *  第一种:如果父亲被选中==>子节点全部选中
       *  第二种: 如果父亲被消失=>子节点全部消失
       *
       *   第三种情况: 子节点是可以被单独选中的,和父亲没有关系 因为涉及权限的问题,可以单独选择某些权限
       */

      const childIds = []
      childIds.push(data1.menuId)
      this.getChildId(data1, childIds)
      let newData = []
      if (checked !== -1) {
        newData = this.$refs.tree.getCheckedKeys().concat(childIds)
        newData = Array.from(new Set(newData))
      } else {
        newData
        this.$refs.tree.getCheckedKeys().forEach((v) => {
          if (childIds.indexOf(v) === -1) newData.push(v)
        })
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(newData)
      })
    },

    getChildId(data, childIds) {
      if (data.children) {
        data.children.filter((v) => {
          const childData = v
          childIds.push(childData.menuId)
          this.getChildId(childData, childIds)
        })
      }
    },

    updateRoleMenu() {
      if (this.checkRoleId == null) {
        this.$message('请先选择角色')
      } else {
        this.updateParam.roleId = this.checkRoleId
        this.updateParam.menuIds = this.$refs.tree.getCheckedKeys()
        updateBatch(this.updateParam).then(() => {
          this.$notify({
            title: 'Success',
            message: 'update Successfully',
            type: 'success',
            duration: 2000
          })
        })
      }
    },
    getMenuTree() {
      this.listLoading = true
      getTree().then((response) => {
        this.tableData = response.data[0].children
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    onRowClick(row, column, event) {
      this.checkRoleId = row.roleId
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
      getMenuByRoleId(row.roleId).then((res) => {
        this.checkData = res.data
      })
    },
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

    getList() {
      this.listLoading = true
      fetchList().then((response) => {
        this.list = response.data

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
            const index = this.list.findIndex((v) => v.id === this.temp.roleId)
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
          deleteData(row.roleId).then((res) => {
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
