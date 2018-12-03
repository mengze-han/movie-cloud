const app = getApp()

let commentType

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromWho: null,
    movieDetail: null,
    star: app.globalData.star
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("影评详情")
    this.setData({
      fromWho: options,
      star: app.globalData.star
    })
    this.getMovieInfo()
    console.log(this.data.fromWho)
  },

  getMovieInfo() {
      wx.cloud.callFunction({
        name: 'movieInfo',
        data: {
          id: Number(this.data.fromWho.movieId)
        },
        success: res => {
          this.setData({
            movieDetail: res.result.data[0]
          })
          console.log("11")
          console.log(res.result.data[0])
        },
        fail: err => {
          console.error('[云函数] [movieInfo] 调用失败', err)
        }
      })
  },

  star() {  
    //收藏影评按钮
      //star是收藏标志位，如果star是false，是待收藏状态，
      //star是true是已经收藏，再次点击取消收藏
      let star = this.data.star
      let user = app.globalData.openid
      let { username, avatar, content, type } = this.data.fromWho
      console.log(username, avatar, content, type)
      let { id, title, image } = this.data.movieDetail
      console.log(id, title, image)

      this.setData({
        star: !star
      }),
      app.globalData.star = this.data.star

      if (!star) {
        wx.cloud.callFunction({
          name: 'star',
          data: {
            fromWho: username,
            starAvatar: avatar,
            movieId: id,
            movieTitle: title,
            movieImage: image,
            type,
            content,
            user,
          },
          success: res => {
            console.log('提交成功！')
            console.log(res)
          },
          fail: err => {
            console.error('[云函数] [star] 调用失败', err)
          }
        })
      } else {
        wx.cloud.callFunction({
          name: 'unstar',
          data: {
            fromWho: username,
            movieId: id,
            user,
          },
          success: res => {
            console.log('提交成功！')
            console.log(res)
          },
          fail: err => {
            console.error('[云函数] [unstar] 调用失败', err)
          }
        })
      }
  },


  //添加评论函数，按键捕获
  addComment() {
    console.log("movie detail: 开始文字评论..")
    let movieId = this.data.movieDetail.id

    //弹出选择框，并且做出相应的操作
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex === 0) {
          commentType = 'text'
          console.log(commentType)
        } else {
          commentType = 'audio'
          console.log(commentType)
        }
        //选择完成之后跳转到编辑评论的页面，并且传递参数电影id和评论的类型
        wx.navigateTo({
          url: `../comment-edit/comment-edit?id=${movieId}&commentType=${commentType}`,
        })
        // console.log(typeof (movieId), typeof (commentType))
        console.log("movie detail: 正在跳转到影评编辑页面...")
      },
      fail(err) {
        console.log(err.errMsg)
      }
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