<template>
  <div class="login_container" :style="{backgroundImage: 'url(' + state.imgInfos.imgurl + ')', backgroundSize:'100% 100%', backgroundRepeat: 'no-repeat'}">
    <!-- 登陆面板 -->
    <div class="login_box">
      <!-- 登陆面板头像 -->
      <div class="avatar_box">
        <img src="../assets/img/login_logo.jpg" />
      </div>
      <!-- 登陆表单 -->
      <el-form 
        class="login_form" label-width="0px"
        ref ="ruleFormRef"
        :model="state.ruleForms"
        :rules="state.rules"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <template #default>
            <el-input
              placeholder="请输入用户名"
              :prefix-icon="User"
              size="default"
              type="text"
              v-model="state.ruleForms.username"
            />
          </template>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <template #default>
            <el-input
              placeholder="请输入密码"
              type="password"
              :prefix-icon="Lock"
              size="default"
              v-model="state.ruleForms.password"
            />
          </template>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" size="default" @click="Login(ruleFormRef)">登录</el-button>
          <el-button type="info" size="default" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onBeforeMount, ref } from "vue";
import { Lock, User } from "@element-plus/icons-vue";
import { imageInfo, ruleForm, relues } from "../type/login";
import { getImg, getCsrf, login } from "../api/index";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { liveStore } from '../store/loginstatus'
import  router  from '../router/index';
import md5 from "js-md5";


//form表单引用对象
const ruleFormRef = ref<FormInstance>();

//自定义校验规则对输入的用户名进行校验
const vaildateUsername = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
  if(!value){
    callback('用户名不能为空!');
  }else{
    callback(); //通过校验
  }
};

//表单密码的自定义校验规则
const vaildatePwd = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
  if(!value){
    callback('密码不能为空!');
  }else{
    callback();
  }
};


const state = reactive<{
  imgInfos: imageInfo,
  ruleForms:ruleForm,
  rules:relues
  token:string
}>({
  imgInfos: { //随机背景图片返回数据对象实例
    code: '', //状态码
    imgurl: '', //图片地址
  },
  ruleForms:{ //表单双向绑定对象
    username:'', //动态绑定用户名
    password:'' //动态绑定密码
  },
  rules:{ //from表单校验规则对象
    username:[{ validator: vaildateUsername, trigger: 'blur' }], 
    password:[{ validator: vaildatePwd, trigger: 'blur' }]
  },
  token:'' //csrf
});

//获取csrf令牌
const getTOKEN =(()=>{
    getCsrf().then(rep=>{
      //赋值
      state.token  = rep
      //将变量存储到pinia
      let liveSto = liveStore();
      liveSto.setToken(state.token);
  }).catch(()=>{
      console.log('获取csrf失败!');
  }); 
});



//获取登陆页随机背景图片
const getBrkImg = (()=>{
  getImg()
    .then(rep=>{
        if(rep.code == '200'){
            ElMessage.success({
                message:'获取图片地址成功!',
                type:'success'
            });
            //赋值给响应对象实例
            state.imgInfos = rep
            return;
        }
        ElMessage.error({
            message:'获取图片地址失败!',
            type:'error'
        });
    }).catch(()=>{
        ElMessage.error({
            message:'网络错误，获取图片地址失败!',
            type:'error'
        });
    });
});

const Login = (formEl:FormInstance | undefined)=>{
  if(!formEl) return
  formEl.validate().then(()=>{
    //加密密码
    state.ruleForms.password = md5(state.ruleForms.password)
    //开始登陆
    login(state.ruleForms).then(rep=>{
      if(rep.code == 200){ //登陆成功
        ElMessage.success({
          message:rep.msg,
          type:'success'
        });
        //将当前用户名存储到pinia
        let liveSto = liveStore();
        liveSto.setUA(state.ruleForms.username);
        //跳转到后台首页
        router.push('/home');
      }else{
        ElMessage.error({
          message:rep.msg,
          type:'error'
        });
      }
    }).catch(()=>{
      ElMessage.error({
        message:'网络错误，登陆失败!',
        type:'error'
      });
    });
  }).catch(()=>{
    console.log("表单校验不符合要求!");
  });
};

//清空表单
const resetForm = (formEl:FormInstance | undefined)=>{
  if (!formEl) return
  formEl.resetFields();
};


onBeforeMount(()=>{
    getBrkImg(), //虚拟dom挂载前获取登陆页背景图片
    getTOKEN()
});

</script>
<style lang="less" scoped>
.login_container {
  background-color: rgb(233, 236, 243);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: rgba(245, 247, 250, 0.7);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  z-index: 2;
}
.btns {
  display: flex;
  justify-content: flex-end;
  float: right;
  z-index: 4;
}

.login_form {
  position: absolute;
  bottom: 50px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 3;
}
</style>
