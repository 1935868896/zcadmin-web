import Layout from '@/layout'

const tableRouter = {
  path: '/system-mange',
  component: Layout,
  redirect: '/system-mange',
  name: 'system-mange',
  meta: {
    title: '系统管理',
    icon: 'system'
  },
  children: [
    {
      path: 'quartz-task',
      component: () => import('@/views/system-mange/quartz-task'),
      name: 'quartz-task',
      meta: { title: '任务调度' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/customize/complex-table'),
      name: '文章',
      meta: { title: '文章' }
    }
  ]
}
export default tableRouter
