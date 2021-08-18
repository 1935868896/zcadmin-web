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
      path: 'book-info-table',
      component: () => import('@/views/project/book-info'),
      name: '图书信息2',
      meta: { title: '图书信息' }
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
