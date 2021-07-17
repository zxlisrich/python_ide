// pages/one/one.js
const app = getApp()
const db = wx.cloud.database()
let id = 0
let user_study_msg = {}
Page({
  data: {
    elements: {},
  },
  async onShow() {
    await this.get_openid();
    await this.get_elements();
    await this.set_is_pass();
  },

  get_openid() {
    wx.getStorage({
      key: 'id',
      success(res) {
        id = res.data
        console.log(id);
      }
    })
  },
  async get_elements() {
    let that = this;
    await wx.getStorage({
      key: 'contents',
      success(res) {
        console.log(res.data);
        that.setData({
          elements: res.data
        })
      }
    })
  },

  async set_is_pass() {
  await  this.get_user_info();
    let data = this.data.elements;
    let tit = data[0].title;
    let user_data = user_study_msg;   
    console.log(user_data);
   for(let i = 0; i<data.length; i++){
     let flag = 0;
     let t = data[i].title;
     if(user_data[t].one.flag == 0 && user_data[t].two.flag == 0 && user_data[t].three.flag == 0) data[i].ispass = 0;
     else if(user_data[t].one.flag == 1 && user_data[t].two.flag == 1&& user_data[t].three.flag == 1) data[i].ispass = 1;
     else data[i].ispass = 2;
   }
   if(data[0].ispass == 0) data[0].ispass = 2;
   for(let i = 1; i<data.length; i++){
     if(data[i].ispass != 1 && data[i-1].ispass == 1) data[i].ispass = 2;
   }
   this.setData({
     elements:data
   })
   console.log("elements",data);
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
      console.log('res??????????', res.result);
    })
    return data
  }


})