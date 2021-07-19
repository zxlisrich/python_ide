// pages/class/class.js
const app = getApp()
wx.cloud.init()
const db = wx.cloud.database()
let cnt = 0;
let Class = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: false,
    student_name: '',
    student_head: '',
    student_school: '',
    student_class: '',
    student_id: '',
    student_college: '',
  },
  async onLoad() {
    await this.get_info()
    console.log('d',Class);
    let objStr = JSON.stringify(Class);
    console.log(objStr);
    if (Class.isOk == true) {
      this.setData({
        student_name: Class['class_name'],
        student_school: Class['class_school'],
        student_id: Class['class_id'],
        student_name: Class['class_name'],
        student_class: Class['class_class'],
        student_college:Class['class_college'],
        isAuth: true
      })
    }else{
      Class.isOk = false;
    }
   
  },
  get_user_ans(e) {
    let id = e.currentTarget.id;
    let value = e.detail.value;
    if (value != undefined) {
      cnt++
      if (id == "class_school") {
        Class.class_school = value;
        this.setData({
          student_school: value
        })
      }
      else if (id == "class_college") {
        Class.class_college = value;
        this.setData({
          student_college: value
        })
      }
      else if (id == "class_name") {
        Class.class_name = value;
        this.setData({
          student_name: value
        })
      }
      else if (id == "class_class") {
        Class.class_class = value;
        this.setData({
          student_class: value
        })
      }
      else if (id == "class_id") {
        Class.class_id = value;
        this.setData({
          student_id: value
        })
      }
    }
  },


  submit() {
    if (cnt >= 5) {
      Class.isOk = true;
      this.update_user_data();
      this.setData({
        isAuth: true
      })
    } else {
      wx.showToast({
        title: '请把内容补充完整',
        icon: 'none',
        duration: 2000
      })
    }
  },

  sign_out() {
    cnt = 0;
    this.setData({
      isAuth: false
    })
    for (let key in Class) {
      if(key != 'isOk') Class[key] = '';
      else Class[key] = false
    }
    this.update_user_data();
    
  },
  async update_user_data() {
    let that = this
    await db.collection("user_info").where({
      _openid: app.globalData.user_id
    }).update({
      data: {
        school_info: Class
      },
    }).then(res => {
    })

  },
  async get_info(){
    let avatar_url = " ";
    await db.collection("user_info").where({ _openid: app.globalData.user_id }).get().then(res => {
      Class = res.data[0].school_info;
      avatar_url = res.data[0].avatar_url;
    })
    this.setData({
      student_head: avatar_url
    })
  }
})