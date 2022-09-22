import { v2Parser } from './Parser.spec'

describe('test generate service code', () => {
  it('expected generate func', () => {
    expect(typeof v2Parser.getAllService === 'function').toBeTruthy()
  })

  const serviceList = v2Parser.getAllService()

  it('expected response is array', () => {
    expect(Array.isArray(serviceList)).toBeTruthy()
  })

  it('test usersUsingGET service', () => {
    const usersUsingGET = serviceList.find(v => v.name === 'usersUsingGET')
    expect(usersUsingGET).toBeDefined()
    expect(usersUsingGET?.models.map(v => v.name)).toEqual(['ResultListUser', 'User'])
    expect(usersUsingGET?.content).toBe(
      '/** user-controller 用户列表 */\n' +
        'export async function usersUsingGET() {\n' +
        '  const result = await axios.request<ResultListUser>({\n' +
        '    url: `/users`,\n' +
        `    method: 'get',\n` +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test saveUsingPOST service', () => {
    const saveUsingPOST = serviceList.find(v => v.name === 'saveUsingPOST')
    expect(saveUsingPOST).toBeDefined()
    expect(saveUsingPOST?.models.map(v => v.name)).toEqual(['User', 'ResultUser'])
    expect(saveUsingPOST?.content).toBe(
      '/** user-controller 保存用户 */\n' +
        'export async function saveUsingPOST(payload?: User) {\n' +
        '  const data = payload;\n\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test getByUserIdUsingGET service', () => {
    const getByUserIdUsingGET = serviceList.find(v => v.name === 'getByUserIdUsingGET')
    expect(getByUserIdUsingGET).toBeDefined()
    expect(getByUserIdUsingGET?.models.map(v => v.name)).toEqual(['ResultUser', 'User'])
    expect(getByUserIdUsingGET?.content).toBe(
      '/** user-controller ?id获取用户 */\n' +
        'export async function getByUserIdUsingGET(payload: { id: number }) {\n' +
        '  const params = payload;\n\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users/getByUserId`,\n' +
        `    method: 'get',\n` +
        '    params,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test respUserMapUsingPOST service', () => {
    const respUserMapUsingPOST = serviceList.find(v => v.name === 'respUserMapUsingPOST')
    expect(respUserMapUsingPOST).toBeDefined()
    expect(respUserMapUsingPOST?.models.map(v => v.name)).toEqual([
      'ResultMapstringUser',
      'ResultListUser',
      'User',
    ])
    expect(respUserMapUsingPOST?.content).toBe(
      '/** user-controller 以Map入参 */\n' +
        'export async function respUserMapUsingPOST(payload?: Record<string, any>) {\n' +
        '  const data = payload;\n\n' +
        '  const result = await axios.request<ResultMapstringUser>({\n' +
        '    url: `/users/respUserMap`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test saveUserParamUsingPOST service', () => {
    const saveUserParamUsingPOST = serviceList.find(v => v.name === 'saveUserParamUsingPOST')
    expect(saveUserParamUsingPOST).toBeDefined()
    expect(saveUserParamUsingPOST?.models.map(v => v.name)).toEqual(['ResultUser', 'User'])
    expect(saveUserParamUsingPOST?.content).toBe(
      '/** user-controller 保存用户 */\n' +
        'export async function saveUserParamUsingPOST(payload: { id: number; name: string; age: number }) {\n' +
        '  const data = payload;\n\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users/saveUserParam`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test saveUserWithOutParamUsingPOST service', () => {
    const saveUserWithOutParamUsingPOST = serviceList.find(
      v => v.name === 'saveUserWithOutParamUsingPOST'
    )
    expect(saveUserWithOutParamUsingPOST).toBeDefined()
    expect(saveUserWithOutParamUsingPOST?.models.map(v => v.name)).toEqual(['User', 'ResultUser'])
    expect(saveUserWithOutParamUsingPOST?.content).toBe(
      '/** user-controller 保存用户 */\n' +
        'export async function saveUserWithOutParamUsingPOST(payload?: User) {\n' +
        '  const data = payload;\n\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users/saveUserWithOutParam`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test idCardUsingPOST service', () => {
    const idCardUsingPOST = serviceList.find(v => v.name === 'idCardUsingPOST')
    expect(idCardUsingPOST).toBeDefined()
    expect(idCardUsingPOST?.models.map(v => v.name)).toEqual(['Resultstring'])
    expect(idCardUsingPOST?.content).toBe(
      '/** user-controller 上传身份证 */\n' +
        'export async function idCardUsingPOST(payload?: Record<string, any>) {\n' +
        '  const data: any = new FormData();\n' +
        `  for (const key in payload || {}) {\n` +
        `    data.append(key, payload[key]);\n` +
        `  }\n\n` +
        '  const result = await axios.request<Resultstring>({\n' +
        '    url: `/users/upload`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'multipart/form-data' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test userByIdUsingGET service', () => {
    const userByIdUsingGET = serviceList.find(v => v.name === 'userByIdUsingGET')
    expect(userByIdUsingGET).toBeDefined()
    expect(userByIdUsingGET?.models.map(v => v.name)).toEqual(['ResultUser', 'User'])
    expect(userByIdUsingGET?.content).toBe(
      '/** user-controller 路径id获取用户 */\n' +
        'export async function userByIdUsingGET(payload: { id: number }) {\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users/${payload.id}`,\n' +
        `    method: 'get',\n` +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test usereditUsingGET service', () => {
    const usereditUsingGET = serviceList.find(v => v.name === 'usereditUsingGET')
    expect(usereditUsingGET).toBeDefined()
    expect(usereditUsingGET?.models.map(v => v.name)).toEqual(['ResultUser', 'User'])
    expect(usereditUsingGET?.content).toBe(
      '/** undefined 编辑用户 */\n' +
        'export async function usereditUsingGET(payload: { id: number; id2: number }) {\n' +
        '  const params = payload;\n\n' +
        '  const result = await axios.request<ResultUser>({\n' +
        '    url: `/users/edit`,\n' +
        `    method: 'get',\n` +
        '    params,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test uploadRegisterAccountUsingPOST service', () => {
    const uploadRegisterAccountUsingPOST = serviceList.find(
      v => v.name === 'uploadRegisterAccountUsingPOST'
    )
    expect(uploadRegisterAccountUsingPOST).toBeDefined()
    expect(uploadRegisterAccountUsingPOST?.models.map(v => v.name)).toEqual([
      'MessageUploadRegisterAccountResp',
      'UploadRegisterAccountResp',
      'PageInfo',
    ])
    expect(uploadRegisterAccountUsingPOST?.content).toBe(
      '/** account-admin-controller 上传批量开通广告主账号文件 */\n' +
        'export async function uploadRegisterAccountUsingPOST(payload: { file: File }) {\n' +
        '  const data: any = new FormData();\n' +
        `  data.append('file', payload.file);\n\n` +
        '  const result = await axios.request<MessageUploadRegisterAccountResp>({\n' +
        '    url: `/rest/admin/accounts/register/upload`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'multipart/form-data' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test listAgentBailDeductionV2UsingPOST_1 service', () => {
    const listAgentBailDeductionV2UsingPOST_1 = serviceList.find(
      v => v.name === 'listAgentBailDeductionV2UsingPOST_1'
    )
    expect(listAgentBailDeductionV2UsingPOST_1).toBeDefined()
    expect(listAgentBailDeductionV2UsingPOST_1?.models.map(v => v.name)).toEqual([
      'AgentBailDecRecordParam',
      'PageInfo',
    ])
    expect(listAgentBailDeductionV2UsingPOST_1?.content).toBe(
      '/** ad-dsp-agent-transfer-controller 保证金处罚记录 */\n' +
        'export async function listAgentBailDeductionV2UsingPOST_1(payload?: AgentBailDecRecordParam) {\n' +
        '  const params = payload;\n\n' +
        '  const result = await axios.request<void>({\n' +
        '    url: `/rest/dsp/agent/control-panel/finance/bail/deduction/list/v2`,\n' +
        `    method: 'post',\n` +
        '    params,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test menuAddUsingPOST service', () => {
    const menuAddUsingPOST = serviceList.find(v => v.name === 'menuAddUsingPOST')
    expect(menuAddUsingPOST).toBeDefined()
    expect(menuAddUsingPOST?.models.map(v => v.name)).toEqual([])
    expect(menuAddUsingPOST?.content).toBe(
      '/** menu-controller 新建页面节点 */\n' +
        'export async function menuAddUsingPOST() {\n' +
        '  const result = await axios.request<{ id?: number; title?: string; status?: boolean }>({\n' +
        '    url: `/rest/menu/add`,\n' +
        `    method: 'post',\n` +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test confirmUsingPOST_1 service', () => {
    const confirmUsingPOST_1 = serviceList.find(v => v.name === 'confirmUsingPOST_1')
    expect(confirmUsingPOST_1).toBeDefined()
    expect(confirmUsingPOST_1?.models.map(v => v.name)).toEqual(['Messageboolean'])
    expect(confirmUsingPOST_1?.content).toBe(
      '/**\n' +
        ' * @deprecated\n' +
        ' * policy-notify-controller 批量确认政策\n' +
        ' */\n' +
        'export async function confirmUsingPOST_1(payload: { ids: Array<number> }) {\n' +
        '  const params = payload;\n\n' +
        '  const result = await axios.request<Messageboolean>({\n' +
        '    url: `/rest/dsp/agent/notify/policy/confirm`,\n' +
        `    method: 'post',\n` +
        '    params,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })

  it('test addMaterialUsingPOST service', () => {
    const addMaterialUsingPOST = serviceList.find(v => v.name === 'addMaterialUsingPOST')
    expect(addMaterialUsingPOST).toBeDefined()
    expect(addMaterialUsingPOST?.models.map(v => v.name)).toEqual([
      'AddMaterialRequest',
      'MessageAddMaterialResp',
    ])
    expect(addMaterialUsingPOST?.content).toBe(
      '/** material-controller 批量添加素材接口 */\n' +
        'export async function addMaterialUsingPOST(payload: { requests: Array<AddMaterialRequest> }) {\n' +
        '  const data = payload;\n\n' +
        '  const result = await axios.request<MessageAddMaterialResp>({\n' +
        '    url: `/rest/agent/material/addMaterial`,\n' +
        `    method: 'post',\n` +
        '    data,\n' +
        `    headers: { 'Content-Type': 'application/json' },\n` +
        '  });\n\n' +
        '  return result;\n' +
        '}\n'
    )
  })
})
