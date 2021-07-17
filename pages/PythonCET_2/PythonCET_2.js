// pages/question_center/question_center.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [{
        title: '选择题',
        img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
        url: '/choice/choice'
    },
      {
        title: '填空题',
        img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
        url: '/filling/filling'
      },
      {
        title: '综合题',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
        url: '/multiple/multiple'
      },
      {
        title: '模拟考试',
        img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
        url: '/exam/exam'
      }
    ]
  },

  toChild(e) {
    wx.navigateTo({
      url: '/pages' + e.currentTarget.dataset.url
    })
  },
})

