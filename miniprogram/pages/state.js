const State = {
  Unknown   : 'Unknown',  // 未知，接口未返回
  Stranger  : 'Stranger', // 未加入
  Checking  : 'Checking', // 待审核
  Joined    : 'Joined',   // 已加入
  Rejected  : 'Rejected', // 被拒绝
  Creating  : 'Creating', // 创建审核中
  Created   : 'Created',  // 创建完成
}

export { State as default}