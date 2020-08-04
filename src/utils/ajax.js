/**
 * @file ajax 封装
 */

import Vue from 'vue'
import axios from 'axios'
import { bus } from './bus'

const instance = axios.create({
    validateStatus: status => {
        if (status > 400) {
            console.warn(`HTTP 请求出错 status: ${status}`)
        }
        return status >= 200 && status <= 505
    },
    withCredentials: true
})

/**
 * request interceptor
 */
instance.interceptors.request.use(config => {
    // 绝对路径不走 mock
    if (!/^(https|http)?:\/\//.test(config.url)) {
        const prefix = config.url.indexOf('?') === -1 ? '?' : '&'
        config.url += prefix + 'isAjax=1'
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    if (!response.data || typeof response.data === 'string') {
        const msg = '后端接口数据返回为空'
        console.warn('接口异常，', 'HTTP状态码：', response.status)
        if (!response.data) {
            console.error(msg)
        }
        response.data = {
            code: response.status,
            msg: msg
        }
    } else if (response.status === 401) {
        bus.$emit('show-login-modal')
    } else if (response.status > 300) {
        console.error('HTTP请求出错，状态码为：', response.status)
        console.warn('请求信息：', response)
        const msg = response.statusText
        response.data = {
            code: response.status,
            msg: msg
        }
    }
    if (response.data.message) {
        if (Object.prototype.toString.call(response.data.message) === '[object Object]') {
            const msg = []
            for (const key in response.data.message) {
                msg.push(response.data.message[key].join(';'))
            }
            response.data.msg = msg.join(';')
        } else if (Object.prototype.toString.call(response.data.message) === '[object Array]') {
            response.data.msg = response.data.message.join(';')
        } else {
            response.data.msg = response.data.message
        }
    } else {
        response.data.msg = ''
    }
    if (response.data.code !== 0 && response.data.code !== '0000' && response.data.code !== '00') {
        return Promise.reject(response)
    }
    return response
}, error => {
    return Promise.reject(error)
})

Vue.prototype.$http = instance

export default instance
