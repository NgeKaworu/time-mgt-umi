import { restful } from "@/js-sdk/utils/http";
import { curry } from 'ramda'

export const add = curry(restful.post)('time-mgt/v1/record/create')

export const remove = (payload: string) => curry(restful.delete)(`time-mgt/record/${payload}`)

export const update = curry(restful.put)('time-mgt/v1/record/update');