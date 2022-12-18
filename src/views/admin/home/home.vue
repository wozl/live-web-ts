<template>
    <div>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 条件检索组件 -->
            <el-row>
                <el-col >
                    <span style="font-size:small">开始时间：</span>
                    <el-date-picker
                        v-model="state.queryInfo.startTime"
                        type="datetime"
                        :editable="false"
                        placeholder="请选择日期时间"
                        size="default"
                    >
                    </el-date-picker>
                    <span style="padding-left:1.5em; font-size: small;" >结束时间：</span>
                    <el-date-picker 
                        v-model="state.queryInfo.endTime" 
                        placeholder="请选择日期时间"
                        type="datetime"
                        :editable="false"
                        size="default"
                    >
                    </el-date-picker>
                    <!-- 搜索框 -->
                    <el-input v-model="state.queryInfo.query" :prefix-icon="Search" size="default" placeholder="请输入搜索内容" maxlength="10" show-word-limit style="width:18%;padding-left:0.5em;" clearable @clear="int_clean()"></el-input>
                    <!-- 搜索按钮 -->
                    <el-button
                        :icon="Search"
                        size="default"
                        style="margin-bottom: 5px;"
                        @click="search()"
                    ></el-button>
                    <!-- 添加频道按钮 -->
                    <el-button type="primary" size="default" style="margin-bottom: 5px;" @click="add_url()">添加频道</el-button>
                    <!-- 下载配置文件按钮 -->
                    <el-tooltip content="点击下载配置文件" placement="top" class="item" effect="dark">
                        <el-button type="success" :icon="Download" size="default" style="margin-bottom: 5px;" @click="download_conf()"></el-button>
                    </el-tooltip>
                </el-col>
            </el-row>
            <!-- 频道信息列表 -->
            <el-table 
                :data="state.liveInfos.data"
                v-loading="state.isLoding"
                element-loading-text="拼命加载中..."
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="频道" prop="name"></el-table-column>
                <el-table-column label="播放地址" prop="url"></el-table-column>
                <el-table-column label="台标" prop="icon"></el-table-column>
                <el-table-column label="备注" prop="remarks"></el-table-column>
                <el-table-column label="创建时间" prop="created_at">
                    <template #default="scope">
                        {{ dateFormat(scope.row.created_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" prop="updated_at">
                    <template #default="scope">
                        {{ dateFormat(scope.row.updated_at) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template #default="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" :icon="Edit" size="small" @click="edit_admin(scope.row)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-popconfirm
                            confirmButtonText='好的'
                            cancelButtonText='不用了'
                            @confirm="confirm(scope.row)"
                            @cancel="cancel_del()"
                            :icon="Warning"
                            iconColor="red"
                            title="这一段内容确认删除吗?"
                        >
                            <template #reference>
                                <el-button type="danger" :icon="Delete" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 
                分页组件: 
                以上事件不推荐使用（但由于兼容的原因仍然支持，在以后的版本中将会被删除）；如果要监听 current-page 和 page-size 的改变，使用 v-model 双向绑定是个更好的选择。
                这里使用了新版本的方法进行绑定分页组件参数
                v-model:current-page  v-model:page-size
                
            -->
            <el-pagination
                v-model:current-page="state.queryInfo.pageNum"
                v-model:page-size="state.queryInfo.pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="state.liveInfos.total"
                :page-sizes="[5, 10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </el-pagination>
        </el-card>
        <!-- 调用公用编辑/新增子组件模板 -->
        <EditAdmin :edit_dialogFormVisible="state.edit_dialogFormVisible" @close="close_dialog" :edit_form="state.edit_content"/>
    </div>
</template>

<script lang='ts' setup>
import { reactive, onMounted,watch } from 'vue'
import { live_queryInfo, liveInfo,editObj } from '../../../type/admin/home'
import { getliveInfo, del_live  } from '../../../api/index'
import { ElMessage } from "element-plus";
import moment from 'moment'
import { Edit, Delete, Warning,Search, Download} from "@element-plus/icons-vue";
import EditAdmin from '../home/components/edit.vue'
import axios from 'axios';


const state = reactive<{
    queryInfo:live_queryInfo, //条件检索组件&分页组件对象
    liveInfos:liveInfo, //获取播放列表信息对象
    isLoding:boolean, //表格数据加载动画
    edit_dialogFormVisible:boolean, //编辑新增表单显示/隐藏
    edit_content:editObj,  //新增/编辑表单数据对象

}>({
    queryInfo:{
        pageNum:1, //初始页
        pageSize:10, //初始条数
        query:'', //查询条件
        startTime:0, //开始时间
        endTime:0 //结束时间
    },
    liveInfos:{
        meta:{ //播放列表后端返回状态说明
            code:0, //状态码
            msg:'' //说明
        },
        total:0, //数据总条数
        pageNum:1, //当前页码
        pageSize:10, //每页显示条数
        data:[{ //播放列表
            id:0,//id
            name:'', //频道名称
            remarks:'', //直播名称
            url:'', //原始地址
            icon:'', //台标
            created_at:0, //创建时间
            updated_at:0 //更新时间
        }]
    },
    isLoding:true, //表格数据加载动画 显示/隐藏
    edit_dialogFormVisible:false, //编辑新增表单显示/隐藏
    edit_content:{ //新增/编辑表单数据对象
        id:0,//id
        name:'', //频道名称
        remarks:'', //直播名称
        url:'', //原始地址
        icon:'', //台标
    },

});

//默认请求播放列表
const getLiveInfos = (()=>{
    getliveInfo({"pageNum":state.queryInfo.pageNum,"pageSize":state.queryInfo.pageSize})
    .then(rep=>{
        state.liveInfos = rep;
        if(state.liveInfos.meta.code == 200){
            ElMessage.success({
                message:'直播列表加载成功!',
                type:'success'
            });
            //关闭加载动画
            state.isLoding =false;
        }else{
            ElMessage.error({
                message:state.liveInfos.meta.msg,
                type:'error'
            });
        }
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙,加载直播列表时超时!',
            type:'error'
        });
    });
});

//每页显示条数发送改变时    
const handleSizeChange=(val:number)=>{
    state.queryInfo.pageSize = val;
    //刷新列表
    getLiveInfos()
};    

//页码发生改变时
const handleCurrentChange = (val:number) =>{
    state.queryInfo.pageNum = val;
    //刷新列表
    getLiveInfos()
};

//格式化时间戳    
const dateFormat = (val:number)=>{
    if(val == undefined || val == 0){
        return ''
    }else{
        return moment(parseInt(val*1000 + '')).format("YYYY-MM-DD HH:mm:ss")
    }
};

//新增/编辑表单
const edit_admin = (obj:editObj)=>{
    state.edit_dialogFormVisible = true; //显示对话框
    state.edit_content = obj;
};

//关闭调用子组件自定义事件方法，关闭对话框
const close_dialog = (val?:string)=>{
    if(val === 'reload'){
        //刷新列表
        getLiveInfos()
    }
    state.edit_dialogFormVisible =false;
};

//取消删除
const cancel_del = ()=>{
    ElMessage.info({
        message:'删除已取消!',
        type:'info'
    });
};

//提交删除
const confirm = (obj:editObj)=>{
    del_live(obj.id as number).then(rep=>{
        if(rep.meta.code ==200){
            ElMessage.success({
                message:rep.meta.msg,
                type:'success'
            });
            //初始化页码
            state.queryInfo.pageNum =1;
            //刷新列表
            getLiveInfos();
        }else{
            ElMessage.error({
                message:rep.meta.msg,
                type:'error'
            });
        }
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙，删除失败!',
            type:'error'
        });
    });
}

const int_clean = ()=>{
    //初始化搜索框内容
    state.queryInfo.query ='';
    //初始化页码
    state.queryInfo.pageNum =1;
    //刷新列表
    getLiveInfos();
};

watch(()=>state.queryInfo.startTime,()=>{
    console.log(`开始时间发生变化，info:${state.queryInfo.startTime}`);
    console.log('开始时间转换为时间戳，info:'+ format_timestramp(state.queryInfo.startTime))
});

//格式化时间戳(秒)
const format_timestramp = (val?:string | number)=>{
    if(val == undefined || val == 0){
        return ''
    }else{
        return moment(val).valueOf()/1000
    }
};

//显示添加频道信息弹框
const add_url = ()=>{
    state.edit_dialogFormVisible =true;
    state.edit_content = {
        id:0,//id
        name:'', //频道名称
        remarks:'', //直播名称
        url:'', //原始地址
        icon:'', //台标
    }
};

//动态条件搜索
const search = ()=>{
    const arr =reactive<[{
        pageNum:number, //初始页
        pageSize:number, //初始条数
        query?:string, //查询条件
        startTime?:number, //开始时间
        endTime?:number //结束时间
    }]>([{
        pageNum:1, //初始页
        pageSize:10, //初始条数  
    }]); //动态组装查询参数，和上面动态绑定的参数分割开
    state.queryInfo.pageNum =1; //初始化页码
    if(state.queryInfo.query!='' && state.queryInfo.startTime!=0 && state.queryInfo.endTime!=0){ //三个检索条件都存在时!
        arr[0].pageNum = state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].query = state.queryInfo.query;
        arr[0].startTime = format_timestramp(state.queryInfo.startTime) as number;
        arr[0].endTime = format_timestramp(state.queryInfo.endTime) as number;
    }else if(state.queryInfo.query!='' && state.queryInfo.endTime!=0){ //仅包含结束时间和搜索条件
        arr[0].pageNum = state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].query = state.queryInfo.query;
        arr[0].endTime = format_timestramp(state.queryInfo.endTime) as number;
    }else if(state.queryInfo.endTime !=0){ //仅包含结束时间
        arr[0].pageNum = state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].endTime = format_timestramp(state.queryInfo.endTime) as number;
    }else if(state.queryInfo.query!='' && state.queryInfo.startTime!=0){ //仅包含开始时间和查询条件
        arr[0].pageNum = state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].startTime = format_timestramp(state.queryInfo.startTime) as number;   
    }else if(state.queryInfo.startTime!=0){ //仅包含开始时间
        arr[0].pageNum =state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].startTime = format_timestramp(state.queryInfo.startTime) as number;
    }else if (state.queryInfo.query!=''){ //仅包含查询条件时
        arr[0].pageNum = state.queryInfo.pageNum;
        arr[0].pageSize = state.queryInfo.pageSize;
        arr[0].query = state.queryInfo.query;
    }else{ //所有条件不包含时
        console.log("执行所有数据列表");
        getLiveInfos()
        return;
    }
    //开始执行搜索请求
    getliveInfo(arr[0])
    .then(rep=>{
        state.liveInfos = rep;
        if(state.liveInfos.meta.code == 200){
            ElMessage.success({
                message:'直播列表加载成功!',
                type:'success'
            });
            //关闭加载动画
            state.isLoding =false;
        }else{
            ElMessage.error({
                message:state.liveInfos.meta.msg,
                type:'error'
            });
        }
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙,加载直播列表时超时!',
            type:'error'
        });
    });
};

//下载配置文件
const download_conf =()=>{
    axios.create().get('/api/downloadConfigFile').then(rep=>{
            const {data,headers} = {...rep}
            //文件名
            const filename = headers['content-disposition'].substring(headers['content-disposition'].indexOf("=")+1);
            const blob = new Blob([data],{type:'application/octet-stream'});
            //这里其实就是创建一个a标签，将接收的数据放入a标签的href,通过模拟dom点击去调用浏览器下载(没有兼容ie)
            let dom = document.createElement('a');
            dom.download = filename;
            let url = window.URL.createObjectURL(blob);
            dom.href = url;
            dom.style.display = 'none';
            //挂载创建的a标签
            document.body.appendChild(dom);
            dom.click();
            URL.revokeObjectURL(dom.href);
            //移除创建的a标签
            document.body.removeChild(dom);
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙,下载失败!',
            type:'error'
        });
    });
};

onMounted(()=>{
    getLiveInfos() //模板初始化时加载直播列表
});


</script>
<style lang='less' scoped>
</style>