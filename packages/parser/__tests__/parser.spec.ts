/* eslint-disable @typescript-eslint/no-var-requires */
import { SwetParser } from '../src'
const swaggerV2Json = require('../swagger/v2.json')
const swaggerV3Json = require('../swagger/v3.json')
const yapiJson = require('../swagger/yapi.json')

export const v2Parser = new SwetParser(swaggerV2Json)
export const v3Parser = new SwetParser(swaggerV3Json)
export const yapiParser = new SwetParser(yapiJson)

describe('parser test', () => {
  it('should export parser', () => {
    expect(SwetParser).toBeDefined()
  })

  it('expected instance method', () => {
    expect(typeof v2Parser.getAllModel === 'function').toBeTruthy()
    expect(typeof v2Parser.getAllService === 'function').toBeTruthy()
    expect(typeof v2Parser.getAllMock === 'function').toBeTruthy()
    expect(typeof v3Parser.getAllMock === 'function').toBeTruthy()
    expect(typeof v3Parser.getAllMock === 'function').toBeTruthy()
    expect(typeof v3Parser.getAllMock === 'function').toBeTruthy()
    expect(typeof yapiParser.getAllMock === 'function').toBeTruthy()
    expect(typeof yapiParser.getAllMock === 'function').toBeTruthy()
    expect(typeof yapiParser.getAllMock === 'function').toBeTruthy()
  })
})
