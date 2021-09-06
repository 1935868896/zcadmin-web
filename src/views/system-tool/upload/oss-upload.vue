<template>
  <div>
    <el-upload
      ref="upload"
      :action="addressOss"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :data="dataOss"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      auto-upload="true"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>
<script>
import { getOssToken } from '@/api/system-tool/upload/upload'
export default {
  data() {
    return {
      addressOss: null,
      dataOss: null
    }
  },

  methods: {
    beforeUpload(file) {
      const fileName = 'test' + file.uid + file.name // 文件名，和后台约定
      const pathPre = 'test'
      console.log('1')
      const result = getOssToken(fileName, pathPre).then((reponse) => {
        this.addressOss = reponse.data.host // 上传地址
        console.log(reponse.data.host)
        this.dataOss = {
          key: fileName,
          ossAccessKeyId: reponse.data.accessId,
          policy: reponse.data.policy,
          signature: reponse.data.signature
          // callback: reponse.data.callback
        } // 上传额外参数
        return true
      })
      return result
    },
    uploadError() {
      this.$message.error('图片上传失败！')
    },
    uploadSuccess() {
      this.$message.success('图片上传成功！')
      this.photos.push(this.addressOss + '' + this.dataOss.key)
    }
  }
}
</script>
