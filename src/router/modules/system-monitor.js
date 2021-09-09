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
      path: 'online-user',
      component: () => import('@/views/system-monitor/online-user'),
      name: 'online-user',
      meta: { title: '在线用户' }
    },
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
    },
    {
      path: 'http://localhost:8080/doc.html#/home',
      meta: { title: 'swagger接口' }
    }
  ]
}
export default tableRouter
