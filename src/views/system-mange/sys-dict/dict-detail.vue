<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>字典详情</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleCreate"
        >新增</el-button>
      </div>

      <!-- 表格功能  -->
      <el-table
        v-loading="listLoading"
        :data="dataList"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <!-- 方法1 -->
        <el-table-column
          prop="label"
          label="字典标签"
          min-width="150px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="字典值"
          min-width="150px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="dictSort"
          label="排序"
          min-width="150px"
        >
          <template slot-scope="{ row }">
            <span>{{ row.dictSort }}</span>
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
        :page.sync="pageQuery.current"
        :limit.sync="pageQuery.size"
        @pagination="getList"
      />
    </el-card>
    <!-- 表单功能 el-dialog  -->
    <!-- 表单功能 el-dialog  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="left"
        label-width="100px"
        style="width: 750px;"
      >
        <el-form-item label="字典标签">
          <el-input v-model="temp.label" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="字典值">
          <el-input v-model="temp.value" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="temp.dictSort" style="width: 200px;" />
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
  </div>
</template>

<script>
// 导入模块
import {
  fetchList,
  create,
  update,
  deleteData
} from '@/api/system-mange/sys-dict-detail'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'DictDetail',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      total: 0,
      pageQuery: {
        current: 1,
        size: 10,
        beginTime: undefined,
        afterTime: undefined,
        orders: []
      },
      dateTime: [],
      dataList: null,
      paramQuery: {},
      temp: {
      },
      rules: {

      }
    }
  },
  created() {
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

    parentMethod(name, id) {
      this.paramQuery.dictId = id

      this.getList()
    },
    resetTemp() {
      this.temp = {
        detailId: undefined,
        dictId: undefined,
        label: undefined,
        value: undefined,
        dictSort: undefined,
        createBy: undefined,
        updateBy: undefined,
        createTime: undefined,
        updateTime: undefined
      }
    },

    getList() {
      this.listLoading = true
      fetchList(this.paramQuery, this.pageQuery).then((response) => {
        this.dataList = response.data.records
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.pageQuery.page = 1

      if (this.dateTime != null) {
        this.pageQuery.beginTime = this.dateTime[0]
        this.pageQuery.afterTime = this.dateTime[1]
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
      this.temp.dictId = this.paramQuery.dictId
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          update(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.detailId)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '修改成功',
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
          deleteData(row.detailId).then((res) => {
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
    }
  }
}
</script>
