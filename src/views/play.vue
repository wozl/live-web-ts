<template>
    <video
        id="videoElement" 
        controls 
        autoplay 
        muted 
        style="width: 80%;height:80%;object-fit:fill;"  
    />
</template>

<script lang='ts' setup>
import { onMounted,watch,ref } from 'vue'
import flvjs from 'flv.js'
import { ElMessage } from 'element-plus';

//父子组件传值
const props = defineProps<{
    val:string //父组件传递的新的播放地址
}>();

watch(()=>props.val,(newVal:string)=>{
    console.log("监听到父组件值新值=>",newVal,"开始重新渲染播放器实例!")
    //销毁播放器实例
    flv_destory
    //重新渲染新的播放器实例
    change_flv(newVal);
});

//播放器实例(动态)
let flvPlayer = ref();

//初始化播放器，请求默认频道直播
const flvInit = ()=>{
    let url = "/live/flv?port=1935&app=cctv1hd&stream=live";
    let videoElement = document.getElementById("videoElement");
    if(flvjs.isSupported()){
        flvPlayer.value = flvjs.createPlayer({
            type:'flv',
            isLive:true,
            hasAudio:true,
            url
        });
        flvPlayer.value.attachMediaElement(videoElement);
        flvPlayer.value.load();
        flvPlayer.value.play();
    }
    flvPlayer.value.on(flvjs.Events.ERROR,()=>{
        ElMessage.error({
            message:"播放发生错误!",
            type:'error'
        });
        //销毁播放器实例
        flv_destory();
    });
    
};

//销毁播放器
const flv_destory = ()=>{
    if(flvPlayer.value){
        flvPlayer.value.pause()
        flvPlayer.value.unload()
        flvPlayer.value.detachMedialement()
        flvPlayer.value.destory()
        flvPlayer.value = null
    }
};


//切换频道
const change_flv = (new_address:string)=>{
    let url = `/live/flv?port=1935&app=${new_address}&stream=live`
    let videoElement = document.getElementById("videoElement");
    if(flvjs.isSupported()){
        flvPlayer.value = flvjs.createPlayer({
            type:'flv',
            isLive:true,
            hasAudio:true,
            url
        });
        flvPlayer.value.attachMediaElement(videoElement);
        flvPlayer.value.load();
        flvPlayer.value.play();
    }
    flvPlayer.value.on(flvjs.Events.ERROR,()=>{
        ElMessage.error({
            message:"播放发生错误!",
            type:'error'
        });
        //销毁播放器实例
        flv_destory();
    });
    
};


onMounted(()=>{
    console.log("子组件初始化时，开始自动加载!")
    flvInit(); //初始化默认播放器实例
});


</script>
<style lang='less' scoped>
</style>