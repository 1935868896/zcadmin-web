<template>
  <div class="app-container">
    <div class="filter-container" />
    <el-row>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">字段配置：{{ tableName }}</span>
          <el-button
            :loading="genLoading"
            icon="el-icon-s-promotion"
            size="mini"
            style="float: right; padding: 6px 9px"
            type="success"
            @click="handleUpdateAndGen"
          >保存&生成</el-button>
          <el-button
            :loading="columnLoading"
            icon="el-icon-check"
            size="mini"
            style="float: right; padding: 6px 9px; margin-right: 9px"
            type="primary"
            @click="handleUpdate"
          >保存</el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="数据库中表字段变动时使用该功能"
            placement="top-start"
          >
            <el-button
              :loading="syncLoading"
              icon="el-icon-refresh"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="info"
              @click="sync"
            >同步</el-button>
          </el-tooltip>
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
          <el-table-column label="字段名" min-width="150px">
            <template slot-scope="{ row }">
              <span>{{ row.columnName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段类型" min-width="150px">
            <template slot-scope="{ row }">
              <span>{{ row.columnType }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="150px">
            <template slot-scope="{ row }">
              <el-input v-model="row.remark" placeholder="请输入内容" />
            </template>
          </el-table-column>
          <el-table-column label="必填" width="50px">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.notNull" />
            </template>
          </el-table-column>
          <el-table-column label="表单" width="50px">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.formShow" />
            </template>
          </el-table-column>
          <el-table-column label="表格" width="50px">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.listShow" />
            </template>
          </el-table-column>
          <el-table-column label="查询" width="50px">
            <template slot-scope="{ row }">
              <el-checkbox v-model="row.searchShow" />
            </template>
          </el-table-column>

          <el-table-column label="表单类型" min-width="150px">
            <template slot-scope="{ row }">
              <el-select v-model="row.formType" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="查询类型" min-width="150px">
            <template slot-scope="{ row }">
              <el-select v-model="row.queryType" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-row>

    <!-- 表单功能 el-dialog  -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="role-span">表格配置</span>
            <el-button
              :loading="configLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="updateGenConfig"
            >保存</el-button>
          </div>
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="genConfig"
            label-position="left"
            label-width="90px"
            style="width: 750px; margin-left: 30px"
          >
            <el-form-item label="表名">
              <el-input
                v-model="genConfig.tableName"
                :disabled="true"
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="作者名称">
              <el-input v-model="genConfig.author" style="width: 400px" />
            </el-form-item>
            <el-form-item label="vue模块名称">
              <el-input v-model="genConfig.vueModuleName" style="width: 400px" />
            </el-form-item>
            <el-form-item label="至于包下">
              <el-input v-model="genConfig.pack" style="width: 400px" />
            </el-form-item>
            <el-form-item label="前端代码生成的路径">
              <el-input v-model="genConfig.path" style="width: 400px" />
            </el-form-item>
            <el-form-item label="前端Api文件路径">
              <el-input v-model="genConfig.apiPath" style="width: 400px" />
            </el-form-item>
            <el-form-item label="去表前缀">
              <el-input v-model="genConfig.prefix" style="width: 400px" />
            </el-form-item>
            <el-form-item label="接口名称">
              <el-input v-model="genConfig.apiAlias" style="width: 400px" />
            </el-form-item>
            <el-form-item label="是否逻辑删除">
              <el-radio-group
                v-model="genConfig.logicDelete"
                style="width: 400px"
                @change="handleLogicDelete"
              >
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="逻辑删除字段">
              <el-select
                v-model="genConfig.logicField"
                placeholder="请选择"
                :disabled="!genConfig.logicDelete"
                style="width: 400px"
              >
                <el-option
                  v-for="item in list"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName"
                />
              </el-select>

            </el-form-item>
          </el-form>
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="role-span">方法配置</span>
            <el-button
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="handleUpdateMethodConfig"
            >保存</el-button>
            <el-table
              :key="tableKey"
              :data="methodConfig"
              border
              fit
              highlight-current-row
              style="width: 100%"
              @row-click="onRowClick"
            >

              <el-table-column label="方法名" min-width="150px">
                <template slot-scope="{ row }">
                  <span>{{ row.methodName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="自动生成" min-width="60px">
                <template slot-scope="{ row }">
                  <el-checkbox v-model="row.isGenerator" />
                </template>
              </el-table-column>
              <el-table-column label="是否匿名" min-width="60px">
                <template slot-scope="{ row }">
                  <el-checkbox v-model="row.anonymous" />
                </template>
              </el-table-column>
              <el-table-column label="保留日志" min-width="60px">
                <template slot-scope="{ row }">
                  <el-checkbox v-model="row.logRecord" />
                </template>
              </el-table-column>

            </el-table>
          </div>
        </el-card>

      </el-col>

    </el-row>
  </div>
</template>

<script>
// 导入模块
import {
  fetchList,
  updateCodeGenConfig,
  updateCodeColumnConfig,
  syncConfig,
  updateMethodConfig
} from '@/api/system-tool/gen-code/code-config'
import waves from '@/directive/waves' // waves directive

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
      options1: [
        {
          value: 'text',
          label: '文本框'
        },
        {
          value: 'text-area',
          label: '文本域'
        },
        {
          value: 'date',
          label: '日期框'
        },
        {
          value: 'radio',
          label: '单选框'
        }
      ],
      options2: [
        {
          value: '=',
          label: '='
        },
        {
          value: '!=',
          label: '!='
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '<',
          label: '<'
        },
        {
          value: 'not null',
          label: 'not null'
        },
        {
          value: 'like',
          label: 'like'
        },
        {
          value: 'between',
          label: 'between'
        }
      ],

      dateTime: [],
      tableKey: 0,
      list: null,
      genConfig: null,
      total: 0,
      listLoading: true,
      methodConfig: null,
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

    handleLogicDelete(param) {
      if (!param) {
        this.genConfig.logicField = ''
      }
    },
    sync() {
      syncConfig(this.$route.params.tableName).then(() => {
        this.getList()
      })
    },
    updateGenConfig() {
      updateCodeGenConfig(this.genConfig).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdateAndGen() {
      updateCodeColumnConfig(this.list).then(() => {
        this.getList()
        window.location.href =
          'http://localhost:8080/tool/gen/genCode/' +
          this.$route.params.tableName
      })
    },

    getList() {
      this.listLoading = true
      this.listQuery.tableName = this.$route.params.tableName
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.columnConfigList
        this.genConfig = response.data.codeGenConfig
        this.methodConfig = response.data.codeMethodConfigs
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

    handleUpdateMethodConfig() {
      updateMethodConfig(this.methodConfig).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      }
      )
    },
    handleUpdate(row) {
      updateCodeColumnConfig(this.list).then(() => {
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
