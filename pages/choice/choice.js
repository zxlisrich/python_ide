// pages/test/test.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scroll: 0,
    curIndex: 0,  //选题目跳转页面
    choice_question: [],  //选择题集合
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
      name: 'get_choice_data',
    }).then(res => {
      let data = [];
      // console.log(res.result);
      for (let i = 0; i < res.result.data.length; i++) {
        let t = res.result.data[i];
        let temp = {};
        temp.ans = t.ans;
        temp.options = t.options;
        temp.title = t.title;
        data.push(temp);
        // console.log(temp); 
      }
      console.log("小夫我要进来啦啦啦啦啦");
      that.setData({
        choice_question: data,
        ques_num: data.length
      })
    })
    // console.log("小夫我要初拉力了");
  },

  async get_user_info() {
   // console.log(app.globalData.user_id);
    let that = this;
    console.log("app", app.globalData.user_id);
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data:{
        id:app.globalData.user_id
      }
    }).then(res => {
      console.log("data:", res);
      let choice_data = that.data.choice_question;  //data中的题目数据
      let data = res.result.data[0];
      let t1 = [];
      let data_num = [0, 0, 0, 0, 0,0, 0,0];
      if (data.choice == null) {
        for (let i = 0; i < choice_data.length; i++) {
          let tp = {};
          let t = choice_data[i];
          tp.show_ans = 0;
          tp.ans = t.ans;
          tp.title = t.title;
          tp.error_ans = 0;
          t1.push(tp);
        }
       
        if(data.data_num != null){
          for(let i =2; i< data.data_num.length; i++){
            data_num[i] = data.data_num[i];
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
          show_data: data.choice,
          data_num:data.data_num,
          integral:data.integral
        })
        console.log("data.choice:", data.choice);
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
        choice: that.data.show_data,
        data_num:that.data.data_num,
        integral: that.data.integral
      },
    }).then(res => {
      console.log("小夫加油", res);
      console.log("show_data：", that.data.show_data)
    })

  },


  async set_index(e) {
    let idx = e.currentTarget.dataset.index;
    let index = this.data.index;
    let data = this.data.show_data;
    let data_num = this.data.data_num;
    let integral = this.data.integral;
    if(data[index].ans == idx+65){
      data[index].show_ans = 1;
      data_num[0]++;
      integral++;
    }else{
      data[index].error_ans = idx + 65;
      data[index].show_ans = 2;
      data_num[1]++;

    }
    this.setData({
      show_data: data,
      data_num,
      integral
    })
    console.log("lalallalal",this.data.show_data);
    await this.update_user_data();
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