// components/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    elements:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  options: {
    addGlobalClass: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goto_next(e){
      console.log(e);
      let index = e.currentTarget.dataset.index;
      let data = this.properties.elements;
      if(data.ispass!=0){
        wx.setStorage({
          data: this.properties.elements,
          key: 'elements',
        })

  
        wx.navigateTo({
          url: '../../pages/test/test',
        })
        console.log("小夫， 我进来啦");
        console.log( this.properties.elements);
      }
      
    }
  }
})
