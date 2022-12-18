<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse"><Expand /></el-icon>
			<el-icon v-else><Fold /></el-icon>
		</div>
		<div class="logo">后台管理系统</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 全屏按钮组件 -->
				<div class="btn-bell">
					<el-tooltip effect="dark" content="全屏" placement="bottom">
						
						<el-icon @click="fullscreen"><FullScreen /></el-icon>
					</el-tooltip>
				</div>
				<!-- 用户头像 -->
				<div class="user-avator">
                    <img src="../assets/img/login_logo.jpg" />
                </div>
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ state.pwd_queryInfo.username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="up_pwd">修改密码</el-dropdown-item>
                            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
	<!-- 修改密码弹窗 -->
	<el-dialog title="修改密码" v-model="state.pwd_dialogFormVisible" :before-close="Dialog_close()" width="50%">
		<template #header>
			<i class="el-icon-key">
				&nbsp;
				<span>修改密码</span>
			</i>
		</template>
		<!-- 中间表单 -->
		<el-form class="demo-ruleForm" :model="state.pwd_queryInfo" :rules="state.pwd_rules" ref="ruleFormRef">
			<el-form-item label="用户名称" prop="username">
				<el-input autocomplete="off" disabled size="default" v-model="state.pwd_queryInfo.username"></el-input>
			</el-form-item>
			<el-form-item label="新的密码" prop="password">
				<el-input autocomplete="off" type="password" size="default" v-model="state.pwd_queryInfo.password"></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="com_pwd">
				<el-input autocomplete="off" type="password" size="default" v-model="state.pwd_queryInfo.com_pwd"></el-input>
			</el-form-item>
		</el-form>
		<!-- 底部按钮组 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button size="default" @click="resetForm(ruleFormRef)">取消</el-button>
				<el-button type="primary" size="default" @click="update_pwd(ruleFormRef)">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts">
import { onMounted,reactive, ref } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import md5 from 'js-md5';
import { FullScreen } from "@element-plus/icons-vue";
import { queryInfo, queryInfo_rules } from '../type/admin/components/header'
import { liveStore } from '../store/loginstatus'
import type { FormInstance } from 'element-plus'
//导入全屏组件
import screenfull from 'screenfull'
import { up_pwd } from "../api/index";
import { ElMessage } from "element-plus";



//修改密码表单ref对象
const ruleFormRef = ref<FormInstance>();
let liveSto = liveStore();

//自定义校验规则对输入的密码进行校验
const vaildatePassword = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
  if(!value){
    callback('密码不能为空!');
  }else{
    callback(); //通过校验
  }
};

const vaildateCom_Pwd = (rule:unknown,value:string | undefined,callback:(msg?:string)=>void)=>{
  if(!value){
    callback('请再次输入密码!');
  }else if(value!=state.pwd_queryInfo.password){
	callback('两次输入的密码不一致!');
  }else{
    callback(); //通过校验
  }
};


const state = reactive<{
	pwd_dialogFormVisible:boolean, //修改密码弹窗显示/隐藏
	pwd_queryInfo:queryInfo //修改密码表单数据对象
	pwd_rules:queryInfo_rules //修改密码表单验证规则对象
}>({
	pwd_dialogFormVisible:false, 
	pwd_queryInfo:{ 
		username:'', //用户名
    	password:'', //密码
    	com_pwd:'' //确认密码
	},
	pwd_rules:{
		username:[],
		password:[{ validator: vaildatePassword, trigger: 'blur' }],
		com_pwd:[{ validator: vaildateCom_Pwd, trigger: 'blur' }],
	}
});



//开启网页全屏模式
const fullscreen = ()=>{
    if(screenfull.isEnabled){
    	screenfull.toggle();
    }
};

//修改密码
const update_pwd = (formEl: FormInstance | undefined)=>{
	if (!formEl) return
	formEl.validate().then(()=>{
		//加密密码
		state.pwd_queryInfo.password = md5(state.pwd_queryInfo.password);
		state.pwd_queryInfo.com_pwd = md5(state.pwd_queryInfo.password);
		//提交新密码到服务器
		up_pwd({"username":state.pwd_queryInfo.username,"password":state.pwd_queryInfo.password}).then(rep=>{
			if(rep.code == 200){
				ElMessage.success({
					message:`${rep.msg}请重新登陆!`,
					type:'success'
				});
				formEl.resetFields(); //重置表单
				//清空登陆用户信息
				liveSto.username= '';
				liveSto.token = '';
				router.push('/login');
			}else{
				ElMessage.error({
					message:rep.msg,
					type:'error'
				});
			}
		}).catch(()=>{
			ElMessage.error({
				message:'网络繁忙，请稍后再试!',
				type:'error'
			});
		});
	}).catch(()=>{
		console.log("请确认表单填写是否符合规范!");
	});
};

//Dialog 对话框 关闭前清空from表单数据
const Dialog_close = ()=>{
	state.pwd_queryInfo.password = '';
	state.pwd_queryInfo.com_pwd = '';
};

//取消修改密码
const resetForm = (formEl: FormInstance | undefined)=>{
	if (!formEl) return
	formEl.resetFields(); //重置表单
	//隐藏修改密码表单
	state.pwd_dialogFormVisible =false;
}


const sidebar = useSidebarStore();
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
	//获取当前登陆的用户名
	state.pwd_queryInfo.username = liveSto.username;
});

// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		console.log('触发退出登陆!'); 
		//清空登陆用户信息
		liveSto.username= '';
		liveSto.token = '';
		router.push('/login');
	} else if (command == 'up_pwd') {
		console.log('触发更新密码!');
		//显示修改密码弹窗
		state.pwd_dialogFormVisible = true;
		
	}
};
</script>
<style scoped>
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
}
.user-avator {
	margin-left: 20px;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}
</style>
