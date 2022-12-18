import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: '/mytv/', //此处设置的是项目访问的path，默认不配置的情况下是/根路径，这里进行配置是为了nginx中能够以该名称进行子目录访
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	build:{
		sourcemap:false, //不生成map资源文件，防止被破解
		outDir:'mytvlive',  //打包后的目录名称
	},
	server:{
		port:5173, //本地端口
		open:true, //是否自动打开浏览器
		proxy:{ //跨域请求代理配置
			'/api':{
				target:'http://127.0.0.1:8000', //后台目标地址
                changeOrigin: true, //是否跨域
                ws: true, //是否代理ws
                //secure:false,  //是否https
				rewrite:(path)=>path.replace(/^\/api/,'')
			},
			'/live':{ //电视直播跨域配置
				target:'http://127.0.0.1',
				changeOrigin:true,
				ws:true,
				rewrite:(path)=>path.replace(/^\/live/,'')
			}
		}
	}
});
