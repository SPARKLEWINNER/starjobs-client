const config = {
  apiUrl: 'https://sj-staging-environment.herokuapp.com/api/internal/v1',
  socketUrl: 'http://localhost:7003',
  clientUrl: 'https://www.staging.starjobs.com.ph/',
  discord: {
    url: 'https://discord.com/api/webhooks',
    key: '918068490764685322/qhSP-606Ds8LM7wfS83K0CFcytfQEygpN7VH-y8MEGmNxOAecKiwf9KClO4hBVYXm6-V'
  },
  aws: {
    s3UploadUrl: 'https://staging-starjobs.s3.ap-southeast-1.amazonaws.com/'
  },
  browser: {
    vapid_key: 'BFkB0YHBjBI9naNyACzu4iwBoONMP9b8TOoIAgFvhSULLuOVr18kPSjPeaP25aAZHuVBj8ly2QpXN3g6KBx61NY'
  },
  pusher: {
    cluster: 'ap1',
    key: '2eefc9556ed5b2076507',
    instanceId: 'ddc5c6f7-3d99-4855-a8a9-2b89c4debf0f'
  },
  userSnap: {
    apiKey: '5db6ed72-2881-4310-ac50-712e39193b7e',
    globalKey: '5db6ed72-2881-4310-ac50-712e39193b7e'
  },
  fallback: {
    querystring: require.resolve('querystring-es3')
  }
}

export default config
