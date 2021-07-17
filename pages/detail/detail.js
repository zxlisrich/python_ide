// pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scroll: 0,
    index: 0,
    Level_content: [],
    md: "",
    clientHeight: 0,
    currentTab:0,
    state:[],
    title:'',
    openid:'',
  },

  async  onLoad() {
    let data;
    let that = this;
    let index = 0;
    let title = '';
    let openid='';
   await wx.getStorage({
      key: 'openid',
      success(res){
        console.log("openid",res);
        // that.setData({
        //   openid:res.data
        // })
      }
    })
   wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight-120
        });
      }
    })
   await wx.getStorage({
      key: 'elements',
      success(res) {
        data = res.data.Level_content;
        index = res.data.index;
        title = res.data.title;
        that.setData({
          index: index,
          Level_content: data,
          title
        })
      }
    })
  // await  wx.getStorage({
  //     key: 'index',

  //   })
  this.getIndex();
  await this.get_ispass_state();     //获取状态数组
  //获取markdown
   
  },
  swiperchange: function(e) {
    var that = this 
    console.log(e.detail.current) 
    that.setData({
      'currentTab': e.detail.current
    })
    console.log("app",app.globalData.user_id);
  },
  getIndex() {
    let data = this.data.Level_content;
    let len = data.length;
    let t = len;
    for (let i = 0; i < len; i++) {
      if (data[i].ispass == false) {
        t = i - 1;
        break;
      }
    }
    this.setData({
      scroll: this.data.scroll == len - 1 ? 0 : t + 1
    })
  },

  scrollSteps(e) {
  
    let index = this.data.currentTab;
    let data = this.data.state;
    if (index == 3) {
      wx.showToast({
        title: '您已经通关啦',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      if (data[index] == 1) {
        data[index+1] = 1;
        this.setData({
          scroll: parseInt(index) + 1,
          currentTab:index++,
          state:data
        })
      } else {
        wx.showToast({
          title: '请先通关当前关卡',
          icon: 'none',
          duration: 2000
        })
      }
    }

  },
  submit() {
    let i = this.data.scroll - 1;
    let temp = this.data.Level_content;
    let data = temp[i].filling.users_ans;
    let ans = temp[i].filling.ans;
    let len = ans.length;
    let flag = false;
    for (let i = 0; i < len; i++) {
      if (ans[i] != data[i]) {
        flag = true;
        break;
      }
    }
    temp[i].show_ans = true;
    if (!flag) {
      temp[i].isRight = true;
      console.log("回答正确");
    }
    this.setData({
      Level_content: temp
    })

  },

  get_user_ans(e) {
    let index = e.currentTarget.dataset.index;
    let i = this.data.scroll - 1;
    let data = this.data.Level_content;
    let value = e.detail.value;
    let len = data[i].filling.users_ans.length;
    data[i].filling.users_ans[index] = value;
    this.setData({
      Level_content: data
    })
    // console.log(data[i].filling.users_ans);
  },

  get_user_choice(e) {
    console.log(e);
    let i = this.data.scroll - 1;
    let j = 0;
    let k = 0;
    let data = this.data.Level_content;
    let temp = data[i].choice.options.ans;
    let options = data[i].choice.options;
    let t1 = e.detail.value;
    data[i].choice.options.user_ans = t1;
    data[i].show_ans = true;
    for (let i = 0; i < options.length; i++) {
      if (i.toString() == t1) j = i;
      if (i.toString() == temp) k = i;
    }
    data[i].choice.options[k].checked = 1;
    if (t1 == temp) {
      data.isRight = true;
      console.log("回答正确");
    } else {
      data[i].choice.options[j].checked = 2;
      console.log("回答错误");
    }
    this.setData({
      Level_content: data
    })

  },
  // bindlevel(e) {
  //   //console.log(e);
  //   let index = e.currentTarget.dataset.index;
  //   let data = this.data.Level_content;
  //   let can_pass = false;
  //   if (index > 0) can_pass = this.data.Level_content[index - 1].ispass;
  //   else can_pass = true;
  //   if (can_pass) {
  //     this.setData({
  //       scroll: parseInt(index) + 1,
  //       Level_content: data
  //     })

  //   } else {
  //     wx.showToast({
  //       title: '请先通关前面的关卡',
  //       icon: 'none',
  //       duration: 2000
  //     })

  //   }
  // },
  bindlevel(e) {
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index
    })
  },

  onUnload() {

    wx.setStorage({
      data: this.data.index,
      key: 'index',
    })
    wx.setStorage({
      data: this.data.Level_content,
      key: 'Level_content',
    })

  },
  //获取markdown
  get_markdown() {
    db.collection("python_study").get().then(res => {

      for (let i = 0; i < res.data.length; i++) {

      }
    })

  },
  async get_ispass_state() {
    let that = this;
    let title = this.data.title;
    let openid = this.data.openid;
    console.log(app.globalData.user_id);
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data: {
        id: openid
      }
    }).then(res => {
      console.log(res);
      let arr = res.result.data[0].python_study[title];
      that.setData({
        state: arr
      })
    })
    console.log("state", this.data.state);
  }

})