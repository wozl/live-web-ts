import { defineStore } from 'pinia';

//live仓库名
export const liveStore = defineStore('live',{
    persist:true, //开启数据持久化
    state:()=>{
        return {
            token:'', //csrf
            username:'' //当前登陆用户名
        }
    },
    getters:{},
    actions:{
        setToken(val:string){ //设置token值
            this.token = val
        },
        setUA(val:string){ //设置当前登陆用户名
            this.username = val
        }
    }
});

