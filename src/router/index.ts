import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import { ElMessage } from "element-plus";
import { liveStore } from '../store/loginstatus'


const routes:RouteRecordRaw[] = [
    {
        path:'', //默认重定向到首页
        redirect:'/index'
    },
    {
        path:'/index', //首页
        component:() =>import('../views/index.vue')
    },
    {
        path:'/login', //登陆
        component:()=>import('../views/login.vue')
    },
    {
        path:'/home', //后台首页
        name:'home',
        component:()=>import('../views/admin/index.vue'),
        redirect:'ad_index',
        children:[
            {
                path:'/ad_index',
                name:'ad_index',
                meta:{
                    title:'首页',
                },
                component:()=>import('../views/admin/home/home.vue'),
            }
        ]
    },
    {
        path:'/404', //404页面
        name:'404',
        component:()=>import('../views/404.vue')
    },
    {
        path:'/:pathMatch(.*)', //无匹配路径跳转到404页面
        redirect:'/404'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


//前置路由守卫，验证用户是否登陆，未登陆的用户强制跳转到登陆页
router.beforeEach((to, from, next) => {
    if(to.path === '/login' || to.path === '/index'){ //首页或者是登陆页的不进行验证
        next(); //放行
    }else{
        let liveSt =liveStore();
        if(liveSt.username!=''){ //这里仅对本地存储变量是否存在进行验证，实际项目中会验证session是否失效，后面会将该变量修改成使用pinia进行存储
            next();
        }else{
            ElMessage.error({
                message:"未登陆，请登陆后再访问!",
                type:'error'
            });
            next({path:'/login'}); //重定向到登陆页面
        }
    }
})



export default router;