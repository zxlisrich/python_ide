// pages/test/test.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    curIndex: 0,  //选题目跳转页面
    filling_question: [],  //选择题集合
    show_data: [],
    ques_num: 0,   //题目的长度
    index: 0,
    data_num:[],
    integral:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad() {
    this.get_all_data();
  },

  async get_all_data() {
    await this.get_data();
    await this.get_user_info();
  },

  async get_data() {
    let that = this;
    await wx.cloud.callFunction({
      name: 'get_filling_data',
    }).then(res => {
      let data = [];
      for (let i = 0; i < res.result.data.length; i++) {
        let t = res.result.data[i];
        let temp = {};
        temp.ans = t.ans;
        temp.contents = t.contents;
        data.push(temp);
 
      }
      that.setData({
        filling_question: data,
        ques_num: data.length
      })
    })
  },

  async get_user_info() {
    let that = this;
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data:{
        id:app.globalData.user_id
      }
    }).then(res => {
      let filling_data = that.data.filling_question;  //data中的题目数据
      let data = res.result.data[0];
      let t1 = [];
      let data_num = [0, 0, 0, 0, 0,0, 0,0];
      if (data.filling == null) {
        for (let i = 0; i < filling_data.length; i++) {
          let tp = {};
          let t = filling_data[i];
          tp.show_ans = 0;
          tp.ans = t.ans;
          tp.contents = t.contents;
          tp.error_ans = [null, null, null, null, null, null];
          tp.isRight = false;
          t1.push(tp);
        }
        if(data.data_num != null){
          for(let i =0; i< data.data_num.length; i++){
            if(i == 2|| i == 3) data_num[i] = 0;
            else data_num[i] = data.data_num[i];
          }
        }
        let integral = 0;
        if(data.integral != null) integral = data.integral;
        that.setData({
          show_data: t1,
          data_num,
          integral:integral
        })
      } else {
        that.setData({
          show_data: data.filling,
          data_num:data.data_num,
          integral:data.integral
        })
      }
    })
    await this.update_user_data();
  },

  async update_user_data() {
    let that = this
    await db.collection("user_info").where({
      _openid:app.globalData.user_id
    }).update({
      data: {
        filling: that.data.show_data,
        data_num:that.data.data_num,
        integral: that.data.integral
      },
    }).then(res => {
    })

  },


  async  submit(){
    let temp = this.data.show_data;
    let index = this.data.index;
    let data = temp[index];
    let ans =  data.ans;
    let error_ans = data.error_ans;
    let len = ans.length;
    let flag = false;
    let data_num = this.data.data_num;
    let integral = this.data.integral;
    for(let i = 0; i<len; i++){
      if(ans[i] != error_ans[i]){
        flag = true;
        break;
      }
    }
    data.show_ans = true;
    if(!flag){
      data.isRight = true;
       data_num[2]++;
       integral++;
    }else data_num[3]++;
    temp[index] = data;
    this.setData({
      show_data:temp,
      data_num,
      integral
    })
    await this.update_user_data();
  },

  get_user_ans(e){
    let index = this.data.index;
    let idx = e.currentTarget.dataset.index;
    let data  = this.data.show_data;
    data[index].error_ans[idx] = e.detail.value

     this.setData({
       show_data:data
     })
  },

  show_all_data() {
    this.setData({
      show: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  },
  bindlevel(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index
    })
    this.hideModal();
  },

  swiper_change(e) {
    this.setData({
      index: e.detail.current
    })
  }
})