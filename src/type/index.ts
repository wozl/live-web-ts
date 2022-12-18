
//首页左侧菜单返回数据类型
export interface menuInfoRep  {
    code:number, //状态码
    msg:string, //返回信息说明
    data:[{
        id:number, //频道id
        name:string, //频道名称
        remarks:string, //请求播放频道别名
        icon?:string //频道图标
    }] //菜单列表集合
};

