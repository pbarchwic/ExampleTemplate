const b2cTenantId = '#{b2cTenantId}#';
const scopes = ['Account.Read', 'Device.Read', 'Device.ReadWrite', 'DeviceShare.Read',
  'DeviceShare.ReadWrite', 'Organization.Read', 'Organization.ReadWrite', 'user_impersonation'];
const getScopes = () => scopes.map(scope => `https://${b2cTenantId}/api/${scope}`);

export const environment = {
  buildNumber: '#{buildNumber}#',
  production: true,
  e2e: false,
  app: {
    url: `${window.location.origin}`
  },
  api: {
    url: '#{apiUrl}#'
  },
  appInsights: {
    instrumentationKey: '#{aiInstrumentationKey}#',
    enableAutoRouteTracking: true,
    autoTrackPageVisitTime: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true
  },
  langs: ['en', 'de', 'pl', 'fr', 'dk', 'nl'],
  defaultLang: 'en',
  auth: {
    clientId: '#{b2cClientId}#',
    tenantId: b2cTenantId,
    signInPolicy: '#{b2cSignInPolicy}#',
    passwordResetPolicy: '#{b2cPasswordResetPolicy}#',
    redirectUri: `${window.location.origin}`,
    cacheLocation: 'localStorage',
    validateAuthority: false,
    scopes: [
      'openid', 'profile', 'offline_access',
      ...getScopes()
    ],
    authority: '#{b2cAuthority}#',
    postLogoutRedirectUri: `${window.location.origin}`,
    storeAuthStateInCookie: false
  }
};
