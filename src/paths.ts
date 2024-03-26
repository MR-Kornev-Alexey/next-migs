export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    customers: '/dashboard/customers',
    account: '/dashboard/account',
    charts: '/dashboard/charts',
    tables: '/dashboard/tables',
    integrations: '/dashboard/integrations',
    terminal: '/dashboard/terminal',
    worklog: '/dashboard/worklog',
    manual: '/dashboard/manual',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
