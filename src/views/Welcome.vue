<template>
  <div id="welcome">
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>Welcome</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="welcomeContent">
        <span>W</span>
        <span>e</span>
        <span>l</span>
        <span>c</span>
        <span>o</span>
        <span>m</span>
        <span>e</span>
        <span>~</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Welcome'
}
</script>

<style lang="less" scoped>
@keyframes welcome{
  0% {transform: rotateZ(0deg);}
  25% {transform: rotateZ(10deg);}
  30% {transform: rotateZ(10deg);}
  50% {transform: rotateZ(0deg);}
  75% {transform: rotateZ(-7deg);}
  80% {transform: rotateZ(-7deg);}
  100% {transform: rotateZ(0deg);}
}

.el-card {
  width: 100%;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.welcomeContent {
  font-size: 140px;
  transform-style: preserve-3d;
  color: #fff;
  animation: welcome 1.5s linear infinite;
}
.welcomeContent span {
  text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #ddd,
    0px 2px 1px #d6d6d6,
    0px 3px 1px #ccc,
    0px 4px 1px #c5c5c5,
    0px 5px 1px #c1c1c1,
    0px 6px 1px #bbb,
    0px 7px 1px #777,
    0px 8px 3px rgba(100, 100, 100, 0.4),
    0px 9px 5px rgba(100, 100, 100, 0.1),
    0px 10px 7px rgba(100, 100, 100, 0.15),
    0px 11px 9px rgba(100, 100, 100, 0.2),
    0px 12px 11px rgba(100, 100, 100, 0.25),
    0px 13px 15px rgba(100, 100, 100, 0.3);
  transition: all .1s linear;
}
.welcomeContent span:hover {
  text-shadow: 0px 0px 2px #686868,
    0px 1px 1px #ddd,
    0px 2px 1px #d6d6d6,
    0px 3px 1px #ccc,
    0px 4px 1px #c5c5c5,
    0px 5px 1px #c1c1c1,
    0px 6px 1px #bbb,
    0px 7px 1px #777,
    0px 8px 3px #fff, 
    0px 9px 5px #fff, 
    0px 10px 7px #fff, 
    0px 11px 9px #fff, 
    0px 12px 11px #fff, 
    0px 13px 15px #fff;
}
</style>


