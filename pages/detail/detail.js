
//const { threadId } = require("worker_threads")

// pages/detail/detail.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
let user_study_msg = {}
let title = ''
let i = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show_contents: '',  //文章内容对象
    show_choice_data: [], //选择题数组
    show_filling_data: {}, //填空题数组
    show_who: 0, //判断展示那个内容（0 内容？1，2 选择题？3 填空题？） 
    scroll: 0,   // 渲染上面蓝色的进度条
    
  },
  async onLoad() {
  await  this.get_user_info()
  await  this.get_show_contents()
  },

  scrollSteps() {
    let index = this.data.show_who + 1;
    let s = this.data.scroll;
    if(index > s && index <=3){
      this.setData({
        scroll:index
      })
    }
    if (index <= 3) {
      this.setData({
        show_who:index
      })
    }
    if (index > 3) {
      wx.showToast({
        title: '你已经成功通关了！',
        icon: 'none',
        duration: 2000
      })
    }
    console.log("scroll:", this.data.scroll);
  },
  async get_show_contents() {
    let data = {}  //作为中间变量，用来接收缓存中的数据，
    let show_contents = '';
    let show_choice_data = []; //存放选择题数据
    let show_filling_data = {}; //存放填空题数据
    let that = this;
    let scroll = 0;
    await wx.getStorage({
      key: 'elements',
      success(res) {
        data = res.data;
        title = data.title;
        show_contents = data.contents;
        show_choice_data = data.choice;
        show_choice_data[0].flag = user_study_msg[title].one.flag;
        scroll+=show_choice_data[0].flag ;
        show_choice_data[0].user_ans = user_study_msg[title].one.user_ans;
        show_choice_data[1].flag = user_study_msg[title].two.flag;
        scroll+=show_choice_data[1].flag ;
        show_choice_data[1].user_ans = user_study_msg[title].two.user_ans;
        show_filling_data = data.filling;
        show_filling_data.flag = user_study_msg[title].three.flag;
        scroll += show_filling_data.flag;
        show_filling_data.user_ans = user_study_msg[title].three.user_ans;
        let temp = user_study_msg[title];
        show_choice_data[0].flag = temp.one.flag;
        show_choice_data[1].flag = temp.two.flag;
        show_filling_data.flag = temp.three.flag
        that.setData({
          show_contents,
          show_choice_data,
          show_filling_data,
          scroll
        })
        console.log(show_choice_data,show_filling_data );
      }
    })
  },

  async get_user_info() {
    let that = this;
    let data = {};
    console.log("???appid", app.globalData.user_id);
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data: {
        id: app.globalData.user_id
      }
    }).then(async res => {
      data = res.result;
      user_study_msg = res.result.data[0].python_study;
    })
  },
  async set_index(e){
    let index = e.currentTarget.dataset.index;
    let checked = index+65;
    let flag = e.currentTarget.dataset.flag;
    let data = this.data.show_choice_data;
    if(flag == 0){
      user_study_msg[title].one.flag = 1;
      user_study_msg[title].one.user_ans = checked;
    }else{
      user_study_msg[title].two.flag = 1;
      user_study_msg[title].two.user_ans = checked;
    }
    data[flag].user_ans = checked;
    if(data[flag].ans == checked) i = 1;
    else i = 0;
    data[flag].flag = 1;
    this.setData({
      show_choice_data:data
    })
    console.log(e);
    await this.update_user_data();
  },

  bindlevel(e) {
    let index = e.currentTarget.dataset.index;
    let scroll = this.data.scroll;
    if(index <= scroll){
      this.setData({
        show_who:index
      })
    }else{
      wx.showToast({
        title: '请先通关前面的关卡',
        icon: 'none',
        duration: 2000
      })
    }
  },
  get_user_ans(e){
    let data = this.data.show_filling_data;
    data.user_ans = e.detail.value;
    this.setData({
      show_filling_data:data
    })
  },

  async  submit(){
    let data = this.data.show_filling_data;
    console.log(data);
    data.flag = 1;
    this.setData({
      show_filling_data:data
    })
    if(data.ans == data.user_ans) i = 1
    else i = 0; 
    user_study_msg[title].three.flag = 1;
    user_study_msg[title].three.user_ans = data.user_ans;
    await this.update_user_data();
  },
  async update_user_data() {
    let that = this
    await db.collection("user_info").where({
      _openid:app.globalData.user_id
    }).update({
      data: {
        python_study:user_study_msg,
        integral:_.inc(i)
      },
    }).then(res => {
      console.log("小夫加油", res);
    })

  },
})