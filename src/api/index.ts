import request from '../utils/request';
import { menuInfoRep } from '../type/index'
import { imageInfo, ruleForm, login_msg } from '../type/login'
import { change_user_pwd, queryInfo } from '../type/admin/components/header'
import { live_queryInfo, liveInfo, editObj, rep_info } from '../type/admin/home'



export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

//获取首页频道菜单列表
export const getMenu = ():Promise<menuInfoRep> =>request.get('/api/menuInfo');

//获取登录页随机图片地址
export const getImg = ():Promise<imageInfo> =>request.get('https://www.liangquanhot.cn/img/');

//获取csrf令牌
export const getCsrf  = ():Promise<string> =>request.get('/api/token');

//用户登陆
export const login = (data:ruleForm):Promise<login_msg> =>request.post('/api/login',data);

//修改密码
export const up_pwd = (data:queryInfo):Promise<change_user_pwd> =>request.post('/api/updatePwd',data);

//获取电视直播数据列表(动态条件)
export const getliveInfo = (data:live_queryInfo):Promise<liveInfo> => request.post('/api/getUrlInfo',data);

//更新频道信息
export const up_url = (data:editObj):Promise<rep_info> =>request.post('/api/updateLiveInfo',data);

//新增频道信息
export const add_url= (data:editObj):Promise<rep_info> =>request.post('/api/addLive',data);

//根据id删除频道信息
export const del_live = (id:number):Promise<rep_info> =>request.post('/api/delLiveInfoById',{"id":id});


