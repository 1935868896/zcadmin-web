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
      path: 'sys-user',
      component: () => import('@/views/system-mange/sys-user'),
      name: 'sys-user',
      meta: { title: '系统用户管理' }
    }, {
      path: 'sys-role',
      component: () => import('@/views/system-mange/sys-role'),
      name: 'sys-role',
      meta: { title: '系统角色管理' }
    },
    {
      path: 'sys-menu',
      component: () => import('@/views/system-mange/sys-menu'),
      name: 'sys-menu',
      meta: { title: '系统菜单管理' }
    },
    {
      path: 'quartz-task',
      component: () => import('@/views/system-mange/quartz-task'),
      name: 'quartz-task',
      meta: { title: '任务调度' }
    }
  ]
}
export default tableRouter
