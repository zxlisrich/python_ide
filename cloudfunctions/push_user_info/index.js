// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

    return await db.collection('user_info').doc(event.id)
    .update({
      data: {
        choice:event.choice,
        data_num:event.data_num
      },
    }).then(res =>{
      
    })
}