import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
	//persist:true, //开启数据持久化
	state: () => {
		return {
			collapse: false
		};
	},
	getters: {},
	actions: {
		handleCollapse() {
			this.collapse = !this.collapse;
		}
	}
});
