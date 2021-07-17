// pages/home/home.js
const app = getApp()

const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    db.collection("user_info").get().then(res => {

      console.log("res=", res)


      if (res.data.length != 0) {

        this.setData({
          user_info: {
            nick_name: res.data[0].nick_name,
            avatar_url: res.data[0].avatar_url,
            isLogin: res.data[0].isLogin
          }
        })

      }
      app.globalData.isLogin = res.data[0].isLogin;
      app.globalData.user_id = res.data[0]._id;
      console.log(app.globalData.user_id);
    })
    
  },

  showQrcode(){
    wx.previewImage({
      urls: ["https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/python/images/1111.jpg?sign=b516822ac7660624afd70cf61f346e3b&t=1622732490"],
      current:'https://6465-dev-2gzxo1d2dc39c5e3-1305581356.tcb.qcloud.la/python/images/1111.jpg?sign=b516822ac7660624afd70cf61f346e3b&t=1622732490'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserProfile() {

    wx.getUserProfile({

      desc: "你好"
    }).then(res => {
      let _this = this
      console.log(res);
      db.collection("user_info").add({
        data:
        {
          nick_name: res.userInfo.nickName,
          avatar_url: res.userInfo.avatarUrl,
          isLogin: true,
        }

      })
      this.setData({
        user_info: {
          nick_name: res.userInfo.nickName,
          avatar_url: res.userInfo.avatarUrl,
          isLogin: true,
        },
      })
     
      app.globalData.isLogin = true
      app.globalData({
        user_head: res.userInfo.avatarUrl,
        user_naem: res.userInfo.nickName,
      })
      console.log("登陆成功：" + app.globalData.isLogin)

    })
    this.onLoad()




  },
})