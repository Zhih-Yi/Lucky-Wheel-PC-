
let app = new Vue({
el: '#app',
data: {
prize1: [],//2017抽獎資訊
prize2:[],//2018抽獎資訊
display:'prize2017',//當前顯示
prizeContent:'',//中獎項目
Deg:0,//選轉角度
total1:20,//2017抽獎總數
total2:120,//2018抽獎總數
showPrize:false,//顯示中獎文字
transitionTime:'6s',//指針旋轉動畫秒數
},
methods: {
//繪出畫面扇形(處理扇型(6面及20面))
drawFan(index,prize){
//依抽獎項目數量推算一面扇形的面積
let deg = 360 / prize.length;
let tilt = -deg / 2;
let skewY = deg - 90;
//傳回旋轉與變形角度
return `transform:rotate(${tilt + index * deg}deg) skewY(${skewY}deg)`;

},
//畫上圖案
drawContent(index,prize){
//依抽獎項目數量推算一面扇形上獎品項目數量的面積
let deg = 360 / prize.length;
//處理傾斜與變形
let translate =
prize.length > 10 ? 'translate(10px, 180px)' : 'translate(78px, 55px)';
return `transform:skewY(${90 - deg}deg) rotate(${deg / 2}deg)${translate}`;

}
,
//剩餘獎項陣列，獎品抽完(數量number=0)不列入計算
generateIndex(prize) {
let indexArray = []
for (let i = 0; i < prize.length; i++) {
    if (prize[i].number != 0) indexArray.push(i)
}
return indexArray
},
//依中獎機率產生亂數
getRandom(prize,total){
const index = this.generateIndex(prize);
//?依中獎機率產生亂數
let num = Math.floor((Math.random() * total)/(total/index.length));
// 回傳 剩餘獎項陣列[隨機數字]，以得到正確的獎項。
return index[num];
},
getPrize(){
//指針旋轉
this.transitionTime="6s";
let current =this.display;
//重新抽獎隱藏結果
this.showPrize=false;
//隨機亂數
let random=0;
//轉五圈製造效果
let circle=5;
//一面扇形角度
let deg;
//選取的是2017抽獎或2018抽獎
let selector='';
//中獎內容
let prizeContent='';
//如果目前在2017抽獎畫面...
if(current==="prize2017"){
//2017一機率取抽獎亂數
random=this.getRandom(this.prize1,this.total1);
//每個獎項的扇形角度
deg= 360 / this.prize1.length;
//旋轉角度 轉x圈+亂數*單一獎項扇形角度
let rotate = circle * 360 + random * deg;
//總共旋轉角度(之前停下的角度也要列入計算)
this.Deg += rotate - (this.Deg % 360);
selector=".wheel2017";
//中獎商品名稱
prizeContent=this.prize1[random].prize;

}
else if(current==="prize2018"){
//2018抽獎(同上)
random=this.getRandom(this.prize2,this.total2);

    deg= 360 / this.prize2.length;
    let rotate = circle * 360 + random * deg
    this.Deg += rotate - (this.Deg % 360)
    selector=".wheel2018";
    prizeContent=this.prize2[random].id;

}
//畫面顯示中獎
let sectors= document.querySelectorAll(`${selector} .sector`);
//清除之前中獎樣式
sectors.forEach((value )=>{
value.classList.remove('active');   
})
//旋轉動畫並停在獎品上
document.querySelector(`${selector} .hand`).style.transform=`rotate(${this.Deg}deg)`;
//停在獎品上後顯示中獎項目
let vm=this;
setTimeout(function(){
    vm.prizeContent=prizeContent;
    sectors[random].classList.add("active"); 
    //顯示中獎項目文字
    vm.showPrize=true;
    //抽獎資料扣除已中獎商品
    if(current==="prize2018"){
    if (vm.prize2[random].number > 0) {
        vm.prize2[random].number -= 1
        }
    }else if(current==="prize2017"){
    if (vm.prize1[random].number > 0) {
        vm.prize1[random].number -= 1
        }
    }
    
},6000)      
},
//重新開始
reset(){
//清空陣列(已變動數量)
this.prize1=[];
this.prize2=[];
//重新取得資料(包含畫面重繪)
this.getJSON();
//不顯示中獎文字
this.showPrize=false;
//重新開始指針歸零 不需要動畫
this.transitionTime="0s";
this.Deg=0;
document.querySelector(`.wheel2017 .hand`).style.transform=`rotate(${this.Deg}deg)`;
document.querySelector(`.wheel2018 .hand`).style.transform=`rotate(${this.Deg}deg)`;
},
getJSON(){
//取得獎品資料
let vm=this;  
//取得2018抽獎資料
fetch('2018prize.json').then((response)=>{
return response.json();
}).then((data2)=>{

vm.prize2=data2;
}).catch((err)=>{
console.log(err);
});

//取得2017中獎資料
fetch('2017prize.json')
.then(function(response) {
return response.json();
})
.then(function(data) {
vm.prize1=data;
}).catch((err)=>{
console.log(err);
});
},
},
mounted:function(){
//載入後取得資料
this.getJSON();
},


})