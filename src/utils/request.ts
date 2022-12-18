import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
import { liveStore } from '../store/loginstatus'


//实例化axios
const service:AxiosInstance = axios.create({
    timeout: 5000
});


//请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if(config.url?.includes('/api')){
            if(config.url === '/api/menuInfo'){ //不进行csrf验证的路径
                return config;
            }else{ //其它路径读取pinia中储存的值，动态添加请求头再去请求
                if(config.url === '/api/token'){ //请求csrf路径，放行
                    console.log('到达请求csrf头信息url,白名单url放行获取csrf信息!')
                    return config;
                }else{ //其它请求，动态添加csrf令牌信息到请求头中，不对存储到pinia的token信息进行空判断，没有值服务器会返回419状态，会自动重定向到登录页进行登陆
                    console.log('到达需要验证csrf头信息的Url')
                    let liveSt =liveStore();
                    config.headers = {
                        ...config.headers, //解构请求头，再次添加自定义头，封装
                        'X-CSRF-TOKEN':`${liveSt.token}`,
                        'X-Requested-With':'XMLHttpRequest'
                    }
                    return config;
                }
            }
        }else{
            return config;
        } 
        
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

//响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
        else if(response.status === 419){ //csrf令牌状态失效
            ElMessage.error({
                message:'登陆状态到期，请重新登陆',
                type:'error'
            });
            let liveSt =liveStore();
            //清空当前用户信息
            liveSt.setToken('');
            liveSt.setUA('');
            router.replace('/login'); //重定向到登陆页
            return Promise.reject('login status is timeout!'); //自定义返回信息
        } 
        else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
