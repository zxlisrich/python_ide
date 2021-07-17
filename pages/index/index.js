// index.js
// 获取应用实例

const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
Page({

  data: {
    // 用户登录
    user_info: {
      isLogin: false,
      nick_name: "",
      avatar_url: ""
    },
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/00199ddeee14f2a8ec3d33359da286d3.jpeg'
    }, {
      id: 1,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/2510f60fd4dc65f227e693bf47dcf232.jpeg',
    }, {
      id: 2,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/2510f60fd4dc65f227e693bf47dcf232.jpeg'
    }, {
      id: 3,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/2510f60fd4dc65f227e693bf47dcf232.jpeg'
    }, {
      id: 4,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/be72c275f554a7d04911662a4ec3ab56.jpeg'
    }, {
      id: 5,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/d88c29d917fdd6b067f723a9e229b1b6.jpeg'
    }, {
      id: 6,
      type: 'image',
      url: 'cloud://dev-2gzxo1d2dc39c5e3.6465-dev-2gzxo1d2dc39c5e3-1305581356/carousel/d92253c04395eb4192feac133875f83b.jpeg'
    }],
    elements: [{
      title: '教程',
      name: 'python',
      color: 'cyan', 
      icon: 'text'
    },
    {
      title: '题库',
      name: 'PythonCET_2',
      color: 'blue',
      icon: 'formfill'
    },
    {
      title: '语法',
      name: 'text',
      color: 'purple',
      icon: 'font'
    },
    {
      title: '变量 ',
      name: 'icon',
      color: 'mauve',
      icon: 'icon'
    },
    ],
    //获取Python小故事
    pythonStory: []
  },
  onLoad() {
    this.getPythonStory();
    
  },

  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  //获取Python小故事
  getPythonStory() {
    wx.cloud.callFunction({
      name: "get_python_story"
    }).then(res => {
      this.setData({
        pythonStory: res.result.data
      })
      console.log("story:" + res.result.data)
    })
    // db.collection("python_story").get().then(res =>{
    //   console.log("story213"+res)
    // })
  },

  //获取用户信息

  // 跳转到Python小故事页面
  urlStory(e) {
    var title = e.currentTarget.dataset.title
    console.log("e = ", title)
    wx.navigateTo({
      url: "../story/story?title=" + title,

    }
    )
  },

})
