import Layout from '@/layout'

const tableRouter = {
  path: '/system-monitor',
  component: Layout,
  redirect: '/system-monitor',
  name: 'system-monitor',
  meta: {
    title: '系统监控',
    icon: 'codeConsole'
  },
  children: [
    {
      path: 'log',
      component: () => import('@/views/system-monitor/log'),
      name: 'log',
      meta: { title: '操作日志' }
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
