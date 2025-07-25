/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ClerkRouteImport } from './routes/clerk/route'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as authRouteImport } from './routes/(auth)/route'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as errors503Import } from './routes/(errors)/503'
import { Route as errors500Import } from './routes/(errors)/500'
import { Route as errors404Import } from './routes/(errors)/404'
import { Route as errors403Import } from './routes/(errors)/403'
import { Route as errors401Import } from './routes/(errors)/401'
import { Route as authSignUpImport } from './routes/(auth)/sign-up'
import { Route as authSignIn2Import } from './routes/(auth)/sign-in-2'
import { Route as authSignInImport } from './routes/(auth)/sign-in'
import { Route as authOtpImport } from './routes/(auth)/otp'
import { Route as authForgotPasswordImport } from './routes/(auth)/forgot-password'
import { Route as ClerkAuthenticatedRouteImport } from './routes/clerk/_authenticated/route'
import { Route as ClerkauthRouteImport } from './routes/clerk/(auth)/route'
import { Route as AuthenticatedSettingsRouteImport } from './routes/_authenticated/settings/route'
import { Route as AuthenticatedUsersIndexImport } from './routes/_authenticated/users/index'
import { Route as AuthenticatedTransportIndexImport } from './routes/_authenticated/transport/index'
import { Route as AuthenticatedTasksIndexImport } from './routes/_authenticated/tasks/index'
import { Route as AuthenticatedSettingsIndexImport } from './routes/_authenticated/settings/index'
import { Route as AuthenticatedProjectIndexImport } from './routes/_authenticated/project/index'
import { Route as AuthenticatedMobilityIndexImport } from './routes/_authenticated/mobility/index'
import { Route as AuthenticatedHelpCenterIndexImport } from './routes/_authenticated/help-center/index'
import { Route as AuthenticatedFacilityIndexImport } from './routes/_authenticated/facility/index'
import { Route as AuthenticatedDrivingInfoIndexImport } from './routes/_authenticated/driving-info/index'
import { Route as AuthenticatedChatsIndexImport } from './routes/_authenticated/chats/index'
import { Route as AuthenticatedAppsIndexImport } from './routes/_authenticated/apps/index'
import { Route as ClerkAuthenticatedUserManagementImport } from './routes/clerk/_authenticated/user-management'
import { Route as ClerkauthSignUpImport } from './routes/clerk/(auth)/sign-up'
import { Route as ClerkauthSignInImport } from './routes/clerk/(auth)/sign-in'
import { Route as AuthenticatedTransportIdImport } from './routes/_authenticated/transport/$id'
import { Route as AuthenticatedSettingsNotificationsImport } from './routes/_authenticated/settings/notifications'
import { Route as AuthenticatedSettingsDisplayImport } from './routes/_authenticated/settings/display'
import { Route as AuthenticatedSettingsAppearanceImport } from './routes/_authenticated/settings/appearance'
import { Route as AuthenticatedSettingsAccountImport } from './routes/_authenticated/settings/account'

// Create/Update Routes

const ClerkRouteRoute = ClerkRouteImport.update({
  id: '/clerk',
  path: '/clerk',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const authRouteRoute = authRouteImport.update({
  id: '/(auth)',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const errors503Route = errors503Import.update({
  id: '/(errors)/503',
  path: '/503',
  getParentRoute: () => rootRoute,
} as any)

const errors500Route = errors500Import.update({
  id: '/(errors)/500',
  path: '/500',
  getParentRoute: () => rootRoute,
} as any)

const errors404Route = errors404Import.update({
  id: '/(errors)/404',
  path: '/404',
  getParentRoute: () => rootRoute,
} as any)

const errors403Route = errors403Import.update({
  id: '/(errors)/403',
  path: '/403',
  getParentRoute: () => rootRoute,
} as any)

const errors401Route = errors401Import.update({
  id: '/(errors)/401',
  path: '/401',
  getParentRoute: () => rootRoute,
} as any)

const authSignUpRoute = authSignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => authRouteRoute,
} as any)

const authSignIn2Route = authSignIn2Import.update({
  id: '/sign-in-2',
  path: '/sign-in-2',
  getParentRoute: () => authRouteRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => authRouteRoute,
} as any)

const authOtpRoute = authOtpImport.update({
  id: '/otp',
  path: '/otp',
  getParentRoute: () => authRouteRoute,
} as any)

const authForgotPasswordRoute = authForgotPasswordImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => authRouteRoute,
} as any)

const ClerkAuthenticatedRouteRoute = ClerkAuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => ClerkRouteRoute,
} as any)

