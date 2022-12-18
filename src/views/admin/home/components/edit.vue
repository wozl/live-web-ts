<template>
    <!-- 后台首页新增&删除公用表单 -->
    <el-dialog :title="state.opt ==false ? '新增' :'编辑'" v-model="edit_dialogFormVisible" width="50%" :before-close="close">
       <template #header>
            <el-icon >
                <component :is="state.opt ==false ? DocumentAdd : Edit"></component>
            </el-icon>&nbsp;
           <span>{{ state.opt ==false ? '新增' :'编辑' }}&nbsp;&nbsp;{{ state.opt ==false ? '' : '--' + new_edit_form.name }}</span>
       </template>
        <el-form :model="new_edit_form" ref="editFormRef" :rules="editFormRules">
            <el-form-item label="频道">
                <el-input v-model="new_edit_form.name" prop="name" autocomplete="off" :label-width="formLabelWidth" size="default"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="new_edit_form.url" prop="url" autocomplete="off" :label-width="formLabelWidth" size="default"></el-input>
            </el-form-item>
            <el-form-item label="台标">
                <el-input v-model="new_edit_form.icon" prop="icon" autocomplete="off" :label-width="formLabelWidth" size="default"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="new_edit_form.remarks" prop="remarks" autocomplete="off" :label-width="formLabelWidth" size="default"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部按钮组 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close()" size="default">取消</el-button>
                <el-button type="primary" @click="state.opt ==false ? add_edit() : up_edit() " size="default">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang='ts' setup>
import { reactive, toRefs, watch, ref} from 'vue'
import { editObj } from '../../../../type/admin/home'
import type { FormInstance } from 'element-plus'
import { up_url, add_url } from '../../../../api/index'
import { ElMessage } from 'element-plus'
import { Edit, DocumentAdd } from "@element-plus/icons-vue";
import  axios  from 'axios'

const editFormRef =ref<FormInstance>()

//频道名称验证规则
const checkName = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
    if(!value){
        callback('频道名称不能为空');
    }else{
        callback();
    }
};

//原始url验证规则
const checkUrl = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
    if(!value){
        callback('频道地址不能为空');
    }else{
        callback();
    }
};

//直播url验证规则
const checkRemarks = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
    if(!value){
        callback('频道备注信息不能为空');
    }else{
        callback();
    }
};


//接收来自父组件的自定义属性值
const props = defineProps<{
    edit_dialogFormVisible:boolean, //父组件控制编辑对话框显示/隐藏
    edit_form:editObj, //编辑/新增表单对象(父组件原始数据)
}>();

const state  = reactive<{
    formLabelWidth:string,
    editFormRules:{}, //表单验证规则
    new_edit_form:editObj, //子组件编辑/新增表单对象(拷贝父组件的表单内容，修改值时不直接对父组件进行修改，防止取消后父组件的显示的内容也被关联修改)
    opt:boolean //对当前表单调用时区分是新增还是修改
}>({
    formLabelWidth:'120px',
    editFormRules:{ //编辑/新增表单校验规则
        name:[[{ validator: checkName, trigger: 'blur' }]],
        url:[{ validator: checkUrl, trigger: 'blur' }],
        icon:[],
        remarks:[{ validator: checkRemarks, trigger: 'blur' }]
    }, 
    new_edit_form:{ //子组件编辑/新增表单对象(拷贝父组件的表单内容，修改值时不直接对父组件进行修改，防止取消后父组件的显示的内容也被关联修改)
        id:0, //id
        name:'', //频道名称
        url:'', //原始地址 
        icon:'', //台标
        remarks:'' //直播名称
    },
    opt:false
});

//监听父组件编辑/新增表单值变化，有变化就拷贝到子组件内部的表单对象中
watch(()=>props.edit_form,()=>{
    if(props.edit_form.id!=0){
        console.log('检测到父组件传递值发生改变！')
        state.new_edit_form = {...props.edit_form}
        //当前表单为修改
        state.opt = true;
    }else{
        //仍然需要拷贝父组件的信息，不过是默认值罢了
        state.new_edit_form = {...props.edit_form}
        state.opt = false;
    }
    
});


//自定义响应事件
const emit = defineEmits<{
    (event:'close',val?:string):void
}>();

//响应父组件的关闭对话框事件
const close = (val?:string)=>{
    emit('close',val);
};

//更新直播频道信息
const up_edit = ()=>{
    up_url(state.new_edit_form).then(rep=>{
        if(rep.meta.code == 200){
            ElMessage.success({
                message:rep.meta.msg,
                type:'success'
            });
             //刷新列表
             close('reload');
        }else{
            ElMessage.error({
                message:rep.meta.msg,
                type:'error'
            });
        }
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙，更新失败!',
            type:'error'
        });
    });
};

//新增频道信息
const add_edit = ()=>{
    add_url(state.new_edit_form).then(rep=>{
        if(rep.meta.code == 200){
            ElMessage.success({
                message:rep.meta.msg,
                type:'success'
            });
            //刷新列表
            close('reload');
        }else{
            ElMessage.error({
                message:rep.meta.msg,
                type:'error'
            });
        }
    }).catch(()=>{
        ElMessage.error({
            message:'网络繁忙，新增失败!',
            type:'error'
        });
    });
};


let { formLabelWidth,editFormRules,new_edit_form } = toRefs(state);

</script>
<style lang='less' scoped>

</style>