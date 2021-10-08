<template>
  <div class="app-container">
    <div class="filter-container" />

    <!-- 表格功能  -->

    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色管理</span>
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
            @row-click="rowClick"
          >
            <!-- 方法1 -->
            <el-table-column
              prop="name"
              label="字典名称"
              min-width="130px"
            >
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述"
              min-width="130px"
            >
              <template slot-scope="{ row }">
                <span>{{ row.description }}</span>
              </template>
            </el-table-column>

            <!-- 操作 -->
            <el-table-column
              label="操作"
              align="center"
              width="160"
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
            :page-sizes="pageQuery.pageSize"
            layout="total, prev, pager, next"
            small="true"
            @pagination="getList"
          />
        </el-card>
        <div class="grid-content bg-purple" />
      </el-col>
      <el-col :span="14">
        <DictDetail ref="dictDetail" @childEvent="parentMethod" />
        <div
          class="grid-content bg-purple"
        /></el-col>
    </el-row>
    <!-- 表单功能 el-dialog  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        label-position="left"
        label-width="80px"
        style="width: 750px;"
      >
        <el-form-item label="字典名称">
          <el-input v-model="temp.name" style="width: 140px;" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" style="width: 160px;" />
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
} from '@/api/system-mange/sys-dict'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DictDetail from './dict-detail'

export default {
  name: 'ComplexTable',
  components: { Pagination, DictDetail },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      total: 0,
      pageQuery: {
        current: 1,
        size: 5,
        pageSize: [5, 10, 20, 30, 50],
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
    this.getList()
  },
  methods: {
    rowClick(row, column, event) {
      this.$refs.dictDetail.parentMethod(row.dictNmae, row.dictId)
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

    resetTemp() {
      this.temp = {
        dictId: undefined,
        name: undefined,
        description: undefined,
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
            const index = this.list.findIndex((v) => v.id === this.temp.dictId)
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
          deleteData(row.dictId).then((res) => {
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
    }

  }
}
</script>
