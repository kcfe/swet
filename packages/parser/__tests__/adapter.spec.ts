import { v2Parser, v3Parser, yapiParser } from './parser.spec'

describe('test swaggerV2 adapter', () => {
  const standardData = v2Parser.standardDataSource
  it('test defined', () => {
    expect(standardData).toBeDefined()
  })

  it('test standard service', () => {
    const controllers = standardData.controllers
    expect(controllers).toBeDefined()

    const userController = controllers['user-controller']

    const usersUsingGET = userController.find(v => v.name === 'usersUsingGET')
    expect(usersUsingGET?.deprecated).toBe(false)
    expect(usersUsingGET?.contentType).toBe('application/json')
    expect(usersUsingGET?.method).toBe('get')
    expect(usersUsingGET?.path).toBe('/users')
    expect(usersUsingGET?.parameters).toEqual([])
    expect(usersUsingGET?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultListUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const getByUserIdUsingGET = userController.find(v => v.name === 'getByUserIdUsingGET')
    expect(getByUserIdUsingGET?.deprecated).toBe(false)
    expect(getByUserIdUsingGET?.contentType).toBe('application/json')
    expect(getByUserIdUsingGET?.method).toBe('get')
    expect(getByUserIdUsingGET?.path).toBe('/users/getByUserId')
    expect(getByUserIdUsingGET?.parameters).toEqual([
      {
        in: 'query',
        name: 'id',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: true,
        allowEmptyValue: undefined,
        description: 'id',
        enum: [],
        isMap: false,
      },
    ])
    expect(getByUserIdUsingGET?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const respUserMapUsingPOST = userController.find(v => v.name === 'respUserMapUsingPOST')
    expect(respUserMapUsingPOST?.deprecated).toBe(false)
    expect(respUserMapUsingPOST?.contentType).toBe('application/json')
    expect(respUserMapUsingPOST?.method).toBe('post')
    expect(respUserMapUsingPOST?.path).toBe('/users/respUserMap')
    expect(respUserMapUsingPOST?.parameters).toEqual([
      {
        in: 'body',
        name: 'userMap',
        typeName: 'object',
        typeValue: [],
        refName: '',
        required: true,
        allowEmptyValue: undefined,
        description: 'userMap',
        enum: [],
        isMap: false,
      },
    ])
    expect(respUserMapUsingPOST?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultMapstringUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const usereditUsingGET = controllers['undefined'].find(v => v.name === 'usereditUsingGET')
    expect(usereditUsingGET?.deprecated).toBe(false)
    expect(usereditUsingGET?.contentType).toBe('application/json')
    expect(usereditUsingGET?.method).toBe('get')
    expect(usereditUsingGET?.path).toBe('/users/edit')
    expect(usereditUsingGET?.parameters).toEqual([
      {
        in: 'query',
        name: 'id',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: true,
        allowEmptyValue: undefined,
        description: 'id',
        enum: [],
        isMap: false,
      },
      {
        in: 'query',
        name: 'id2',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: true,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
    expect(usereditUsingGET?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const menuAddUsingPOST = controllers['menu-controller'].find(v => v.name === 'menuAddUsingPOST')
    expect(menuAddUsingPOST?.deprecated).toBe(false)
    expect(menuAddUsingPOST?.contentType).toBe('application/json')
    expect(menuAddUsingPOST?.method).toBe('post')
    expect(menuAddUsingPOST?.path).toBe('/rest/menu/add')
    expect(menuAddUsingPOST?.parameters).toEqual([])
    expect(menuAddUsingPOST?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [
          {
            name: 'id',
            typeName: 'number',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '页面节点id',
            enum: [],
            isMap: false,
          },
          {
            name: 'title',
            typeName: 'string',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '页面节点标题',
            enum: [],
            isMap: false,
          },
          {
            name: 'status',
            typeName: 'boolean',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '页面节点状态',
            enum: [],
            isMap: false,
          },
        ],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
  })

  it('test standard interface', () => {
    const interfaces = standardData.interfaces
    expect(interfaces).toBeDefined()

    const ResultListUser = interfaces.find(v => v.name === 'ResultListUser')
    expect(ResultListUser?.properties).toEqual([
      {
        name: 'data',
        typeName: 'array',
        typeValue: [],
        refName: 'User',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'message',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const ResultMapstringUser = interfaces.find(v => v.name === 'ResultMapstringUser')
    expect(ResultMapstringUser?.properties).toEqual([
      {
        name: 'data',
        typeName: 'object',
        typeValue: [],
        refName: 'ResultListUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: true,
      },
      {
        name: 'message',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const ResultMapstringUser2 = interfaces.find(v => v.name === 'ResultMapstringUser2')
    expect(ResultMapstringUser2?.properties).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'User',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: true,
      },
    ])

    const UserMapTest = interfaces.find(v => v.name === 'UserMapTest')
    expect(UserMapTest?.properties).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const UserMapTest2 = interfaces.find(v => v.name === 'UserMapTest2')
    expect(UserMapTest2?.properties).toEqual([
      {
        typeName: 'any',
        typeValue: [],
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const UploadRegisterAccountResp = interfaces.find(v => v.name === 'UploadRegisterAccountResp')
    expect(UploadRegisterAccountResp?.properties).toEqual([
      {
        name: 'resultFileName',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: false,
        description: '执行结果文件',
        enum: [],
        isMap: false,
      },
      {
        name: 'resultNumMap',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: false,
        description: '执行结果数量',
        enum: [],
        isMap: true,
      },
      {
        name: 'pageInfo',
        typeName: 'object',
        typeValue: [],
        refName: 'PageInfo',
        required: undefined,
        allowEmptyValue: false,
        description: '页面信息',
        enum: [],
        isMap: false,
      },
    ])

    const AgentDspInfoVO = interfaces.find(v => v.name === 'AgentDspInfoVO')
    expect(AgentDspInfoVO?.properties).toEqual([
      {
        name: 'adDspAgent',
        typeName: 'object',
        typeValue: [],
        refName: 'AgentInfoView',
        required: undefined,
        allowEmptyValue: false,
        description: '代理商信息',
        enum: [],
        isMap: false,
      },
      {
        name: 'agentV2',
        typeName: 'boolean',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'bailDetails',
        typeName: 'array',
        typeValue: [],
        refName: 'BailDetailVO',
        required: undefined,
        allowEmptyValue: false,
        description: '保证金详情',
        enum: [],
        isMap: false,
      },
      {
        name: 'clientNames',
        typeName: 'array',
        typeValue: [
          {
            typeName: 'string',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '',
            enum: [],
            isMap: false,
          },
        ],
        refName: '',
        required: undefined,
        allowEmptyValue: false,
        description: '客户名称',
        enum: [],
        isMap: false,
      },
      {
        name: 'enablePaymentModeForH5',
        typeName: 'array',
        typeValue: [
          {
            typeName: 'string',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '',
            enum: ['CORPORATE_BANK', 'WECHAT', 'ALIPAY'],
            isMap: false,
          },
        ],
        refName: '',
        required: undefined,
        allowEmptyValue: false,
        description: '代理商在H5端可以充值的方式',
        enum: [],
        isMap: false,
      },
      {
        name: 'platformCharge',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: false,
        description: '代理商不同投放平台花费信息，key-投放平台类型，value-花费(厘)',
        enum: [],
        isMap: true,
      },
      {
        name: 'restrictedAccounts',
        typeName: 'array',
        typeValue: [],
        refName: 'AgentRestrictedAccountsConf',
        required: undefined,
        allowEmptyValue: false,
        description: '充值限制账号',
        enum: [],
        isMap: false,
      },
      {
        name: 'ucType',
        typeName: 'array',
        typeValue: [
          {
            typeName: 'string',
            typeValue: [],
            refName: '',
            required: undefined,
            allowEmptyValue: undefined,
            description: '',
            enum: [
              'DSP',
              'ADX',
              'BRAND',
              'ESP',
              'RRM',
              'MOBILE_CHANNEL_ESP',
              'DSP_MAPI',
              'ALL_ESP',
              'ALL_DSP',
            ],
            isMap: false,
          },
        ],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'whiteList',
        typeName: 'object',
        typeValue: [],
        refName: 'AgentWhiteListVO',
        required: undefined,
        allowEmptyValue: false,
        description: '白名单列表',
        enum: [],
        isMap: false,
      },
      {
        name: 'userId',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'loginTime',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'birthTime',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'avatarUrl',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'avatarImgUrl',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'userEmail',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'region',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'province',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'city',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'county',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'zip',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'sex',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [1],
        isMap: false,
      },
      {
        name: 'userTitle',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
  })
})

describe('test swaggerV3 adapter', () => {
  const standardData = v3Parser.standardDataSource
  it('test defined', () => {
    expect(standardData).toBeDefined()
  })

  it('test standard service', () => {
    const controllers = standardData.controllers
    expect(controllers).toBeDefined()

    const userController = controllers['user-controller']

    const usersUsingGET = userController.find(v => v.name === 'usersUsingGET')
    expect(usersUsingGET?.deprecated).toBe(false)
    expect(usersUsingGET?.contentType).toBe('application/json')
    expect(usersUsingGET?.method).toBe('get')
    expect(usersUsingGET?.path).toBe('/users')
    expect(usersUsingGET?.parameters).toEqual([])
    expect(usersUsingGET?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultListUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const saveUsingPOST = userController.find(v => v.name === 'saveUsingPOST')
    expect(saveUsingPOST?.deprecated).toBe(false)
    expect(saveUsingPOST?.contentType).toBe('application/json')
    expect(saveUsingPOST?.method).toBe('post')
    expect(saveUsingPOST?.path).toBe('/users')
    expect(saveUsingPOST?.parameters).toEqual([
      {
        in: 'body',
        name: 'body',
        typeName: 'object',
        typeValue: [],
        refName: 'User',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
    expect(saveUsingPOST?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const getByUserIdUsingGET = userController.find(v => v.name === 'getByUserIdUsingGET')
    expect(getByUserIdUsingGET?.deprecated).toBe(false)
    expect(getByUserIdUsingGET?.contentType).toBe('application/json')
    expect(getByUserIdUsingGET?.method).toBe('get')
    expect(getByUserIdUsingGET?.path).toBe('/users/getByUserId')
    expect(getByUserIdUsingGET?.parameters).toEqual([
      {
        in: 'query',
        name: 'id',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: true,
        allowEmptyValue: undefined,
        description: 'id',
        enum: [],
        isMap: false,
      },
    ])
    expect(getByUserIdUsingGET?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const respUserMapUsingPOST = userController.find(v => v.name === 'respUserMapUsingPOST')
    expect(respUserMapUsingPOST?.deprecated).toBe(false)
    expect(respUserMapUsingPOST?.contentType).toBe('application/json')
    expect(respUserMapUsingPOST?.method).toBe('post')
    expect(respUserMapUsingPOST?.path).toBe('/users/respUserMap')
    expect(respUserMapUsingPOST?.parameters).toEqual([
      {
        in: 'body',
        name: 'body',
        typeName: 'object',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
    expect(respUserMapUsingPOST?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultMapstringUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const saveUserParamUsingPOST = userController.find(v => v.name === 'saveUserParamUsingPOST')
    expect(saveUserParamUsingPOST?.deprecated).toBe(false)
    expect(saveUserParamUsingPOST?.contentType).toBe('application/json')
    expect(saveUserParamUsingPOST?.method).toBe('post')
    expect(saveUserParamUsingPOST?.path).toBe('/users/saveUserParam')
    expect(saveUserParamUsingPOST?.parameters).toEqual([
      {
        in: 'body',
        name: 'body',
        typeName: 'number',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
    expect(saveUserParamUsingPOST?.response).toEqual([
      {
        typeName: 'object',
        typeValue: [],
        refName: 'ResultUser',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
  })

  it('test standard interface', () => {
    const interfaces = standardData.interfaces
    expect(interfaces).toBeDefined()

    const ResultListUser = interfaces.find(v => v.name === 'ResultListUser')
    expect(ResultListUser?.properties).toEqual([
      {
        name: 'data',
        typeName: 'array',
        typeValue: [],
        refName: 'User',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
      {
        name: 'message',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])

    const ResultMapstringUser = interfaces.find(v => v.name === 'ResultMapstringUser')
    expect(ResultMapstringUser?.properties).toEqual([
      {
        name: 'data',
        typeName: 'object',
        typeValue: [],
        refName: 'User',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: true,
      },
      {
        name: 'message',
        typeName: 'string',
        typeValue: [],
        refName: '',
        required: undefined,
        allowEmptyValue: undefined,
        description: '',
        enum: [],
        isMap: false,
      },
    ])
  })
})

describe('test yapi adapter', () => {
  const standardData = yapiParser.standardDataSource
  it('test defined', () => {
    expect(standardData).toBeDefined()
  })

  it('test standard service', () => {
    const controllers = standardData.controllers
    expect(controllers).toBeDefined()

    const creativeController = controllers['创意接口']

    const restDspControlPanelBrandnewCreativeDetailsPost = creativeController.find(
      v => v.name === 'restDspControlPanelBrandnewCreativeDetailsPost'
    )

    expect(restDspControlPanelBrandnewCreativeDetailsPost?.deprecated).toBe(false)
    expect(restDspControlPanelBrandnewCreativeDetailsPost?.contentType).toBe('application/json')
    expect(restDspControlPanelBrandnewCreativeDetailsPost?.method).toBe('POST')
    expect(restDspControlPanelBrandnewCreativeDetailsPost?.path).toBe(
      '//rest/dsp/control-panel/brandnew/creative/details'
    )
    expect(restDspControlPanelBrandnewCreativeDetailsPost?.parameters).toEqual([
      {
        in: 'body',
        name: 'body',
        typeName: 'object',
        typeValue: [],
        required: undefined,
        allowEmptyValue: undefined,
        description: 'restDspControlPanelBrandnewCreativeDetailsPostbody 请求参数',
        enum: [],
        isMap: false,
      },
    ])
  })

  it('test standard interface', () => {
    const interfaces = standardData.interfaces
    expect(interfaces).toBeDefined()

    const restDspControlPanelTraceutilSdkListPostQueryReq = interfaces.find(
      v => v.name === 'restDspControlPanelTraceutilSdkListPostQueryReq'
    )
    expect(restDspControlPanelTraceutilSdkListPostQueryReq?.properties).toEqual([
      {
        name: 'currentPage',
        description: '当前页码',
        typeName: 'any',
        typeValue: [],
        required: false,
        allowEmptyValue: true,
        enum: [],
        isMap: false,
      },
      {
        name: 'pageSize',
        description: '分页大小',
        typeName: 'any',
        typeValue: [],
        required: false,
        allowEmptyValue: true,
        enum: [],
        isMap: false,
      },
      {
        name: 'totalCount',
        description: '数据总数',
        typeName: 'any',
        typeValue: [],
        required: false,
        allowEmptyValue: true,
        enum: [],
        isMap: false,
      },
    ])
  })
})
