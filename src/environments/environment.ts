// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hideConsoleLog: false,
  agGridLicense: `CompanyName=EagnaGmbH,LicensedApplication=eagna.io,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-029564,SupportServicesEnd=22_June_2023_[v2]_MTY4NzM4ODQwMDAwMA==ae01b03d12c9a1ea59049d3d7254cca5`,
  salt: `eagNaSalt`,
  server: `local`,
  apiUrl: "https://test.eagna.io",
  apiWs: "wss://test.eagna.io",
  //apiUrl: "http://localhost:8000",
  //apiWs: "wss://localhost:8000",
  locale: "de",
  debug: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
