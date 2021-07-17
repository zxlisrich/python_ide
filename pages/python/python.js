//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({
  python_lesson: app.globalData.python_study,
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    TabCur: 1,
    scrollLeft: 0,
    python_dir: [
      {

        name: "第一个Python程序",
      },
      {
        name: "基本数据类型和变量",
      },
      {
        name: "List（列表）和 Tuple",
      },
      {
        name: "Dict和Set",
      },
      {
        name: "条件语句和循环语句",

      },
      {
        name: "函数",

      },
      {
        name: "迭代器和生成器",

      },
      {
        name: "迭代器和生成器",

      },

      {
        name: "面向对象",
      },
      {
        name: "模型与包",

      },
      {
        name: "Python 的 Magic Method",

      },
      {
        name: "枚举类",

      },
      {
        name: "元类",

      },
      {
        name: "线程与进程",

      },
      {
        name: "Python正则表达式",

      },
      {
        name: "闭包",

      },
      {
        name: "Python 装饰器",

      },

    ],
    user_sort: [],
    user_one_three:[]
  },

  async onLoad() {
    console.log("app", app.globalData.user_id);
    await this.get_user_info();
    await this.set_python_study();
    
  },

  intoContents(e) {
    let index = e.currentTarget.dataset.index;
    let title = this.data.python_dir[index].name;
    let data = app.globalData.python_study
    let k = 0;
    let contents = [];
    let arr = []  //用来存放用户的学习进度数组， 暂时使用这个名字
    console.log("data:", data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].one_directory == title) {
        let temp = {};
        let choice = [];
        let filling = {};
        temp.index = k++;
        temp.title = data[i].two_directory;
        temp.contents = data[i].content;
        choice = data[i].choice;
        choice[0].user_ans = 0;
        choice[1].user_ans = 0;
        temp.choice = choice;
        temp.filling = data[i].filling;
        temp.filling.user_ans = '';
        console.log('temp', temp);
        contents.push(temp);
      }
      if (i > 0 && (data[i - 1].one_directory == title && data[i].one_directory != title)) break;
    }
    console.log("小夫我出来啦", app.globalData.user_id);
    console.log(contents);
    wx.setStorage({
      data: contents,
      key: 'contents',
    })
    wx.setStorage({
      data: app.globalData.user_id,
      key: 'id',
    })

    wx.navigateTo({
      url: '../one/one',
    })

  },


  async get_user_info() {
    // console.log(app.globalData.user_id);
    let that = this;
    await wx.cloud.callFunction({
      name: 'get_all_user_mark',
    }).then(async res => {
      console.log("ppppdata:", res);
      let data = res.result.data;
      await that.set_rank(data);
    })
    // await this.update_user_data();
  },

  async set_python_study() {
    let that = this;
    let arr_state = {};
    console.log("????人呢？");
    await wx.cloud.callFunction({
      name: 'get_user_info',
      data: {
        id: app.globalData.user_id
      }
    }).then(async res => {
      console.log("????人呢？", res.result);
      let data = res.result.data[0];
      let temp = app.globalData.python_study;  //拿到全部内容
      console.log('data is null?', data);
      if (data.python_study == null) {
        console.log("小夫我要进来啦");
        let arr = {}  //用来存放用户的学习进度数组， 暂时使用这个名字
        for (let i = 0; i < temp.length; i++) {
          if(temp[i].choice == null) break;
          let t = {};
          let title = temp[i].two_directory;
          t.one = {flag : 0, user_ans :'', ans : temp[i].choice[0].ans};
          t.two = {flag  : 0, user_ans  :'', ans  : temp[i].choice[1].ans};
          t.three = {flag  : 0, user_ans  : '', ans  : temp[i].filling.ans};
          arr[title] = t;
        }
        arr_state = arr;
      } else arr_state = data.python_study;
      await that.update_user_data(arr_state);

    })
  },
  set_rank(data) {
    let arr = [];
    console.log("data:", data);
    for (let i = 0; i < data.length; i++) {
      let t = {};
      t.user_name = data[i].nick_name;
      t.user_img = data[i].avatar_url;
      if(data[i].integral == null) t.ac_num = 0;
      else t.ac_num = data[i].integral;
      t.user_id = i;
      console.log(t);
      arr.push(t);
    }
    function compare(property) {
      return function (a, b) {
        let value1 = a[property];
        let value2 = b[property];
        return value2 - value1;
      }
    }
    console.log(arr.sort(compare('ac_num')))
    let user_one_three = [];
    let user_sort = [];
    user_one_three[0] = arr[0];
    user_one_three[1] = arr[1];
    user_one_three[2] = arr[2];
    for(let  i = 0, j = 3; j<arr.length;j++, i++){
    user_sort[i] = arr[j];
    }
    this.setData({
      user_sort,
      user_one_three
    })
  },
  async update_user_data(arr) {
    let that = this
    await db.collection("user_info").where({
      _openid: app.globalData.user_id
    }).update({
      data: {
        python_study: arr
      },
    }).then(res => {
      console.log("小夫加油", res);
    })

  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})
