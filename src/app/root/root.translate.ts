import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ModuleWithProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as Factories from './factories';

export const RootTranslate: ModuleWithProviders<TranslateModule> = TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: Factories.HttpLoaderFactory,
    deps: [HttpClient],
  },
  defaultLanguage: 'en',
});
