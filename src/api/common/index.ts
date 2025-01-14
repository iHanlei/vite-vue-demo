import request from '@/axios'
import { EnumType } from './types'

export const getEnumListApi = (params: EnumType) => {
  return request.get({ url: '/enums', params })
}