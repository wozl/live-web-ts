<template>
    <div>
        <el-container>
            <el-menu
                default-active="12"
                class="el-menu-vertical-demo"
                style="height: 100vh;width: 230px;float: left;overflow-y: auto;"
            >
                <!-- 菜单列表 -->
                <el-menu-item
                    v-for="item in state.menuInfo.data"
                    :index="item.id + ''"
                    :key="item.id + ''"
                    @click="change_channel(item.remarks)"
                >
                    <i class="{{ item.icon }}"></i>
                    <template #title>
                            {{ item.name }}
                    </template>
                </el-menu-item>
            </el-menu>
            <!-- 主体内容区（视频播放）-->
            <Video :val="state.val"/>
        </el-container>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive } from 'vue'
import { menuInfoRep } from '../type/index'
import { ElMessage } from 'element-plus';
import { getMenu } from '../api/index';
import Video from './play.vue'

const state = reactive<{
    menuInfo:menuInfoRep,
    val:string //传递给子组件的播放地址
}>({
    menuInfo:{
        code:0, //响应代码
        msg:'', //响应消息
        data:[{
            id:0, //id
            name:'', //菜单名称
            icon:'', //菜单图标
            remarks:'' //请求直播标识
        }]
    },
    val:'' //子组件播放地址
});

//获取首页频道菜单
const getMenus = getMenu().then(res=>{
    
    if(res.code == 200 ){
        ElMessage.success({
            message:'频道信息加载成功!',
            type:'success'
        });
        //赋值给菜单列表
        state.menuInfo = res;
    }else{
        ElMessage.error({
            message:'频道信息加载失败!',
            type:'error'
        });
    }
}).catch(()=>{
    ElMessage.error({
        message:'网络繁忙，加载频道列表失败，请稍后再试!',
        type:'error'
    });
});   

//切换频道
const change_channel = (address:string) =>{
    //接收切换频道参数
    state.val =address
};


//组件挂载时，立即请求频道列表
onMounted(()=>{
    getMenus;
});

</script>
<style lang='less' scoped>
</style>