import {
  GoogleLoginProvider,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

export const SocialAuthServiceConfigMock = {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('asdf'),
      },
    ],
    onError: (err) => {
      console.error(err);
    },
  } as SocialAuthServiceConfig,
};
