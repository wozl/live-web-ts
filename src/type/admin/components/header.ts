//后台首页头部下拉用户信息对象
export interface queryInfo { 
    username:string,
    password:string,
    com_pwd?:string
}


//修改后台首页头部下拉用户信息校验对象
export interface queryInfo_rules { 
    username?:{}[],
    password:{}[],
    com_pwd:{}[]
}

//用户修改密码信息返回
export interface change_user_pwd {
    code:number,
    msg:string
}