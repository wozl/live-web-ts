
//添加搜索组件参数对象
export interface live_queryInfo {
    pageNum:number, //当前页码，必须
    pageSize:number, //每页显示条数，必须
    query?:string, //搜索关键字，可选
    startTime?:number, //开始时间，可选
    endTime?:number //结束时间，可选
}

//获取播放列表信息参数对象
export interface liveInfo {
    meta:{
        code:number, //状态码
        msg:string //状态说明信息
    },
    total:number, //数据总数
    pageNum:number, //当前页码
    pageSize:number, //每页显示条数
    data:{ //播放列表对象集合数组
        id:number, //id
        name:string, //频道名称
        remarks:string, //直播请求别名
        url:string, //原始地址
        icon?:string, //台标
        created_at:number, //创建时间
        updated_at:number //更新时间
    }[]
}

//子组件编辑/新增表单对象
export interface editObj  {
    id?:number, //id
    name:string, //频道名称
    remarks:string, //直播请求别名
    url:string, //原始地址
    icon:string, //台标
}

//更新频道表单返回对象
export interface rep_info {
    meta:{
        code:number,
        msg:string
    }
}