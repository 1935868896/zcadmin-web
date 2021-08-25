export default {
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
        this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
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
        tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        update(tempData).then(() => {
          const index = this.list.findIndex((v) => v.id === this.temp.id)
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
        deleteData(row.bookId).then((res) => {
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

  handleFetchPv(pv) {
    fetchPv(pv).then((response) => {
      this.pvData = response.data.pvData
      this.dialogPvVisible = true
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
