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
       console.log(res);
      for (let i = 0; i < res.result.data.length; i++) {
        let t = res.result.data[i];
        let temp = {};
        temp.ans = t.ans;
        temp.contents = t.contents;
        data.push(temp);
        // console.log(temp); 
      }
      console.log("小夫我要进来啦啦啦啦啦");
      that.setData({
        filling_question: data,
        ques_num: data.length
      })
    })
    // console.log("小夫我要初拉力了");
  },

  async get_user_info() {
    let that = this;
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data:{
        id:app.globalData.user_id
      }
    }).then(res => {
      console.log("data:", res);
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
        // console.log("前面的show_data", this.data.show_data);
      } else {
        that.setData({
          show_data: data.filling,
          data_num:data.data_num,
          integral:data.integral
        })
        console.log("filling.choice:", data.filling);
        console.log(that.data.data_num);
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
      console.log("小夫加油", res);
      console.log("show_data：", that.data.show_data)
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
       console.log("回答正确");
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
    console.log(e);
    let index = this.data.index;
    let idx = e.currentTarget.dataset.index;
    let data  = this.data.show_data;
    data[index].error_ans[idx] = e.detail.value
    // let data = this.data.Level_content;
    // let value = e.detail.value;
    // let len = data[i].filling.users_ans.length;
    // data[i].filling.users_ans[index] = value;
     this.setData({
       show_data:data
     })
     console.log("用户答案error",data);
  },

  show_all_data() {
    this.setData({
      show: true
    })
    console.log("aaaaA", this.data.show);
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
    console.log(e);
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index
    })
    this.hideModal();
  },

  swiper_change(e) {
    // console.log(e);
    this.setData({
      index: e.detail.current
    })
  }
})