const ClerkauthRouteRoute = ClerkauthRouteImport.update({
  id: '/(auth)',
  getParentRoute: () => ClerkRouteRoute,
} as any)

const AuthenticatedSettingsRouteRoute = AuthenticatedSettingsRouteImport.update(
  {
    id: '/settings',
    path: '/settings',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any,
)

const AuthenticatedUsersIndexRoute = AuthenticatedUsersIndexImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedTransportIndexRoute =
  AuthenticatedTransportIndexImport.update({
    id: '/transport/',
    path: '/transport/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

const AuthenticatedTasksIndexRoute = AuthenticatedTasksIndexImport.update({
  id: '/tasks/',
  path: '/tasks/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedSettingsIndexRoute = AuthenticatedSettingsIndexImport.update(
  {
    id: '/',
    path: '/',
    getParentRoute: () => AuthenticatedSettingsRouteRoute,
  } as any,
)

const AuthenticatedProjectIndexRoute = AuthenticatedProjectIndexImport.update({
  id: '/project/',
  path: '/project/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedMobilityIndexRoute = AuthenticatedMobilityIndexImport.update(
  {
    id: '/mobility/',
    path: '/mobility/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any,
)

const AuthenticatedHelpCenterIndexRoute =
  AuthenticatedHelpCenterIndexImport.update({
    id: '/help-center/',
    path: '/help-center/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

const AuthenticatedFacilityIndexRoute = AuthenticatedFacilityIndexImport.update(
  {
    id: '/facility/',
    path: '/facility/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any,
)

const AuthenticatedDrivingInfoIndexRoute =
  AuthenticatedDrivingInfoIndexImport.update({
    id: '/driving-info/',
    path: '/driving-info/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

const AuthenticatedChatsIndexRoute = AuthenticatedChatsIndexImport.update({
  id: '/chats/',
  path: '/chats/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedAppsIndexRoute = AuthenticatedAppsIndexImport.update({
  id: '/apps/',
  path: '/apps/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const ClerkAuthenticatedUserManagementRoute =
  ClerkAuthenticatedUserManagementImport.update({
    id: '/user-management',
    path: '/user-management',
    getParentRoute: () => ClerkAuthenticatedRouteRoute,
  } as any)

const ClerkauthSignUpRoute = ClerkauthSignUpImport.update({
  id: '/sign-up',
  path: '/sign-up',
  getParentRoute: () => ClerkauthRouteRoute,
} as any)

const ClerkauthSignInRoute = ClerkauthSignInImport.update({
  id: '/sign-in',
  path: '/sign-in',
  getParentRoute: () => ClerkauthRouteRoute,
} as any)

const AuthenticatedTransportIdRoute = AuthenticatedTransportIdImport.update({
  id: '/transport/$id',
  path: '/transport/$id',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedSettingsNotificationsRoute =
  AuthenticatedSettingsNotificationsImport.update({
    id: '/notifications',
    path: '/notifications',
    getParentRoute: () => AuthenticatedSettingsRouteRoute,
  } as any)

const AuthenticatedSettingsDisplayRoute =
  AuthenticatedSettingsDisplayImport.update({
    id: '/display',
    path: '/display',
    getParentRoute: () => AuthenticatedSettingsRouteRoute,
  } as any)

const AuthenticatedSettingsAppearanceRoute =
  AuthenticatedSettingsAppearanceImport.update({
    id: '/appearance',
    path: '/appearance',
    getParentRoute: () => AuthenticatedSettingsRouteRoute,
  } as any)

const AuthenticatedSettingsAccountRoute =
  AuthenticatedSettingsAccountImport.update({
    id: '/account',
    path: '/account',
    getParentRoute: () => AuthenticatedSettingsRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/(auth)': {
      id: '/(auth)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/clerk': {
      id: '/clerk'
      path: '/clerk'
      fullPath: '/clerk'
      preLoaderRoute: typeof ClerkRouteImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/settings': {
      id: '/_authenticated/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthenticatedSettingsRouteImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/clerk/(auth)': {
      id: '/clerk/(auth)'
      path: '/'
      fullPath: '/clerk/'
      preLoaderRoute: typeof ClerkauthRouteImport
      parentRoute: typeof ClerkRouteImport
    }
    '/clerk/_authenticated': {
      id: '/clerk/_authenticated'
      path: ''
      fullPath: '/clerk'
      preLoaderRoute: typeof ClerkAuthenticatedRouteImport
      parentRoute: typeof ClerkRouteImport
    }
    '/(auth)/forgot-password': {
      id: '/(auth)/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof authForgotPasswordImport
      parentRoute: typeof authRouteImport
    }
    '/(auth)/otp': {
      id: '/(auth)/otp'
      path: '/otp'
      fullPath: '/otp'
      preLoaderRoute: typeof authOtpImport
      parentRoute: typeof authRouteImport
    }
    '/(auth)/sign-in': {
      id: '/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof authRouteImport
    }
    '/(auth)/sign-in-2': {
      id: '/(auth)/sign-in-2'
      path: '/sign-in-2'
      fullPath: '/sign-in-2'
      preLoaderRoute: typeof authSignIn2Import
      parentRoute: typeof authRouteImport
    }
    '/(auth)/sign-up': {
      id: '/(auth)/sign-up'
      path: '/sign-up'
      fullPath: '/sign-up'
      preLoaderRoute: typeof authSignUpImport
      parentRoute: typeof authRouteImport
    }
    '/(errors)/401': {
      id: '/(errors)/401'
      path: '/401'
      fullPath: '/401'
      preLoaderRoute: typeof errors401Import
      parentRoute: typeof rootRoute
    }
    '/(errors)/403': {
      id: '/(errors)/403'
      path: '/403'
      fullPath: '/403'
      preLoaderRoute: typeof errors403Import
      parentRoute: typeof rootRoute
    }
    '/(errors)/404': {
      id: '/(errors)/404'
      path: '/404'
      fullPath: '/404'
      preLoaderRoute: typeof errors404Import
      parentRoute: typeof rootRoute
    }
    '/(errors)/500': {
      id: '/(errors)/500'
      path: '/500'
      fullPath: '/500'
      preLoaderRoute: typeof errors500Import
      parentRoute: typeof rootRoute
    }
    '/(errors)/503': {
      id: '/(errors)/503'
      path: '/503'
      fullPath: '/503'
      preLoaderRoute: typeof errors503Import
      parentRoute: typeof rootRoute
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/settings/account': {
      id: '/_authenticated/settings/account'
      path: '/account'
      fullPath: '/settings/account'
      preLoaderRoute: typeof AuthenticatedSettingsAccountImport
      parentRoute: typeof AuthenticatedSettingsRouteImport
    }
    '/_authenticated/settings/appearance': {
      id: '/_authenticated/settings/appearance'
      path: '/appearance'
      fullPath: '/settings/appearance'
      preLoaderRoute: typeof AuthenticatedSettingsAppearanceImport
      parentRoute: typeof AuthenticatedSettingsRouteImport
    }
    '/_authenticated/settings/display': {
      id: '/_authenticated/settings/display'
      path: '/display'
      fullPath: '/settings/display'
      preLoaderRoute: typeof AuthenticatedSettingsDisplayImport
      parentRoute: typeof AuthenticatedSettingsRouteImport
    }
    '/_authenticated/settings/notifications': {
      id: '/_authenticated/settings/notifications'
      path: '/notifications'
      fullPath: '/settings/notifications'
      preLoaderRoute: typeof AuthenticatedSettingsNotificationsImport
      parentRoute: typeof AuthenticatedSettingsRouteImport
    }
    '/_authenticated/transport/$id': {
      id: '/_authenticated/transport/$id'
      path: '/transport/$id'
      fullPath: '/transport/$id'
      preLoaderRoute: typeof AuthenticatedTransportIdImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/clerk/(auth)/sign-in': {
      id: '/clerk/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/clerk/sign-in'
      preLoaderRoute: typeof ClerkauthSignInImport
      parentRoute: typeof ClerkauthRouteImport
    }
    '/clerk/(auth)/sign-up': {
      id: '/clerk/(auth)/sign-up'
      path: '/sign-up'
      fullPath: '/clerk/sign-up'
      preLoaderRoute: typeof ClerkauthSignUpImport
      parentRoute: typeof ClerkauthRouteImport
    }
    '/clerk/_authenticated/user-management': {
      id: '/clerk/_authenticated/user-management'
      path: '/user-management'
      fullPath: '/clerk/user-management'
      preLoaderRoute: typeof ClerkAuthenticatedUserManagementImport
      parentRoute: typeof ClerkAuthenticatedRouteImport
    }
    '/_authenticated/apps/': {
      id: '/_authenticated/apps/'
      path: '/apps'
      fullPath: '/apps'
      preLoaderRoute: typeof AuthenticatedAppsIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/chats/': {
      id: '/_authenticated/chats/'
      path: '/chats'
      fullPath: '/chats'
      preLoaderRoute: typeof AuthenticatedChatsIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/driving-info/': {
      id: '/_authenticated/driving-info/'
      path: '/driving-info'
      fullPath: '/driving-info'
      preLoaderRoute: typeof AuthenticatedDrivingInfoIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/facility/': {
      id: '/_authenticated/facility/'
      path: '/facility'
      fullPath: '/facility'
      preLoaderRoute: typeof AuthenticatedFacilityIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/help-center/': {
      id: '/_authenticated/help-center/'
      path: '/help-center'
      fullPath: '/help-center'
      preLoaderRoute: typeof AuthenticatedHelpCenterIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/mobility/': {
      id: '/_authenticated/mobility/'
      path: '/mobility'
      fullPath: '/mobility'
      preLoaderRoute: typeof AuthenticatedMobilityIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/project/': {
      id: '/_authenticated/project/'
      path: '/project'
      fullPath: '/project'
      preLoaderRoute: typeof AuthenticatedProjectIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/settings/': {
      id: '/_authenticated/settings/'
      path: '/'
      fullPath: '/settings/'
      preLoaderRoute: typeof AuthenticatedSettingsIndexImport
      parentRoute: typeof AuthenticatedSettingsRouteImport
    }
    '/_authenticated/tasks/': {
      id: '/_authenticated/tasks/'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof AuthenticatedTasksIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/transport/': {
      id: '/_authenticated/transport/'
      path: '/transport'
      fullPath: '/transport'
      preLoaderRoute: typeof AuthenticatedTransportIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/users/': {
      id: '/_authenticated/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof AuthenticatedUsersIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
  }
}

// Create and export the route tree

interface authRouteRouteChildren {
  authForgotPasswordRoute: typeof authForgotPasswordRoute
  authOtpRoute: typeof authOtpRoute
  authSignInRoute: typeof authSignInRoute
  authSignIn2Route: typeof authSignIn2Route
  authSignUpRoute: typeof authSignUpRoute
}

const authRouteRouteChildren: authRouteRouteChildren = {
  authForgotPasswordRoute: authForgotPasswordRoute,
  authOtpRoute: authOtpRoute,
  authSignInRoute: authSignInRoute,
  authSignIn2Route: authSignIn2Route,
  authSignUpRoute: authSignUpRoute,
}

const authRouteRouteWithChildren = authRouteRoute._addFileChildren(
  authRouteRouteChildren,
)

interface AuthenticatedSettingsRouteRouteChildren {
  AuthenticatedSettingsAccountRoute: typeof AuthenticatedSettingsAccountRoute
  AuthenticatedSettingsAppearanceRoute: typeof AuthenticatedSettingsAppearanceRoute
  AuthenticatedSettingsDisplayRoute: typeof AuthenticatedSettingsDisplayRoute
  AuthenticatedSettingsNotificationsRoute: typeof AuthenticatedSettingsNotificationsRoute
  AuthenticatedSettingsIndexRoute: typeof AuthenticatedSettingsIndexRoute
}

const AuthenticatedSettingsRouteRouteChildren: AuthenticatedSettingsRouteRouteChildren =
  {
    AuthenticatedSettingsAccountRoute: AuthenticatedSettingsAccountRoute,
    AuthenticatedSettingsAppearanceRoute: AuthenticatedSettingsAppearanceRoute,
    AuthenticatedSettingsDisplayRoute: AuthenticatedSettingsDisplayRoute,
    AuthenticatedSettingsNotificationsRoute:
      AuthenticatedSettingsNotificationsRoute,
    AuthenticatedSettingsIndexRoute: AuthenticatedSettingsIndexRoute,
  }

const AuthenticatedSettingsRouteRouteWithChildren =
  AuthenticatedSettingsRouteRoute._addFileChildren(
    AuthenticatedSettingsRouteRouteChildren,
  )

interface AuthenticatedRouteRouteChildren {
  AuthenticatedSettingsRouteRoute: typeof AuthenticatedSettingsRouteRouteWithChildren
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedTransportIdRoute: typeof AuthenticatedTransportIdRoute
  AuthenticatedAppsIndexRoute: typeof AuthenticatedAppsIndexRoute
  AuthenticatedChatsIndexRoute: typeof AuthenticatedChatsIndexRoute
  AuthenticatedDrivingInfoIndexRoute: typeof AuthenticatedDrivingInfoIndexRoute
  AuthenticatedFacilityIndexRoute: typeof AuthenticatedFacilityIndexRoute
  AuthenticatedHelpCenterIndexRoute: typeof AuthenticatedHelpCenterIndexRoute
  AuthenticatedMobilityIndexRoute: typeof AuthenticatedMobilityIndexRoute
  AuthenticatedProjectIndexRoute: typeof AuthenticatedProjectIndexRoute
  AuthenticatedTasksIndexRoute: typeof AuthenticatedTasksIndexRoute
  AuthenticatedTransportIndexRoute: typeof AuthenticatedTransportIndexRoute
  AuthenticatedUsersIndexRoute: typeof AuthenticatedUsersIndexRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedSettingsRouteRoute: AuthenticatedSettingsRouteRouteWithChildren,
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedTransportIdRoute: AuthenticatedTransportIdRoute,
  AuthenticatedAppsIndexRoute: AuthenticatedAppsIndexRoute,
  AuthenticatedChatsIndexRoute: AuthenticatedChatsIndexRoute,
  AuthenticatedDrivingInfoIndexRoute: AuthenticatedDrivingInfoIndexRoute,
  AuthenticatedFacilityIndexRoute: AuthenticatedFacilityIndexRoute,
  AuthenticatedHelpCenterIndexRoute: AuthenticatedHelpCenterIndexRoute,
  AuthenticatedMobilityIndexRoute: AuthenticatedMobilityIndexRoute,
  AuthenticatedProjectIndexRoute: AuthenticatedProjectIndexRoute,
  AuthenticatedTasksIndexRoute: AuthenticatedTasksIndexRoute,
  AuthenticatedTransportIndexRoute: AuthenticatedTransportIndexRoute,
  AuthenticatedUsersIndexRoute: AuthenticatedUsersIndexRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

interface ClerkauthRouteRouteChildren {
  ClerkauthSignInRoute: typeof ClerkauthSignInRoute
  ClerkauthSignUpRoute: typeof ClerkauthSignUpRoute
}

const ClerkauthRouteRouteChildren: ClerkauthRouteRouteChildren = {
  ClerkauthSignInRoute: ClerkauthSignInRoute,
  ClerkauthSignUpRoute: ClerkauthSignUpRoute,
}

const ClerkauthRouteRouteWithChildren = ClerkauthRouteRoute._addFileChildren(
  ClerkauthRouteRouteChildren,
)

interface ClerkAuthenticatedRouteRouteChildren {
  ClerkAuthenticatedUserManagementRoute: typeof ClerkAuthenticatedUserManagementRoute
}

const ClerkAuthenticatedRouteRouteChildren: ClerkAuthenticatedRouteRouteChildren =
  {
    ClerkAuthenticatedUserManagementRoute:
      ClerkAuthenticatedUserManagementRoute,
  }

const ClerkAuthenticatedRouteRouteWithChildren =
  ClerkAuthenticatedRouteRoute._addFileChildren(
    ClerkAuthenticatedRouteRouteChildren,
  )

interface ClerkRouteRouteChildren {
  ClerkauthRouteRoute: typeof ClerkauthRouteRouteWithChildren
  ClerkAuthenticatedRouteRoute: typeof ClerkAuthenticatedRouteRouteWithChildren
}

const ClerkRouteRouteChildren: ClerkRouteRouteChildren = {
  ClerkauthRouteRoute: ClerkauthRouteRouteWithChildren,
  ClerkAuthenticatedRouteRoute: ClerkAuthenticatedRouteRouteWithChildren,
}

const ClerkRouteRouteWithChildren = ClerkRouteRoute._addFileChildren(
  ClerkRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof AuthenticatedIndexRoute
  '': typeof AuthenticatedRouteRouteWithChildren
  '/clerk': typeof ClerkAuthenticatedRouteRouteWithChildren
  '/settings': typeof AuthenticatedSettingsRouteRouteWithChildren
  '/clerk/': typeof ClerkauthRouteRouteWithChildren
  '/forgot-password': typeof authForgotPasswordRoute
  '/otp': typeof authOtpRoute
  '/sign-in': typeof authSignInRoute
  '/sign-in-2': typeof authSignIn2Route
  '/sign-up': typeof authSignUpRoute
  '/401': typeof errors401Route
  '/403': typeof errors403Route
  '/404': typeof errors404Route
  '/500': typeof errors500Route
  '/503': typeof errors503Route
  '/settings/account': typeof AuthenticatedSettingsAccountRoute
  '/settings/appearance': typeof AuthenticatedSettingsAppearanceRoute
  '/settings/display': typeof AuthenticatedSettingsDisplayRoute
  '/settings/notifications': typeof AuthenticatedSettingsNotificationsRoute
  '/transport/$id': typeof AuthenticatedTransportIdRoute
  '/clerk/sign-in': typeof ClerkauthSignInRoute
  '/clerk/sign-up': typeof ClerkauthSignUpRoute
  '/clerk/user-management': typeof ClerkAuthenticatedUserManagementRoute
  '/apps': typeof AuthenticatedAppsIndexRoute
  '/chats': typeof AuthenticatedChatsIndexRoute
  '/driving-info': typeof AuthenticatedDrivingInfoIndexRoute
  '/facility': typeof AuthenticatedFacilityIndexRoute
  '/help-center': typeof AuthenticatedHelpCenterIndexRoute
  '/mobility': typeof AuthenticatedMobilityIndexRoute
  '/project': typeof AuthenticatedProjectIndexRoute
  '/settings/': typeof AuthenticatedSettingsIndexRoute
  '/tasks': typeof AuthenticatedTasksIndexRoute
  '/transport': typeof AuthenticatedTransportIndexRoute
  '/users': typeof AuthenticatedUsersIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof AuthenticatedIndexRoute
  '/clerk': typeof ClerkAuthenticatedRouteRouteWithChildren
  '/forgot-password': typeof authForgotPasswordRoute
  '/otp': typeof authOtpRoute
  '/sign-in': typeof authSignInRoute
  '/sign-in-2': typeof authSignIn2Route
  '/sign-up': typeof authSignUpRoute
  '/401': typeof errors401Route
  '/403': typeof errors403Route
  '/404': typeof errors404Route
  '/500': typeof errors500Route
  '/503': typeof errors503Route
  '/settings/account': typeof AuthenticatedSettingsAccountRoute
  '/settings/appearance': typeof AuthenticatedSettingsAppearanceRoute
  '/settings/display': typeof AuthenticatedSettingsDisplayRoute
  '/settings/notifications': typeof AuthenticatedSettingsNotificationsRoute
  '/transport/$id': typeof AuthenticatedTransportIdRoute
  '/clerk/sign-in': typeof ClerkauthSignInRoute
  '/clerk/sign-up': typeof ClerkauthSignUpRoute
  '/clerk/user-management': typeof ClerkAuthenticatedUserManagementRoute
  '/apps': typeof AuthenticatedAppsIndexRoute
  '/chats': typeof AuthenticatedChatsIndexRoute
  '/driving-info': typeof AuthenticatedDrivingInfoIndexRoute
  '/facility': typeof AuthenticatedFacilityIndexRoute
  '/help-center': typeof AuthenticatedHelpCenterIndexRoute
  '/mobility': typeof AuthenticatedMobilityIndexRoute
  '/project': typeof AuthenticatedProjectIndexRoute
  '/settings': typeof AuthenticatedSettingsIndexRoute
  '/tasks': typeof AuthenticatedTasksIndexRoute
  '/transport': typeof AuthenticatedTransportIndexRoute
  '/users': typeof AuthenticatedUsersIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/(auth)': typeof authRouteRouteWithChildren
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/clerk': typeof ClerkRouteRouteWithChildren
  '/_authenticated/settings': typeof AuthenticatedSettingsRouteRouteWithChildren
  '/clerk/(auth)': typeof ClerkauthRouteRouteWithChildren
  '/clerk/_authenticated': typeof ClerkAuthenticatedRouteRouteWithChildren
  '/(auth)/forgot-password': typeof authForgotPasswordRoute
  '/(auth)/otp': typeof authOtpRoute
  '/(auth)/sign-in': typeof authSignInRoute
  '/(auth)/sign-in-2': typeof authSignIn2Route
  '/(auth)/sign-up': typeof authSignUpRoute
  '/(errors)/401': typeof errors401Route
  '/(errors)/403': typeof errors403Route
  '/(errors)/404': typeof errors404Route
  '/(errors)/500': typeof errors500Route
  '/(errors)/503': typeof errors503Route
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_authenticated/settings/account': typeof AuthenticatedSettingsAccountRoute
  '/_authenticated/settings/appearance': typeof AuthenticatedSettingsAppearanceRoute
  '/_authenticated/settings/display': typeof AuthenticatedSettingsDisplayRoute
  '/_authenticated/settings/notifications': typeof AuthenticatedSettingsNotificationsRoute
  '/_authenticated/transport/$id': typeof AuthenticatedTransportIdRoute
  '/clerk/(auth)/sign-in': typeof ClerkauthSignInRoute
  '/clerk/(auth)/sign-up': typeof ClerkauthSignUpRoute
  '/clerk/_authenticated/user-management': typeof ClerkAuthenticatedUserManagementRoute
  '/_authenticated/apps/': typeof AuthenticatedAppsIndexRoute
  '/_authenticated/chats/': typeof AuthenticatedChatsIndexRoute
  '/_authenticated/driving-info/': typeof AuthenticatedDrivingInfoIndexRoute
  '/_authenticated/facility/': typeof AuthenticatedFacilityIndexRoute
  '/_authenticated/help-center/': typeof AuthenticatedHelpCenterIndexRoute
  '/_authenticated/mobility/': typeof AuthenticatedMobilityIndexRoute
  '/_authenticated/project/': typeof AuthenticatedProjectIndexRoute
  '/_authenticated/settings/': typeof AuthenticatedSettingsIndexRoute
  '/_authenticated/tasks/': typeof AuthenticatedTasksIndexRoute
  '/_authenticated/transport/': typeof AuthenticatedTransportIndexRoute
  '/_authenticated/users/': typeof AuthenticatedUsersIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/clerk'
    | '/settings'
    | '/clerk/'
    | '/forgot-password'
    | '/otp'
    | '/sign-in'
    | '/sign-in-2'
    | '/sign-up'
    | '/401'
    | '/403'
    | '/404'
    | '/500'
    | '/503'
    | '/settings/account'
    | '/settings/appearance'
    | '/settings/display'
    | '/settings/notifications'
    | '/transport/$id'
    | '/clerk/sign-in'
    | '/clerk/sign-up'
    | '/clerk/user-management'
    | '/apps'
    | '/chats'
    | '/driving-info'
    | '/facility'
    | '/help-center'
    | '/mobility'
    | '/project'
    | '/settings/'
    | '/tasks'
    | '/transport'
    | '/users'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/clerk'
    | '/forgot-password'
    | '/otp'
    | '/sign-in'
    | '/sign-in-2'
    | '/sign-up'
    | '/401'
    | '/403'
    | '/404'
    | '/500'
    | '/503'
    | '/settings/account'
    | '/settings/appearance'
    | '/settings/display'
    | '/settings/notifications'
    | '/transport/$id'
    | '/clerk/sign-in'
    | '/clerk/sign-up'
    | '/clerk/user-management'
    | '/apps'
    | '/chats'
    | '/driving-info'
    | '/facility'
    | '/help-center'
    | '/mobility'
    | '/project'
    | '/settings'
    | '/tasks'
    | '/transport'
    | '/users'
  id:
    | '__root__'
    | '/(auth)'
    | '/_authenticated'
    | '/clerk'
    | '/_authenticated/settings'
    | '/clerk/(auth)'
    | '/clerk/_authenticated'
    | '/(auth)/forgot-password'
    | '/(auth)/otp'
    | '/(auth)/sign-in'
    | '/(auth)/sign-in-2'
    | '/(auth)/sign-up'
    | '/(errors)/401'
    | '/(errors)/403'
    | '/(errors)/404'
    | '/(errors)/500'
    | '/(errors)/503'
    | '/_authenticated/'
    | '/_authenticated/settings/account'
    | '/_authenticated/settings/appearance'
    | '/_authenticated/settings/display'
    | '/_authenticated/settings/notifications'
    | '/_authenticated/transport/$id'
    | '/clerk/(auth)/sign-in'
    | '/clerk/(auth)/sign-up'
    | '/clerk/_authenticated/user-management'
    | '/_authenticated/apps/'
    | '/_authenticated/chats/'
    | '/_authenticated/driving-info/'
    | '/_authenticated/facility/'
    | '/_authenticated/help-center/'
    | '/_authenticated/mobility/'
    | '/_authenticated/project/'
    | '/_authenticated/settings/'
    | '/_authenticated/tasks/'
    | '/_authenticated/transport/'
    | '/_authenticated/users/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  authRouteRoute: typeof authRouteRouteWithChildren
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  ClerkRouteRoute: typeof ClerkRouteRouteWithChildren
  errors401Route: typeof errors401Route
  errors403Route: typeof errors403Route
  errors404Route: typeof errors404Route
  errors500Route: typeof errors500Route
  errors503Route: typeof errors503Route
}

const rootRouteChildren: RootRouteChildren = {
  authRouteRoute: authRouteRouteWithChildren,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  ClerkRouteRoute: ClerkRouteRouteWithChildren,
  errors401Route: errors401Route,
  errors403Route: errors403Route,
  errors404Route: errors404Route,
  errors500Route: errors500Route,
  errors503Route: errors503Route,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/(auth)",
        "/_authenticated",
        "/clerk",
        "/(errors)/401",
        "/(errors)/403",
        "/(errors)/404",
        "/(errors)/500",
        "/(errors)/503"
      ]
    },
    "/(auth)": {
      "filePath": "(auth)/route.tsx",
      "children": [
        "/(auth)/forgot-password",
        "/(auth)/otp",
        "/(auth)/sign-in",
        "/(auth)/sign-in-2",
        "/(auth)/sign-up"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/settings",
        "/_authenticated/",
        "/_authenticated/transport/$id",
        "/_authenticated/apps/",
        "/_authenticated/chats/",
        "/_authenticated/driving-info/",
        "/_authenticated/facility/",
        "/_authenticated/help-center/",
        "/_authenticated/mobility/",
        "/_authenticated/project/",
        "/_authenticated/tasks/",
        "/_authenticated/transport/",
        "/_authenticated/users/"
      ]
    },
    "/clerk": {
      "filePath": "clerk/route.tsx",
      "children": [
        "/clerk/(auth)",
        "/clerk/_authenticated"
      ]
    },
    "/_authenticated/settings": {
      "filePath": "_authenticated/settings/route.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/settings/account",
        "/_authenticated/settings/appearance",
        "/_authenticated/settings/display",
        "/_authenticated/settings/notifications",
        "/_authenticated/settings/"
      ]
    },
    "/clerk/(auth)": {
      "filePath": "clerk/(auth)/route.tsx",
      "parent": "/clerk",
      "children": [
        "/clerk/(auth)/sign-in",
        "/clerk/(auth)/sign-up"
      ]
    },
    "/clerk/_authenticated": {
      "filePath": "clerk/_authenticated/route.tsx",
      "parent": "/clerk",
      "children": [
        "/clerk/_authenticated/user-management"
      ]
    },
    "/(auth)/forgot-password": {
      "filePath": "(auth)/forgot-password.tsx",
      "parent": "/(auth)"
    },
    "/(auth)/otp": {
      "filePath": "(auth)/otp.tsx",
      "parent": "/(auth)"
    },
    "/(auth)/sign-in": {
      "filePath": "(auth)/sign-in.tsx",
      "parent": "/(auth)"
    },
    "/(auth)/sign-in-2": {
      "filePath": "(auth)/sign-in-2.tsx",
      "parent": "/(auth)"
    },
    "/(auth)/sign-up": {
      "filePath": "(auth)/sign-up.tsx",
      "parent": "/(auth)"
    },
    "/(errors)/401": {
      "filePath": "(errors)/401.tsx"
    },
    "/(errors)/403": {
      "filePath": "(errors)/403.tsx"
    },
    "/(errors)/404": {
      "filePath": "(errors)/404.tsx"
    },
    "/(errors)/500": {
      "filePath": "(errors)/500.tsx"
    },
    "/(errors)/503": {
      "filePath": "(errors)/503.tsx"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/settings/account": {
      "filePath": "_authenticated/settings/account.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/settings/appearance": {
      "filePath": "_authenticated/settings/appearance.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/settings/display": {
      "filePath": "_authenticated/settings/display.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/settings/notifications": {
      "filePath": "_authenticated/settings/notifications.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/transport/$id": {
      "filePath": "_authenticated/transport/$id.tsx",
      "parent": "/_authenticated"
    },
    "/clerk/(auth)/sign-in": {
      "filePath": "clerk/(auth)/sign-in.tsx",
      "parent": "/clerk/(auth)"
    },
    "/clerk/(auth)/sign-up": {
      "filePath": "clerk/(auth)/sign-up.tsx",
      "parent": "/clerk/(auth)"
    },
    "/clerk/_authenticated/user-management": {
      "filePath": "clerk/_authenticated/user-management.tsx",
      "parent": "/clerk/_authenticated"
    },
    "/_authenticated/apps/": {
      "filePath": "_authenticated/apps/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/chats/": {
      "filePath": "_authenticated/chats/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/driving-info/": {
      "filePath": "_authenticated/driving-info/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/facility/": {
      "filePath": "_authenticated/facility/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/help-center/": {
      "filePath": "_authenticated/help-center/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/mobility/": {
      "filePath": "_authenticated/mobility/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/project/": {
      "filePath": "_authenticated/project/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/settings/": {
      "filePath": "_authenticated/settings/index.tsx",
      "parent": "/_authenticated/settings"
    },
    "/_authenticated/tasks/": {
      "filePath": "_authenticated/tasks/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/transport/": {
      "filePath": "_authenticated/transport/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/users/": {
      "filePath": "_authenticated/users/index.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
