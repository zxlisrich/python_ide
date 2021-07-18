// components/loading/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // loadM:{
    //   type:Boolean,
    //   value:true
    // }
  },
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadM:true
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.loadModal();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadModal () {
      this.setData({
        loadM: true
      })
      setTimeout(()=> {
        this.setData({
          loadM: false
        })
      }, 2000)
    },
  }
})
