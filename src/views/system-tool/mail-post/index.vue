<template>
  <div class="components-container">
    <el-form ref="form" :model="emailConfig" :rules="rules" style="margin-top: 6px;" size="small" label-width="100px">
      <el-form-item label="邮件标题" prop="subject">
        <el-input v-model="emailConfig.title" style="width: 800px" />
      </el-form-item>
      <el-form-item label="收件邮箱" prop="subject">
        <el-input v-model="emailConfig.to" style="width: 800px" />
      </el-form-item>
      <div>
        <tinymce v-model="emailConfig.content" :height="300" />
      </div>
      <div class="editor-content" v-html="content" />
      <el-button type="primary" @click="emailPost">邮件发送</el-button>
    </el-form>
  </div>

</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mailPost } from '@/api/system-tool/mail-post/mail'
export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  data() {
    return {

      emailConfig: {
        to: '',
        title: '',
        content: '',
        filePath: '',
        fileName: ''
      }
    }
  },
  methods: {
    emailPost() {
      mailPost(this.emailConfig).then(() => {
        this.$message({
          message: '邮件成功发送',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
