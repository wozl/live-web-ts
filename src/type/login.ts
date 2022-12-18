
//登陆页 随机背景图片信息对象接口
export interface imageInfo {
    code:string, //状态码
    imgurl:string, //图片地址
    width?:string, //宽
    height?:string //高
}

//登陆页表单对象
export  interface ruleForm {
    username:string, //用户名
    password:string //密码
}

//登陆页表单规则校验对象
export interface relues {
    username:{}[],
    password:{}[]
}

//登陆信息返回对象
export  interface login_msg{
    code:number, //状态码
    msg:string //返回信息
}