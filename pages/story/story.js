// pages/story/story.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pythonStory: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (res) {
    console.log("res=",res.title)
    // wx.cloud.callFunction({
    //   name: "get_python_story",
    //   data:{
    //     title: res.title
    //   }
    // }).then(res => {
    //   this.setData({
    //     pythonStory: res.result.data
    //   })
    //  
    // })
      db.collection("python_story").where({
        title: res.title
      }).get().then(res =>{
        this.setData({
          pythonStory: res.data[0]
        })
        console.log("story:" , res)
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

  }
})