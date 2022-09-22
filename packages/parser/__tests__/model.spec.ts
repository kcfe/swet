import { v2Parser } from './Parser.spec'

describe('test generate model code', () => {
  it('expected generate func', () => {
    expect(typeof v2Parser.getAllModel === 'function').toBeTruthy()
  })

  const modelList = v2Parser.getAllModel()

  it('expected response is array', () => {
    expect(Array.isArray(modelList)).toBeTruthy()
  })

  it('test Result«List«User»» model', () => {
    const ResultListUser = modelList.find(v => v.name === 'ResultListUser')
    expect(ResultListUser).toBeDefined()
    expect(ResultListUser?.dependence).toEqual(['User'])
    expect(ResultListUser?.content).toBe(
      'export interface ResultListUser {\n' +
        '  data?: Array<User>;\n' +
        '  message?: string;\n' +
        '}\n'
    )
    expect(ResultListUser?.description).toBe('')
    expect(ResultListUser?.children).toEqual([
      {
        name: 'data',
        required: undefined,
        description: '',
        value: 'Array<User>',
      },
      {
        name: 'message',
        required: undefined,
        description: '',
        value: 'string',
      },
    ])
  })

  it('test Result«Map«string,User»» model', () => {
    const ResultMapstringUser = modelList.find(v => v.name === 'ResultMapstringUser')
    expect(ResultMapstringUser).toBeDefined()
    expect(ResultMapstringUser?.dependence).toEqual(['ResultListUser', 'User'])
    expect(ResultMapstringUser?.content).toBe(
      `/** 测试秒速信息 */\n` +
        'export interface ResultMapstringUser {\n' +
        '  data?: Record<string, ResultListUser>;\n' +
        '  message?: string;\n' +
        '}\n'
    )
    expect(ResultMapstringUser?.description).toBe('测试秒速信息')
    expect(ResultMapstringUser?.children).toEqual([
      {
        name: 'data',
        required: undefined,
        description: '',
        value: 'Record<string, ResultListUser>',
      },
      {
        name: 'message',
        required: undefined,
        description: '',
        value: 'string',
      },
    ])
  })

  it('test Result«Map«string,User2»» model', () => {
    const ResultMapstringUser2 = modelList.find(v => v.name === 'ResultMapstringUser2')
    expect(ResultMapstringUser2).toBeDefined()
    expect(ResultMapstringUser2?.dependence).toEqual(['User'])
    expect(ResultMapstringUser2?.content).toBe(
      'export type ResultMapstringUser2 = Record<string, User>;\n'
    )
    expect(ResultMapstringUser2?.description).toBe('')
    expect(ResultMapstringUser2?.children).toEqual([
      {
        required: undefined,
        description: '',
        value: 'Record<string, User>',
      },
    ])
  })

  it('test Result«User» model', () => {
    const ResultUser = modelList.find(v => v.name === 'ResultUser')
    expect(ResultUser).toBeDefined()
    expect(ResultUser?.dependence).toEqual(['User'])
    expect(ResultUser?.content).toBe(
      'export interface ResultUser {\n' + '  data: User;\n' + '  message: string;\n' + '}\n'
    )
    expect(ResultUser?.description).toBe('')
    expect(ResultUser?.children).toEqual([
      {
        name: 'data',
        required: true,
        description: '',
        value: 'User',
      },
      {
        name: 'message',
        required: true,
        description: '',
        value: 'string',
      },
    ])
  })

  it('test Result«string» model', () => {
    const Resultstring = modelList.find(v => v.name === 'Resultstring')
    expect(Resultstring).toBeDefined()
    expect(Resultstring?.dependence).toEqual([])
    expect(Resultstring?.content).toBe(
      'export interface Resultstring {\n' + '  data?: string;\n' + '  message?: string;\n' + '}\n'
    )
    expect(Resultstring?.description).toBe('')
    expect(Resultstring?.children).toEqual([
      {
        name: 'data',
        required: undefined,
        description: '',
        value: 'string',
      },
      {
        name: 'message',
        required: undefined,
        description: '',
        value: 'string',
      },
    ])
  })

  it('test User model', () => {
    const User = modelList.find(v => v.name === 'User')
    expect(User).toBeDefined()
    expect(User?.dependence).toEqual([])
    expect(User?.content).toBe(
      '/** 用户信息 */\n' +
        'export interface User {\n' +
        '  /** 用户年龄 */\n' +
        '  age?: number;\n' +
        '  /** 用户ID */\n' +
        '  id?: number;\n' +
        '  /** 用户名称 */\n' +
        '  name?: string;\n' +
        '}\n'
    )
    expect(User?.description).toBe('用户信息')
    expect(User?.children).toEqual([
      {
        name: 'age',
        required: undefined,
        description: '用户年龄',
        value: 'number',
      },
      {
        name: 'id',
        required: undefined,
        description: '用户ID',
        value: 'number',
      },
      {
        name: 'name',
        required: undefined,
        description: '用户名称',
        value: 'string',
      },
    ])
  })

  it('test UserMapTest model', () => {
    const UserMapTest = modelList.find(v => v.name === 'UserMapTest')
    expect(UserMapTest).toBeDefined()
    expect(UserMapTest?.dependence).toEqual([])
    expect(UserMapTest?.content).toBe('export type UserMapTest = Record<string, any>;\n')
    expect(UserMapTest?.description).toBe('')
    expect(UserMapTest?.children).toEqual([
      {
        name: undefined,
        required: undefined,
        description: '',
        value: 'Record<string, any>',
      },
    ])
  })

  it('test UserMapTest2 model', () => {
    const UserMapTest2 = modelList.find(v => v.name === 'UserMapTest2')
    expect(UserMapTest2).toBeDefined()
    expect(UserMapTest2?.dependence).toEqual([])
    expect(UserMapTest2?.content).toBe('export type UserMapTest2 = any;\n')
    expect(UserMapTest2?.description).toBe('')
    expect(UserMapTest2?.children).toEqual([
      {
        name: undefined,
        required: undefined,
        description: '',
        value: 'any',
      },
    ])
  })

  it('test Message«UploadRegisterAccountResp» model', () => {
    const MessageUploadRegisterAccountResp = modelList.find(
      v => v.name === 'MessageUploadRegisterAccountResp'
    )
    expect(MessageUploadRegisterAccountResp).toBeDefined()
    expect(MessageUploadRegisterAccountResp?.dependence).toEqual([
      'UploadRegisterAccountResp',
      'PageInfo',
    ])
    expect(MessageUploadRegisterAccountResp?.content).toBe(
      'export interface MessageUploadRegisterAccountResp {\n' +
        '  data?: UploadRegisterAccountResp;\n' +
        '}\n'
    )
    expect(MessageUploadRegisterAccountResp?.description).toBe('')
    expect(MessageUploadRegisterAccountResp?.children).toEqual([
      {
        name: 'data',
        required: undefined,
        description: '',
        value: 'UploadRegisterAccountResp',
      },
    ])
  })

  it('test UploadRegisterAccountResp model', () => {
    const UploadRegisterAccountResp = modelList.find(v => v.name === 'UploadRegisterAccountResp')
    expect(UploadRegisterAccountResp).toBeDefined()
    expect(UploadRegisterAccountResp?.dependence).toEqual(['PageInfo'])
    expect(UploadRegisterAccountResp?.content).toBe(
      'export interface UploadRegisterAccountResp {\n' +
        '  /** 执行结果文件 */\n' +
        '  resultFileName?: string;\n' +
        '  /** 执行结果数量 */\n' +
        '  resultNumMap?: Record<string, number>;\n' +
        '  /** 页面信息 */\n' +
        '  pageInfo?: PageInfo;\n' +
        '}\n'
    )
    expect(UploadRegisterAccountResp?.description).toBe('')
    expect(UploadRegisterAccountResp?.children).toEqual([
      {
        name: 'resultFileName',
        required: undefined,
        description: '执行结果文件',
        value: 'string',
      },
      {
        name: 'resultNumMap',
        required: undefined,
        description: '执行结果数量',
        value: 'Record<string, number>',
      },
      {
        name: 'pageInfo',
        required: undefined,
        description: '页面信息',
        value: 'PageInfo',
      },
    ])
  })

  it('test AgentBailDecRecordParam model', () => {
    const AgentBailDecRecordParam = modelList.find(v => v.name === 'AgentBailDecRecordParam')
    expect(AgentBailDecRecordParam).toBeDefined()
    expect(AgentBailDecRecordParam?.dependence).toEqual(['PageInfo'])
    expect(AgentBailDecRecordParam?.content).toBe(
      '/** 保证金处罚记录 */\n' +
        'export interface AgentBailDecRecordParam {\n' +
        '  /** 保证金类型 */\n' +
        '  bailType:\n' +
        `    | 'RECHARGE_TYPE_UNKNOWN'
    | 'CASH'
    | 'CREDIT_REPAYMENT'
    | 'AGENT_RISK_SECURITY_DEPOSIT'
    | 'ADVERTISER_FRAME_SECURITY_DEPOSIT'
    | 'PLATFORM_BANK_INFO'
    | 'AGENT_CREDIT'
    | 'AGENT_BIZ_COOP_MARGIN'
    | 'AGENT_BRAND_FRAME_MARGIN'
    | 'AGENT_MARGIN'
    | 'AGENT_COM_FRAME'
    | 'INNER_TRANSFER'
    | 'VIRTUAL_REPAYMENT'
    | 'CONTRACT_BRAND_FRAME_MARGIN'
    | 'CONTRACT_FRAME_MARGIN'
    | 'SYNC_CASH'
    | 'UNRECOGNIZED';\n` +
        '  /** 结束时间 */\n' +
        '  endTime: number;\n' +
        '  /** 发票状态 */\n' +
        '  invoiceStatus?: number;\n' +
        '  /** 页面信息 */\n' +
        '  pageInfo?: PageInfo;\n' +
        '  /** 开始时间 */\n' +
        '  startTime: number;\n' +
        '}\n'
    )
    expect(AgentBailDecRecordParam?.description).toBe('保证金处罚记录')
    expect(AgentBailDecRecordParam?.children).toEqual([
      {
        name: 'bailType',
        required: true,
        description: '保证金类型',
        value:
          "'RECHARGE_TYPE_UNKNOWN' | 'CASH' | 'CREDIT_REPAYMENT' | 'AGENT_RISK_SECURITY_DEPOSIT' | 'ADVERTISER_FRAME_SECURITY_DEPOSIT' | 'PLATFORM_BANK_INFO' | 'AGENT_CREDIT' | 'AGENT_BIZ_COOP_MARGIN' | 'AGENT_BRAND_FRAME_MARGIN' | 'AGENT_MARGIN' | 'AGENT_COM_FRAME' | 'INNER_TRANSFER' | 'VIRTUAL_REPAYMENT' | 'CONTRACT_BRAND_FRAME_MARGIN' | 'CONTRACT_FRAME_MARGIN' | 'SYNC_CASH' | 'UNRECOGNIZED'",
      },
      {
        name: 'endTime',
        required: true,
        description: '结束时间',
        value: 'number',
      },
      {
        name: 'invoiceStatus',
        required: false,
        description: '发票状态',
        value: 'number',
      },
      {
        name: 'pageInfo',
        required: false,
        description: '页面信息',
        value: 'PageInfo',
      },
      {
        name: 'startTime',
        required: true,
        description: '开始时间',
        value: 'number',
      },
    ])
  })

  it('test PageInfo model', () => {
    const PageInfo = modelList.find(v => v.name === 'PageInfo')
    expect(PageInfo).toBeDefined()
    expect(PageInfo?.dependence).toEqual([])
    expect(PageInfo?.content).toBe(
      'export interface PageInfo {\n' +
        '  currentPage?: number;\n' +
        '  pageSize?: number;\n' +
        '  totalCount?: number;\n' +
        '}\n'
    )
    expect(PageInfo?.description).toBe('')
    expect(PageInfo?.children).toEqual([
      {
        name: 'currentPage',
        required: undefined,
        description: '',
        value: 'number',
      },
      {
        name: 'pageSize',
        required: undefined,
        description: '',
        value: 'number',
      },
      {
        name: 'totalCount',
        required: undefined,
        description: '',
        value: 'number',
      },
    ])
  })

  it('test TestMapWithArrayString model', () => {
    const TestMapWithArrayString = modelList.find(v => v.name === 'TestMapWithArrayString')
    expect(TestMapWithArrayString?.content).toBe(
      'export type TestMapWithArrayString = Record<string, Array<string>>;\n'
    )
  })

  it('test TestMapWithArrayRef model', () => {
    const TestMapWithArrayRef = modelList.find(v => v.name === 'TestMapWithArrayRef')
    expect(TestMapWithArrayRef?.content).toBe(
      'export type TestMapWithArrayRef = Record<string, Array<AgentDspInfoVO>>;\n'
    )
  })

  it('test TestMapWithoutItems model', () => {
    const TestMapWithoutItems = modelList.find(v => v.name === 'TestMapWithoutItems')
    expect(TestMapWithoutItems?.content).toBe(
      'export type TestMapWithoutItems = Record<string, Array<any>>;\n'
    )
  })
})
