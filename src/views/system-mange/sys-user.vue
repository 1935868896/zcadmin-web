<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 1. 此处是上方的查询条 -->
      <!--  类型1 : input 查询功能 -->
      <el-input
        v-model="listQuery.username"
        placeholder="登录名(用户帐号)"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-input
        v-model="listQuery.enabled"
        placeholder="状态：1启用、0禁用"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-date-picker
        v-model="dateTime"
        class="filter-item"
        type="datetimerange"
        style="margin-left: 10px"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />

      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Export
      </el-button>
    </div>

    <!-- 表格功能  -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- 方法1 -->

      <el-table-column label="登录名(用户帐号)" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区域" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态：1启用、0禁用" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.enabled }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.createBy }}</span>
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
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
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
        <el-form-item label="用户名称">
          <el-input v-model="temp.username" style="width: 220px" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="temp.nickName" style="width: 220px" />
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input v-model="temp.phone" style="width: 220px" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.email" style="width: 220px" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="temp.gender" style="width: 220px">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-radio-group v-model="temp.enabled" style="width: 220px">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
          <el-select
            v-model="roleDatas"
            style="width: 437px"
            multiple
            placeholder="请选择"
            @remove-tag="deleteTag"
            @change="changeRole"
          >
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.name"
              :value="item.roleId"
            />
          </el-select>
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
  fetchDetail
} from '@/api/system-mange/sys-user'
import {
  getAllRoles
} from '@/api/system-mange/sys-role'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
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
      dateTime: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      roleDatas: null,
      roles: null,
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
    this.getRoles()
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
    deleteTag(data) {
      console.log(data)
      this.roleDatas = this.roleDatas.filter(
        v => v !== data
      )
      console.log(this.roleDatas)
    },
    changeRole(value) {
      const userRoles = []

      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
      console.log(userRoles)

      this.roleDatas.concat(userRoles)
    },

    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },

    getRoles() {
      getAllRoles().then((res) => {
        this.roles = res.data
      })
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
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          this.temp.author = 'vue-element-admin'
          const transferData = {}
          transferData.user = tempData
          transferData.roles = this.roleDatas
          create(transferData).then(() => {
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
      fetchDetail(row.userId).then((res) => {
        this.roleDatas = res.data.roles
        console.log(this.roleDatas)
      })
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

          const transferData = {}
          transferData.user = tempData
          transferData.roles = this.roleDatas
          update(transferData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.userId)
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
          deleteData(row.userId).then((res) => {
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
