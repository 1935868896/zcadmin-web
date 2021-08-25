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
      path: 'error-log',
      component: () => import('@/views/system-monitor/error-log'),
      name: 'error-log',
      meta: { title: '错误日志' }
    }
  ]
}
export default tableRouter
