import Layout from '@/layout'

const tableRouter = {
  path: '/system-tool',
  component: Layout,
  redirect: '/system-tool',
  name: 'system-tool',
  meta: {
    title: '系统工具',
    icon: 'sys-tools'
  },
  children: [
    {
      path: 'gen-tableinfo',
      component: () => import('@/views/system-tool/gen-code/gen-tableinfo'),
      name: 'gen-tableinfo',
      meta: { title: '代码生成' }
    },
    {
      path: 'gen-config/:tableName',
      component: () => import('@/views/system-tool/gen-code/gen-config'),
      hidden: true,
      name: 'gen-config',
      meta: { title: '代码配置' }
    },
    {
      path: 'upload-file',
      component: () => import('@/views/system-tool/upload/upload'),
      name: 'upload-file',
      meta: { title: '文件上传' }
    },
    {
      path: 'oss-upload-file',
      component: () => import('@/views/system-tool/upload/oss-upload'),
      name: 'upload-file',
      meta: { title: 'oss文件上传' }
    }
  ]
}
export default tableRouter
