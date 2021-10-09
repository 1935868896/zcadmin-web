<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 1. 此处是上方的查询条 -->
      <!--  类型1 : input 查询功能 -->
      <el-input
        v-model="listQuery.name"
        placeholder="品牌名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
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
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="deleteSelection"
      >
        Delete
      </el-button>
    </div>

    <!-- 表格功能  -->
    <el-table
      :key="tableKey"
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- 方法1 -->

      <!-- label 列名  {{内容}} -->
      <el-table-column ref="" type="selection" width="55" />
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.brandId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌logo地址" width="100px">
        <template slot-scope="{ row }">
          <el-image
            :src="row.logo"
            :preview-src-list="[row.logo]"
            fit="contain"
            style="width: 80px; height: 60px"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="介绍" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.descript }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.showStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="handleUpdate(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="检索首字母" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.firstLetter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.sort }}</span>
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
        <el-form-item label="品牌名">
          <el-input v-model="temp.name" style="width: 220px" />
        </el-form-item>

        <el-form-item label="品牌logo地址">
          <el-input v-model="temp.logo" style="width: 220px" />
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="temp.descript" style="width: 220px" />
        </el-form-item>
        <el-form-item label="显示状态[0-不显示；1-显示]">
          <el-radio-group v-model="temp.showStatus" style="width: 220px">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="检索首字母">
          <el-input v-model="temp.firstLetter" style="width: 220px" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.sort" style="width: 220px" />
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
} from '@/api/project-mange/pms-brand'
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
      listQuery: {
        page: 1,
        limit: 10,
        size: 10,
        current: 1,
        importance: undefined,
        title: undefined,
        type: undefined,
        beginTime: undefined,
        afterTime: undefined
      },
      importanceOptions: [1, 2, 3],

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
    deleteSelection() {
      const selectData = this.$refs.multipleTable.selection
      console.log(selectData)
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
            this.getList()
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
            const index = this.list.findIndex(
              (v) => v.id === this.temp.brandId
            )
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
          console.log(row)
          deleteData(row.brandId).then((res) => {
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
<style scoped>
::v-deep .el-image__error,
.el-image__placeholder {
  background: none;
}
::v-deep .el-image-viewer__wrapper {
  top: 55px;
}
</style>
