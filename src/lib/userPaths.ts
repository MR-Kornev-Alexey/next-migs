// paths.ts

export const userPaths = {
  user: {
    home: '/',
    auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
    dashboard: {
      overview: '/dashboard',
      account: '/dashboard/account',
      customers: '/dashboard/customers',
      integrations: '/dashboard/integrations',
      // settings: '/dashboard/settings',
      // manual: '/dashboard/manual',
    },
    errors: { notFound: '/errors/not-found' },
  },
  admin: {
    home: '/',
    dashboard: '/admin/dashboard',
    manageUsers: '/admin/manage-users',
    settings: '/admin/settings',
  },
  dispatcher: {
    home: '/',
    dashboard: '/dispatcher/dashboard',
    assignments: '/dispatcher/assignments',
    schedule: '/dispatcher/schedule',
  },
  supervisor: {
    home: '/',
    dashboard: '/supervisor/dashboard',
    reports: '/supervisor/reports',
    analytics: '/supervisor/analytics',
  },
} as const;

