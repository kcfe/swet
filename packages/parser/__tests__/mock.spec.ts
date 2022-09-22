import { v2Parser } from './Parser.spec'

describe('test generate mock code', () => {
  it('expected generate func', () => {
    expect(typeof v2Parser.getAllMock === 'function').toBeTruthy()
  })

  const mockList = v2Parser.getAllMock()

  it('expected response is array', () => {
    expect(Array.isArray(mockList)).toBeTruthy()
  })

  it('test usersUsingGET mock', () => {
    const usersUsingGETMock = mockList.find(v => v.name === 'usersUsingGET')
    expect(usersUsingGETMock).toBeDefined()
    const content = usersUsingGETMock?.toCode()
    expect(content).toEqual({
      data: expect.arrayContaining([
        {
          age: '@integer(1, 100)',
          id: '@integer(1, 100000)',
          name: '@string',
        },
      ]),
      message: '@string',
    })
    const prevMock1 = {
      data: [
        {
          age: 18,
          id: 0,
          name: '章三',
        },
        {
          age: 19,
          id: 1,
          name: '里斯',
        },
        {
          age: 20,
          id: 3,
          name: '王武',
        },
      ],
      message: '测试数据1',
    }
    const prevMock2 = {
      data: [
        {
          age: '123',
          id: 1,
          name: '里斯',
        },
        {
          age: 20,
          id: '0',
          name: 4,
        },
      ],
      message: 9876,
    }

    const content1 = usersUsingGETMock?.toCode(prevMock1)
    const content2 = usersUsingGETMock?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      data: [
        {
          age: '@integer(1, 100)',
          id: 1,
          name: '里斯',
        },
        {
          age: 20,
          id: '@integer(1, 100000)',
          name: '@string',
        },
      ],
      message: '@string',
    })
  })

  it('test respUserMapUsingPOST mock', () => {
    const respUserMapUsingPOST = mockList.find(v => v.name === 'respUserMapUsingPOST')
    expect(respUserMapUsingPOST).toBeDefined()
    const content = respUserMapUsingPOST?.toCode()
    expect(content).toEqual({
      data: {
        data: {
          data: expect.arrayContaining([
            {
              age: '@integer(1, 100)',
              id: '@integer(1, 100000)',
              name: '@string',
            },
          ]),
          message: '@string',
        },
      },
      message: '@string',
    })

    const prevMock1 = {
      data: {
        data: {
          data: [
            {
              age: '@integer(1, 100)',
              id: '@integer(1, 100000)',
              name: '@string',
            },
            {
              age: 1,
              id: 2,
              name: '章三',
            },
          ],
          message: 'prevMock1',
        },
      },
      message: '哈哈哈哈哈',
    }
    const prevMock2 = {
      data: {
        data: {
          aaaa: [
            {
              age: '@integer(1, 100)',
              id: '@integer(1, 100000)',
              name: '@string',
            },
            {
              age: 1,
              id: 2,
              name: '章三',
            },
          ],
          message: 'prevMock1',
        },
      },
      message: 12345,
    }

    const content1 = respUserMapUsingPOST?.toCode(prevMock1)
    const content2 = respUserMapUsingPOST?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      data: {
        data: {
          data: expect.arrayContaining([
            {
              age: '@integer(1, 100)',
              id: '@integer(1, 100000)',
              name: '@string',
            },
          ]),
          message: 'prevMock1',
        },
      },
      message: '@string',
    })
  })

  it('test saveUserParamUsingPOST mock', () => {
    const saveUserParamUsingPOST = mockList.find(v => v.name === 'saveUserParamUsingPOST')
    expect(saveUserParamUsingPOST).toBeDefined()
    const content = saveUserParamUsingPOST?.toCode()
    expect(content).toEqual({
      data: {
        age: '@integer(1, 100)',
        id: '@integer(1, 100000)',
        name: '@string',
      },
      message: '@string',
    })

    const prevMock1 = {
      data: {
        age: 123,
        id: 3456,
        name: 'zhangsanlisi',
      },
      message: '我是一份mock测试',
    }
    const prevMock2 = {
      data: {
        age: '123',
        id: 3456,
        name: 'zhangsanlisi',
      },
      message: 1243213123,
      data2: {},
    }

    const content1 = saveUserParamUsingPOST?.toCode(prevMock1)
    const content2 = saveUserParamUsingPOST?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      data: {
        age: '@integer(1, 100)',
        id: 3456,
        name: 'zhangsanlisi',
      },
      message: '@string',
    })
  })

  it('test idCardUsingPOST mock', () => {
    const idCardUsingPOST = mockList.find(v => v.name === 'idCardUsingPOST')
    expect(idCardUsingPOST).toBeDefined()
    const content = idCardUsingPOST?.toCode()
    expect(content).toEqual({
      data: '@string',
      message: '@string',
    })

    const prevMock1 = {
      data: '我是测试话剧',
      message: '请求乘车',
    }
    const prevMock2 = {
      data: 12312321,
      message: '请求乘车qweqw',
    }
    const content1 = idCardUsingPOST?.toCode(prevMock1)
    const content2 = idCardUsingPOST?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      data: '@string',
      message: '请求乘车qweqw',
    })
  })

  it('test uploadRegisterAccountUsingPOST mock', () => {
    const uploadRegisterAccountUsingPOST = mockList.find(
      v => v.name === 'uploadRegisterAccountUsingPOST'
    )
    expect(uploadRegisterAccountUsingPOST).toBeDefined()
    const content = uploadRegisterAccountUsingPOST?.toCode()
    expect(content).toEqual({
      data: {
        resultFileName: '@string',
        resultNumMap: { data: '@integer(1, 100)' },
        pageInfo: {
          currentPage: '@integer(1, 100)',
          pageSize: '@integer(1, 100)',
          totalCount: '@integer(1, 100)',
        },
      },
    })

    const prevMock1 = {
      data: {
        resultFileName: '我是一份文件名称',
        resultNumMap: { data: '@integer(1, 100)' },
        pageInfo: {
          currentPage: 1,
          pageSize: 10,
          totalCount: 100,
        },
      },
    }
    const prevMock2 = {
      data: {
        resultFileName: '我是数字，但是又不是',
        resultNumMap: { data: '我是数字' },
        pageInfo: {
          currentPage: '1213',
          pageSize: 20,
          totalCount: '@integer(1, 100)',
        },
      },
    }
    const content1 = uploadRegisterAccountUsingPOST?.toCode(prevMock1)
    const content2 = uploadRegisterAccountUsingPOST?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      data: {
        resultFileName: '我是数字，但是又不是',
        resultNumMap: { data: '@integer(1, 100)' },
        pageInfo: {
          currentPage: '@integer(1, 100)',
          pageSize: 20,
          totalCount: '@integer(1, 100)',
        },
      },
    })
  })

  it('test listAgentBailDeductionV2UsingPOST_1 mock', () => {
    const listAgentBailDeductionV2UsingPOST_1 = mockList.find(
      v => v.name === 'listAgentBailDeductionV2UsingPOST_1'
    )
    expect(listAgentBailDeductionV2UsingPOST_1).toBeDefined()
    const content = listAgentBailDeductionV2UsingPOST_1?.toCode()
    expect(content).toEqual({})
  })

  it('test agentInfoUsingPOST mock', () => {
    const agentInfoUsingPOST = mockList.find(v => v.name === 'agentInfoUsingPOST')
    expect(agentInfoUsingPOST).toBeDefined()
    const content = agentInfoUsingPOST?.toCode()

    const marginTypeReg =
      /RECHARGE_TYPE_UNKNOWN|CASH|CREDIT_REPAYMENT|AGENT_RISK_SECURITY_DEPOSIT|ADVERTISER_FRAME_SECURITY_DEPOSIT|PLATFORM_BANK_INFO|AGENT_CREDIT/
    const payModReg = /CORPORATE_BANK|WECHAT|ALIPAY/
    const ucTypeReg = /DSP|ADX|BRAND|ESP|RRM|MOBILE_CHANNEL_ESP|DSP_MAPI|ALL_ESP|ALL_DSP/

    expect(content).toEqual({
      adDspAgent: { data: '@string' },
      agentV2: '@boolean',
      bailDetails: expect.arrayContaining([
        {
          marginType: expect.stringMatching(marginTypeReg),
          paidBailAmount: '@integer(1, 100)',
        },
      ]),
      clientNames: expect.arrayContaining(['@string']),
      enablePaymentModeForH5: expect.arrayContaining([expect.stringMatching(payModReg)]),
      platformCharge: { data: '@integer(1, 100)' },
      restrictedAccounts: expect.arrayContaining([
        {
          industry: '@string',
          ucType: expect.stringMatching(ucTypeReg),
        },
      ]),
      ucType: expect.arrayContaining([expect.stringMatching(ucTypeReg)]),
      whiteList: {
        dspCopyAccounts: '@boolean',
        enableTicketType: expect.arrayContaining(['@string']),
        ticketPageVisible: '@boolean',
        ticketTypeForCreate: expect.arrayContaining(['@string']),
      },
      userId: '@integer(1, 100000)',
      loginTime: '@dateTime',
      birthTime: '@dateTime',
      avatarUrl: '@url(https)',
      avatarImgUrl: '@img',
      userEmail: '@email',
      region: '@region',
      province: '@province',
      city: '@city',
      county: '@county',
      zip: '@zip',
      sex: 1,
      userTitle: '@title',
    })

    const prevMock1 = {
      adDspAgent: { data: '@string' },
      agentV2: false,
      bailDetails: [
        {
          marginType: 'RECHARGE_TYPE_UNKNOWN',
          paidBailAmount: 1,
        },
        {
          marginType: 'CASH',
          paidBailAmount: 2,
        },
        {
          marginType: 'CREDIT_REPAYMENT',
          paidBailAmount: 3,
        },
      ],
      clientNames: ['哈哈哈公诉', 'cccc公司', '1231公司'],
      enablePaymentModeForH5: ['CORPORATE_BANK', 'WECHAT'],
      platformCharge: { data: '@integer(1, 100)' },
      restrictedAccounts: [
        {
          industry: '直营电商',
          ucType: 'DSP',
        },
        {
          industry: '快手小店',
          ucType: 'ESP',
        },
      ],
      ucType: ['DSP', 'ADX', 'ESP', 'BRAND'],
      whiteList: {
        dspCopyAccounts: true,
        enableTicketType: ['1231', '213', '34', '45'],
        ticketPageVisible: true,
        ticketTypeForCreate: ['@string', '@string', '@string'],
      },
      userId: 12213,
      loginTime: 123123123123123,
      birthTime: '@dateTime',
      avatarUrl: 'https://swww/baidua.com',
      avatarImgUrl: 'https://swww/baidua.com/img',
      userEmail: 'zhangwenjie@email.com',
      region: '华东',
      province: '北京',
      city: '北京',
      county: '海淀',
      zip: 'zip',
      sex: 1,
      userTitle: '哈丢哈说',
    }
    const prevMock2 = {
      adDspAgent: { data: 12321 },
      agentV2: '1',
      bailDetails: [
        {
          marginType: 'aaaaaa',
          paidBailAmount: 1,
        },
        {
          marginType: 'CASH',
          paidBailAmount: 'qweqwe',
        },
        {
          marginType: 'CREDIT_REPAYMENT',
          paidBailAmount: 3,
        },
      ],
      clientNames: [12312, 'cccc公司', 4444],
      enablePaymentModeForH5: ['CORPORATE_BANK', 1231],
      platformCharge: { data: '@integer(1, 100)' },
      restrictedAccounts: [
        {
          industry: 'haha',
          ucType: 'DSP',
        },
        {
          industry: '快手小店',
          ucType: 12312,
        },
      ],
      ucType: [1, 2, 3, 4],
      whiteList: {
        dspCopyAccounts: true,
        enableTicketType: [1, 2, 3, '45'],
        ticketPageVisible: true,
        ticketTypeForCreate: ['@string', '@string', '@string'],
      },
      sex: 0,
    }

    const content1 = agentInfoUsingPOST?.toCode(prevMock1)
    const content2 = agentInfoUsingPOST?.toCode(prevMock2)
    expect(content1).toEqual(prevMock1)
    expect(content2).toEqual({
      adDspAgent: { data: '@string' },
      agentV2: '@boolean',
      bailDetails: [
        {
          marginType: expect.stringMatching(marginTypeReg),
          paidBailAmount: 1,
        },
        {
          marginType: 'CASH',
          paidBailAmount: '@integer(1, 100)',
        },
        {
          marginType: 'CREDIT_REPAYMENT',
          paidBailAmount: 3,
        },
      ],
      clientNames: ['@string', 'cccc公司', '@string'],
      enablePaymentModeForH5: ['CORPORATE_BANK', expect.stringMatching(payModReg)],
      platformCharge: { data: '@integer(1, 100)' },
      restrictedAccounts: [
        {
          industry: 'haha',
          ucType: 'DSP',
        },
        {
          industry: '快手小店',
          ucType: expect.stringMatching(ucTypeReg),
        },
      ],
      ucType: [
        expect.stringMatching(ucTypeReg),
        expect.stringMatching(ucTypeReg),
        expect.stringMatching(ucTypeReg),
        expect.stringMatching(ucTypeReg),
      ],
      whiteList: {
        dspCopyAccounts: true,
        enableTicketType: ['@string', '@string', '@string', '45'],
        ticketPageVisible: true,
        ticketTypeForCreate: ['@string', '@string', '@string'],
      },
      userId: '@integer(1, 100000)',
      loginTime: '@dateTime',
      birthTime: '@dateTime',
      avatarUrl: '@url(https)',
      avatarImgUrl: '@img',
      userEmail: '@email',
      region: '@region',
      province: '@province',
      city: '@city',
      county: '@county',
      zip: '@zip',
      sex: 1,
      userTitle: '@title',
    })
  })
})
