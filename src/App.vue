<template>
  <head></head>


  <div>
    <div class="merchantView">

      <div class="wrapper">
  
  

        <div v-if="!myPlayer?.isSheriff">

          <div class="card-display" v-if="myPlayer?.hands && !myPlayer.isSheriff" >
            <template v-for="(item,i) in myPlayer.hands" :key="i">
              <div class="card small-card" :class="item.type" :style="[((item.trashing) && this.gameState == 'selecting') ||  ((!item.loading) && (this.gameState == 'loading' || this.gameState == 'declaring')) || ( !item.loading && this.gameState == 'waiting' )  ? 'opacity: 0.4' : '']" @click="toggleItem(i)" v-if="item">
              <div class="container">
                <div class="reward badge">{{item.reward}}</div>
                <!-- <span class="badge badge-pill badge-warning">{{item.reward}}</span> -->
                <img :src="getImgSrc(item.name)" alt="">
                <div class="penalty badge">{{item.penalty}}</div>
                <span class="name">
                  {{item.name}}
                </span>
              </div>
            </div>
    
            <div crlass="line-break" v-if="i % 3 == 0"></div>
            </template>
          </div>
    
          <div class="controller" style="margin-top: 10px">

            <div >
              <!-- <strong style="margin: 2em">{{gameState}}</strong><br> -->
              

              <div v-if="gameState == 'selecting'">
                Choose which cards to replace
              </div>

              <div  v-if="gameState == 'loading'">
                Choose which cards to take to the market
              </div>

              <div class="button-wrapper">
                <div><button @click="goNext()" class="button1" v-if="gameState== 'selecting'">Ready</button></div>
                <div><button @click="submit()" class="button1" v-if="gameState== 'loading'">Submit</button></div>
                <div v-if="gameState== 'declaring'"><button @click="goback()" class="back"  style="margin-right:30px">go back</button>
                  I'm taking {{loadingNum}} of ... 
                </div>

                <div v-if="developing" style="margin-left: 30px">
                  <button @click="autoSubmit()" class="back">skip submit</button>
                </div>
              </div>
      
              <div class="declratng" v-if="gameState == 'declaring'">
                
                <section class="radio">
                  <div @click="declare('apple')"><img src="../public/pics/apple.svg" alt=""></div>
                  <div @click="declare('cheese')"><img src="../public/pics/cheese.svg" alt=""></div>
                  <div @click="declare('bread')"><img src="../public/pics/bread.svg" alt=""></div>
                  <div @click="declare('chicken')"><img src="../public/pics/chicken.svg" alt=""> </div>
  
                  <!-- <input type="radio" v-model="declaredItem" value="apple"><img src="../public/pics/apple.svg" alt="">
                  <input type="radio" v-model="declaredItem" value="cheese"><img src="../public/pics/cheese.svg" alt="">
                  <input type="radio" v-model="declaredItem" value="bread"><img src="../public/pics/bread.svg" alt="">
                  <input type="radio" v-model="declaredItem" value="chicken"><img src="../public/pics/chicken.svg" alt=""> -->
                  <br/>
                </section>
                <hr>
              
                
              </div>

              <div v-if="gameState == 'waiting'">
                waiting now ... <br>
                <strong>You declared {{myPlayer.declaredNum}} {{myPlayer.declaredItem}}</strong>
                <!-- <br> -->
                <hr>
                offring a bribe for the sheriff?
                <br>
                <input type="text" id="name" name="name" required minlength="4" maxlength="8"  v-model="bribingCost" style="width: 70px"> coins
                <!-- <input type="number" placeholder="" style="width: 10px" v-model="bribingCost">  -->
                <button class="button" style="background-color:#ffcc33;color:black;margin-left:10px" @click="bribeRequest()">request</button>
                <br>
                <span v-if="lastRequest">{{lastRequest}}</span>
              </div>

              <div v-if="gameState == 'done'">
                waiting for other players
              </div>



            </div>

          </div>
        </div>
        
        <div v-if="myPlayer?.isSheriff" >
          <div class="sheriff-table">
            
            
            <table v-if="players">
              <tr>
                <th><img src="../public/pics/usrer.png" alt=""></th>
                <th><img src="../public/pics/box-svgrepo-com.svg" alt=""></th>
                <th>pass</th>
                <th>open</th>
                <th><img src="../public/pics/shush.png" alt="" style="width: 40px; height: auto; padding: 0"></th>
              </tr>
              <template  v-for="(player,i) in reorderedList" :key="i">

                <tr v-if="player.name !== myPlayer.name && player.state == 'through'" style="opacity:0.3">
                  <td>{{player.name}}</td>
                  <td>Done</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr v-if="player.name !== myPlayer.name && player.state !== 'through'">

                  <template  v-if="!player.waiting">
                    <td>{{player.name}} </td>
                    <td>
                      <div  class="loader"></div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </template>
                  <template  v-else>
                    <td>{{player.name}}</td>
                    <td>
                      <div>{{player.declaredNum}} <img class="icon" :src="getImgUrl(player.declaredItem)" alt="">
                      </div>
                    </td>
                    <td><button @click="passBox(player)"  class="button" style="background-color: green; color: white">&#10003;</button></td>
                    <td><button @click="openBox(player)" class="button" style="background-color: crimson; color: white">&#x2717;</button></td>
                    <td @click="accpetBribe(player)"><strong v-if="player?.bribingCost > 0">{{player?.bribingCost}}?</strong></td>
                  </template>
                </tr>

              </template>
              
            </table>
          </div>

          <div v-if="openingCards" class="opneningCards">
            <strong  style="color:black">Opening {{target}}'s cards</strong>
            <div >
              <template v-for="(item,i) in openingCards" :key="i">
                <div class="card">
                  <img :src="getImgUrl(item.name)" :class="getDelayAnimation(i)" alt="">
                  <br>
                </div>
              </template>
            </div>
          </div>



          
        </div> 
  
        
        
        
      </div>
  
      <div class="players-info" v-if="reorderedList">
        <table>
          <tr>
            <th><img src="../public/pics/usrer.png" alt=""></th>
            <th><img src="../public/pics/apple.svg" alt=""></th>
            <th><img src="../public/pics/cheese.svg" alt=""></th>
            <th><img src="../public/pics/bread.svg" alt=""></th>
            <th><img src="../public/pics/chicken.svg" alt=""></th>
            <th><img src="../public/pics/handcuffs.svg" alt=""></th>
            <th><img src="../public/pics/coin.svg" alt=""></th>
  
          </tr>
          <template  v-for="(player,i) in reorderedList" :key="i">
            <tr>
              <td><span :style="[player.name == username ? 'color:darkgreen' : '']">{{player.name}}</span> <span v-if="player.isSheriff"><i class="fa fa-star-o" style="color:yellow"></i></span></td>
              <td>{{player.securedItems?.apple.length}}</td>
              <td>{{player.securedItems?.cheese.length}}</td>
              <td>{{player.securedItems?.bread.length}}</td>
              <td>{{player.securedItems?.chicken.length}}</td>
              <td>{{player.securedItems?.illegal.length}}</td>
              <td>{{player.balance}}</td>
            </tr>
          </template>
          
        </table>
      </div>

      <div style="font-size:66%;"><!-- for the bottom --> 

        <div style="position:absolute; bottom:5px; left: 20px;">
          #{{roomCode}}. Hello {{username}}! [{{currentRound}}/ {{finalRound}}]
        </div>
  
        <div style="position:absolute; bottom:5px; right: 20px;">
          <i class="fa fa-question-circle" style="font-size:20px;color:red;"></i>
        </div>
      </div>


    </div>



  </div>



  <transition name="fade" >
    <div class='modal-overlay fade-in' v-if="showModal" style="height: 100vh">
      
        <div class="modal" style=" transition : all 0.6s ease 0s;">
          
          
          <div v-if="modalStatus == 1">
            <form onsubmit="event.preventDefault()">

              <label>Username</label>
              <input type="text" placeholder="Type username.." v-model="username" >

              <span v-if="modalWarning" class="warning">{{modalWarning}}</span>
              <button @click="signUp()" class="create" >Sign Up</button>
              <button @click="generateRandomUsername()" class="join" >Random name</button>

            </form>
          </div>

          <div v-if="modalStatus == 2">
            <form onsubmit="event.preventDefault()">
              <button @click="createARoom()" class="create" >Create a Room</button>
              OR<br>
              <label>Room Code</label>
              <input type="number" placeholder="Type room code.." v-model="roomCode"  autocapitalize="none" >
              <button @click="joinARoom()" class="join">Join a Room</button>

            </form>
          </div>

          <div v-if="modalStatus == 3">
            <form onsubmit="event.preventDefault()">
              <span>Welcome {{username}} !</span><br>
              <span>Currently {{members.length}}/9</span><br>
                <span>Room Code: <strong style="font-size:175%">{{roomCode}}</strong></span><br>

                <button v-if="onlineRoll == 'host'" :style="[members.length >= 3 ? '' : 'opacity: 0.2']" @click="closeTheRoom" class="closeButton">Close the Room</button><br>

                <div v-if="onlineStatus == 'waiting'" class="loader"></div>

                <button v-if="!members?.includes(username)"  @click="joinARoom" class="closeButton">Try again</button>

                <br>

                <!-- <samp>{{members}}</samp> -->

                <template v-for="(player,index) in members" :key="index" style="text-align:left">
                  <span :style="username==player ? 'color:red' : ''">{{index+1}}. {{player}}</span><br>

                </template>

                
            </form>
          </div>

          <div v-if="modalStatus == 4 " style="color:black">
            so you were judged by the sheriff and this is what happens
            <button @click="showModal = false"> close</button>
          </div>

          <div v-if="modalStatus == 10 " style="color:black">

            <section  v-if="myPlayer.didBoxOpen">
              <span> Your box was opened</span>
              <hr>
              <section v-if="!myPlayer.wasTruth">
                <span > AND You were lying</span>
                <br>
                <strong>You had to pay {{myPlayer.penaltyCost}} for the penalty </strong>
                <br>
                <strong v-if="myPlayer.currentReward > 0">You got paid {{myPlayer.currentReward}} for the declared items </strong>
              </section>
            </section>

            <section  v-if="!myPlayer.didBoxOpen">
              <span v-if="myPlayer.latestSituation =='bribe taken'">Your bribe was accepeted,Your box didn't open </span>
              <span v-if="myPlayer.bribingCost >0 || !myPlayer.didBoxOpen"> Sheriff didn't open your box</span>
              <br>

              <strong>You got paid {{myPlayer.currentReward}} for the items</strong>
            </section>
            
            
            <hr>

            <button @click="closeModal()" class="button" style="background-color:#FF6F3C;">Close</button>

          </div>

          <div v-if="modalStatus == 11 " style="color:black">
            <span>{{theTarget.name}} was telling the truth</span>
            <br>
            <strong>You had to pay {{penaltyCost}}</strong>

            <hr>

            <button @click="closeModal()" class="button" style="background-color:crimson;">Close</button>

          </div>

          <div v-if="modalStatus == 12 " style="color:black" class='lying'>
            <span>{{theTarget.name}} was not telling the truth</span>
            <br>
            <strong>{{theTarget.name}} had to pay {{penaltyCost}}</strong>

            <hr>
            <span>{{theTarget.name}} was saying {{lyingNum}} <img :src="getImgSrc(lyingItem)" alt=""></span>
            <br>
            <span>but this is what {{theTarget.name}} had</span>
            <br>

            <template v-for="(item, i) in lyingList" :key='i'>
              <img :src="getImgSrc(item.name, item.illegal)" alt="" style="padding:5px">
            </template>

            <hr>

            <button @click="closeModal()" class="button" style="background-color:crimson;">Close</button>

          </div>

          <div v-if="modalStatus == 15 " style="color:black">
            <span>{{currentSheriff}} is new Sheriff now!</span>

            <hr>

            <button @click="showingNewSheriff = false; showModal = false " class="button" style="background-color:forestgreen;">Close</button>

          </div>

          <div v-if="modalStatus == 20 " style="color:black; text-align:left" class='summary'>
            Winner is <strong style="color: crimson; font-size: 125%">{{generalData.winner}}!</strong>
            <hr>
            <template v-for="(player,i) in reorderedList" :key=i>
              <span>{{player.name}}: <strong>{{player.balance}}pt</strong>   ({{player.illegalReward}}pt from <img src="../public/pics/handcuffs.svg" alt=""> )</span><br>
            </template>

            <hr>
            
            <span><img src="../public/pics/apple.svg" alt=""> <img src="../public/pics/king.svg" alt=""> (20pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.appleKing" :key=i>
                <strong style="color:GoldenRod; font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.appleKing.length ==0"> nobody</span>
            </span><br>

            <span><img src="../public/pics/apple.svg" alt=""> <img src="../public/pics/queen.svg" alt=""> (10pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.appleQueen" :key=i>
                <strong style="color:Grey">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.appleQueen.length ==0"> nobody</span>
            </span><br><br>

            <span><img src="../public/pics/cheese.svg" alt=""> <img src="../public/pics/king.svg" alt=""> (15pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.cheeseKing" :key=i>
                <strong style="color:GoldenRod; font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.cheeseKing.length ==0"> nobody</span>
            </span><br>

            <span><img src="../public/pics/cheese.svg" alt=""> <img src="../public/pics/queen.svg" alt=""> (10pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.cheeseQueen" :key=i>
                <strong style="color:Grey;font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.cheeseQueen.length ==0"> nobody</span>
            </span><br><br>

            <span><img src="../public/pics/bread.svg" alt=""> <img src="../public/pics/king.svg" alt=""> (15pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.breadKing" :key=i>
                <strong style="color:GoldenRod; font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.breadKing.length ==0"> nobody</span>
            </span><br>

            <span><img src="../public/pics/bread.svg" alt=""> <img src="../public/pics/queen.svg" alt=""> (10pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.breadQueen" :key=i>
                <strong style="color:Grey;font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.breadQueen.length ==0"> nobody</span>
            </span><br><br>

            
            

            <span><img src="../public/pics/chicken.svg" alt=""> <img src="../public/pics/king.svg" alt=""> king (10pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.chickenKing" :key=i>
                <strong style="color:GoldenRod; font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.chickenKing.length ==0"> nobody</span>
            </span><br>

            <span><img src="../public/pics/chicken.svg" alt=""> <img src="../public/pics/queen.svg" alt=""> (5pt): 
              <template v-for="(player,i) in generalData?.kingsAndQueens.chickenQueen" :key=i>
                <strong style="color:Grey;font-size:120%">{{player}}, </strong>
              </template>
              <span v-if="generalData?.kingsAndQueens.chickenQueen.length ==0"> nobody</span>
            </span><br><br>

            
            
            
          </div>

          

          


        </div>
    </div>

  </transition>

</template>

<script>
import {cards} from './const/cards.js'
import db from './firebase.js';
import AOS from "aos";

var randomWords = require('random-words');
import { copyText } from 'vue3-clipboard'

export default {
  name: 'App',
  data(){
    return{
      cards,
      players : {},
      roomCode: undefined,
      gameState: 'selecting',

      tempName: 'playerOne',
      removeableIndex: [],

      // developing: false,
      developing: true,
      isHost: false,

      declaredItem: undefined,

      warning: undefined,
      modalWarning: undefined,
      


      showModal: true,
      modalStatus: 1,

      username: undefined,
      members: [],
      winner: '',
      onlineRoll: undefined,


      skipFlag: false,

      hands: [],

      onlineStatus: undefined,
      isAdmin: false,
      gameStatus: undefined,

      bribingCost: 0,
      lastRequest: undefined,

      openingCards: undefined,
      target: undefined,
      progressNum: 0,
      // roomCode

      currentRound: 0,

      globalList: [],
      showingNewSheriff: false,
      theTarget: undefined,
      wasTruth: undefined,
      penaltyCost: undefined,

      showingSummary: false,
      generalData: undefined,

      lyingList: [],
      lyingItem: undefined,
      lyingNum: undefined,



      
    }
  },
  methods:{
    
    setup(){
      if(this.developing) this.modalStatus++
    },
    getSixCards(){
      let list = []
      let count =0 
      let num 
      while(count < 6){
        num = Math.random()

        if(num< 0.1764){
          list.push({type:'legal',name: 'apple',reward: 2, penalty: 2,  trashing: false, loading: false })
        }else if(num < 0.3529){
          list.push({type:'legal',name: 'cheese',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.5293){
          list.push({type:'legal',name: 'bread',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.7057){
          list.push({type:'legal',name: 'chicken',reward: 4, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.77922){
          list.push({type:'illegal',name: 'pepper',reward: 6, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.85274){
          list.push({type:'illegal',name: 'liquor',reward: 7, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.92626){
          list.push({type:'illegal',name: 'silk',reward: 8, penalty: 4,  trashing: false, loading: false },)
        }else {
          list.push({type:'illegal',name: 'crossbow',reward: 9, penalty: 4,  trashing: false, loading: false },)
        }

        count++
        
      }
      return list
    },
    pickOneFromPile(){
      let count = 0
      let index = undefined
      let max = 1000

      while(count < max){
        index = Math.floor(Math.random()* this.cards.length)
        // console.log(`index: ${index}`)
        if(this.cards[index].location == 'piles') return index
        count++
      }

    },
    rePick(){
      // remove from the array
      let array = []
      // let limit = this.trashNumkkk0k0k0kk0
      for(let i in this.myPlayer.hands){
        if(this.myPlayer.hands[i].trashing){
          i = parseInt(i)
          array.push(i)
        }
      }
      this.removeableIndex = array

      // let actualIndex
      for (var i = this.removeableIndex.length -1; i >= 0; i--){
        // actualIndex = this.myPlayer.hands[this.removeableIndex[i]].index
        this.myPlayer.hands.splice(this.removeableIndex[i],1);
      }

      while(this.myPlayer.hands.length < 6){
        let num = Math.random()

        if(num< 0.1764){
          this.myPlayer.hands.push({type:'legal',name: 'apple',reward: 2, penalty: 2,  trashing: false, loading: false })
        }else if(num < 0.3529){
          this.myPlayer.hands.push({type:'legal',name: 'cheese',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.5293){
          this.myPlayer.hands.push({type:'legal',name: 'bread',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.7057){
          this.myPlayer.hands.push({type:'legal',name: 'chicken',reward: 4, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.77922){
          this.myPlayer.hands.push({type:'illegal',name: 'pepper',reward: 6, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.85274){
          this.myPlayer.hands.push({type:'illegal',name: 'liquor',reward: 7, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.92626){
          this.myPlayer.hands.push({type:'illegal',name: 'silk',reward: 8, penalty: 4,  trashing: false, loading: false },)
        }else {
          this.myPlayer.hands.push({type:'illegal',name: 'crossbow',reward: 9, penalty: 4,  trashing: false, loading: false },)
        }
      }
      
      // add it using the random num 
      // let count = 0
      // let index 
      // while(count< limit){
      //   index= this.pickOneFromPile()
        
      //   // name.hands.push(this.cards[index])
      //   // console.log(this.cards[index])
      //   this.myPlayer.hands.push(this.cards[index])
      //   this.cards[index].location = this.tempName
      //   count++
      // }
      

    },
    reRepick(player){
            // remove from the array
      let array = []
      // let limit = this.trashNum
      for(let i in player.hands){
        if(player.hands[i].loading){
          i = parseInt(i)
          array.push(i)
        }
      }
      this.removeableIndex = array

      // let actualIndex
      for (var i = this.removeableIndex.length -1; i >= 0; i--){
        // actualIndex = this.myPlayer.hands[this.removeableIndex[i]].index
        player.hands.splice(this.removeableIndex[i],1);
      }

      while(player.hands.length < 6){
        let num = Math.random()

        if(num< 0.1764){
          player.hands.push({type:'legal',name: 'apple',reward: 2, penalty: 2,  trashing: false, loading: false })
        }else if(num < 0.3529){
          player.hands.push({type:'legal',name: 'cheese',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.5293){
          player.hands.push({type:'legal',name: 'bread',reward: 3, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.7057){
          player.hands.push({type:'legal',name: 'chicken',reward: 4, penalty: 2,  trashing: false, loading: false },)
        }else if(num < 0.77922){
          player.hands.push({type:'illegal',name: 'pepper',reward: 6, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.85274){
          player.hands.push({type:'illegal',name: 'liquor',reward: 7, penalty: 4,  trashing: false, loading: false },)
        }else if(num < 0.92626){
          player.hands.push({type:'illegal',name: 'silk',reward: 8, penalty: 4,  trashing: false, loading: false },)
        }else {
          player.hands.push({type:'illegal',name: 'crossbow',reward: 9, penalty: 4,  trashing: false, loading: false },)
        }
      }

    },
    getImgSrc(name){
      return require(`../public/pics/${name}.svg`)
    },
    toggleItem(i){
      if(this.gameState  == 'selecting'){
        this.myPlayer.hands[i].trashing = !this.myPlayer.hands[i].trashing
      }

      if(this.gameState  == 'loading'){
        this.myPlayer.hands[i].loading = !this.myPlayer.hands[i].loading
      }
    },
    goNext(){
      // let text;
      if(this.trashNum == 0 && confirm(`Are you sure not changing your cards?`) == true){
        this.gameState = 'loading' 
        return
      }else if(this.trashNum == 0){
        return
      }

      if(confirm(`Changing ${this.trashNum} cards?`) == true){
        this.rePick()
        console.log(this.myPlayer.hands)
        this.gameState = 'loading' 
      }
      

    },

    submit(){
      if(this.loadingNum == 6){
        alert('You loading item number has to be betweem 1 and 5')
        return
      }

      if(this.loadingNum == 0){
        alert('You loading item number has to be betweem 1 and 5')
        return
      }

      if( confirm(`Are you sure you are taking these ${this.loadingNum} items?`) == true){
        this.gameState = 'declaring' 
        return
      }
    },
    declare(item){
      if(confirm(`Are you declaring them as ${this.loadingNum} ${item}?`)){
        this.gameState = 'waiting'
        this.declaredItem = item
        this.myPlayer.waiting = true
        this.myPlayer.declaredItem = item
        this.myPlayer.declaredNum= this.loadingNum
        this.myPlayer.state= 'being judged'

        this.updatingData()
      }
    },
    goback(){
      this.gameState = 'loading' 
    },

    skipping(){
      let array = [0,1,2,3,4,5]
      let index

      let count = 0
      while(count <6){
        index = Math.floor(Math.random()* array.length)
        this.myPlayer.hands[index].loading = true
        count++
      }
      this.gameState = 'declaring'
      // this.myPlayer.hands[3]
      // this.myPlayer.hands[4]
      // this.myPlayer.hands[5]
    },



    // ---------------------------------------------
    generateRandomUsername(){
      this.username =randomWords();
    },
    generateRoomCode(){
      var randomChars = '0123456789';
			var result = '';
      var char = null;
			for ( var i = 0; i < 5; i++ ) {

        char = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        if(char === 'l' || char === 'I' || char === 'o'  || char === 'O' || char === '0'){
          // since it is really hard to distinguishj I and l
          // console.log(`I hate ${char} || ${i}`) 
          i--;
        }else{
					result += char
        }
			}
      return result
    },
    signUp(){
      if(this.username == ''){
        this.modalWarning = 'Name cannot be empty'
        return 
      }
      
      if(this.username == 'skipping'){
        this.modalWarning = 'Name cannot be skipping'
        return 
      }

      localStorage.username = this.username

      this.modalStatus++
    },
    createARoom(){
      this.isHost = true
      this.warning = undefined
      let result = this.generateRoomCode()
      this.skipFlag = false
      

      let r= confirm(`Are you ready to create a room "${result}"?`);
      if(!r){
        // this.movingRobber = false;
        return;
      }

      

      this.members.push(this.username)
      this.onlineRoll = 'host'
      localStorage.userName = this.userName

      // console.log('sending data')
      const ref = db.collection('rooms')
      ref.doc(`${result}`).set({
        // TotalNum: this.userNum 
        winner: this.winner,
        hostName: this.username,
        gameStatus: 'waiting',
        members: JSON.stringify([this.username]),
        detailData: JSON.stringify([{waitingList: [], players: [], gameStatus: 'waiting'}]),

      })
      this.roomCode = result
      this.modalStatus++
      this.onlineStatus = 'waiting'
      this.isAdmin = true

      copyText(`${this.roomCode}`)
      console.clear()
      this.ReciveTheData()


    },
    joinARoom(){
      console.log('trying to join ' + this.roomCode )

      var docRef = db.collection(`rooms`).doc(`${this.roomCode}`);

      docRef.get().then((doc) => {
          if (doc.exists) {
            this.members = JSON.parse(doc.data().members)
            if(!this.members.includes(this.username)) this.members.push(this.username)
            this.modalStatus = 3
            this.onlineRoll = 'guest'

            docRef.update({
              members: JSON.stringify(this.members),
            })
            // this.countingToStartGame()

            this.onlineStatus = 'waiting'
            this.ReciveTheData()
            return
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });

      this.onlineRoll = 'guest'

    },
    closeTheRoom(){
      if(this.members.length <4) return

      this.multiAssignRoles()

      let list = []
      let count = 0
      while(count < 3){
        for(let i in this.globalList){
          list.push(this.globalList[i])
        }
        count++
      }

      // sending the data for the first time
      this.detailData =[{gameStatus: 'ready'}]
      const ref = db.collection('rooms')
      ref.doc(`${this.roomCode}`).update({
        gameStatus: 'playing',
        players: this.players,
        detailData: JSON.stringify( this.detailData),
        officialLog: '',
        currentRound: 1,
        orderList: list
      })

      console.log('done closing room ----------------')

    },
    multiAssignRoles(){
      console.clear()

      // initalizing the obj
      let count = 0
      this.players = {}
      this.globalList = []
      while(count < this.members.length){
        this.globalList.push(this.members[count])
        this.players[this.members[count]] = {
          name: this.members[count], 
          isSheriff: false,
          securedItems: {apple: [],cheese: [],bread: [], chicken: [],illegal: []},
          caughtCount: 0,
          catchCount: 0,
          hands: this.getSixCards(),
          balance: 50,
          waiting: false,
          state: false,
          bribingCost:0,
          latestSituation: false,
          didBoxOpen: false,
          index: count,
          
        }

        if(count == 0){
          this.players[this.members[count]].isSheriff = true
        } 
          
        
        count++
      }

      
      return 

    


      
    },
    

    openBox(player){
      if( confirm(`Are you sure you want to check ${player.name}?`) == false){
        return
      }

      this.target = player.name
      this.theTarget = player
      player.didBoxOpen = true
      player.wasTruth = true
      player.penaltyCost = 0
      player.currentReward = 0
      this.showModal = true

      let list  =[]
      for(let i in player.hands){
        if(player.hands[i].loading){
          list.push(player.hands[i])
        }
      }

      let flag = true

      for(let i in list){
        if(list[i].name !== player.declaredItem){
          flag = false
        }
      }

      // when they were honest
      if(flag){
        let cost =0
        for(let i in list){
          cost+=list[i].penalty
        }
        // adding to the secure
        for(let i in player.hands){
          let item = player.hands[i]
          if(item.loading){
            player.securedItems[item.name].push(item)
            player.balance += item.reward
          }
        }
        this.wasTruth = true
        this.penaltyCost = cost
        this.myPlayer.balance -= cost
        this.modalStatus = 11
      }else{
        let cost =0
        player.wasTruth = false
        this.lyingList = list
        this.lyingItem =  player.declaredItem
        this.lyingNum = list.length
        
        for(let i in list){
          if(list[i].name !== player.declaredItem) {
            cost+=list[i].penalty
            player.balance -= list[i].penalty
          } 
        }
        player.penaltyCost = cost
         

        for(let i in list){
          let item = list[i]
          if(item.name == player.declaredItem) {
            player.securedItems[item.name].push(item)
            player.balance += item.reward
            player.currentReward += item.reward

          }
        }

        


        this.wasTruth = false
        this.penaltyCost = cost
        this.modalStatus = 12
      }

      this.reRepick(player)
      player.state = 'through'

      if(this.isFinalRound  ){
        if(this.waitingList?.length == this.reorderedList.length ){
          console.log('finishing game')
          this.finishGame()
          return 
        }
      }
      this.updatingWholeData()
    },
    passBox(player){
      player.didBoxOpen =false
      player.currentReward = 0
      for(let i in player.hands){
        let item = player.hands[i]
      
        if(item.loading){

          if(item.type == 'illegal'){
            player.securedItems['illegal'].push(item)
          }else{
            player.currentReward+= item.reward
            player.balance += item.reward
            player.securedItems[item.name].push(item)
          }
        }
      }

      this.reRepick(player)
      player.state = 'through'
      if(this.isFinalRound  ){
        if(this.waitingList?.length == this.reorderedList.length ){
          console.log('finishing game')
          this.modalStatus = 20
          this.finishGame()
          return 
        }
      }
      this.updatingWholeData()
    },


    bribeRequest(){
      if(!this.bribingCost ||  this.bribingCost ==0){
        alert('It has to be more than 0')
        return
      } 
      if(this.myPlayer.balance < this.bribingCost){
        alert('You do not have enought money')
        return
      } 
      if( confirm(`Are you sure you want to make a request to the shefiff with ${this.bribingCost} coins?`) == true){
        this.myPlayer.bribingCost = this.bribingCost
        this.updatingData()
        this.lastRequest = `You sent the bribe to the sheriff with ${this.bribingCost} coins`
      }else{
        return
      }



    },

    accpetBribe(player){
      // take out the money and let it pass
      this.passBox(player)
      if( confirm(`Are you sure you want to take the bribe from ${player.name}?`) == true){
        this.myPlayer.balance = this.myPlayer.balance +  parseInt(player.bribingCost)
        player.balance-= player.bribingCost
        player.bribingCost = 0
        player.latestSituation = 'bribe taken'

        this.passBox(player)
        this.lastRequest = `You sent the bribe to the sheriff with ${this.bribingCost} coins`
      }
    },

    ReciveTheData(){
      console.log(this.roomCode)
      
      db.collection("rooms").doc(`${this.roomCode}`)
      .onSnapshot((doc) => {
        this.generalData = doc.data()
        this.currentRound = parseInt(doc.data().currentRound)
        
        // joining room and wait until it closes
        if(this.progressNum ==0){
          this.gameStatus = doc.data().gameStatus
          this.members = JSON.parse(doc.data()?.members)
          // this.finalRound = parseInt(doc.data().finalRound)
          this.globalList = doc.data().orderList
          
          if(!this.members.includes(this.username)){
            this.joinARoom()
            return 
          }

          if(this.gameStatus == 'playing') this.progressNum = 1

        }

        // got the inital data to start the game
        if(this.progressNum == 1){
          this.gameStatus = 'playing'
          this.modalStatus++

          this.detailData = JSON.parse(doc.data().detailData)
          this.showModal = false
          this.players = doc.data().players
          

          this.progressNum = 2

          if(this.myPlayer.isSheriff) this.progressNum = 10

        }

        if(this.progressNum == 1.5){
          // this.gameStatus = 'playing'
          this.players = doc.data().players

          this.progressNum = 2

          if(this.myPlayer.isSheriff) this.progressNum = 10

        }


        // for the one that is figuring out what to take
        if(this.progressNum ==2){
          if(this.myPlayer.state == 'being judged') this.progressNum = 3
        }


        // this is after loading, currently getting judee
        if(this.progressNum == 3){
          this.players = doc.data().players 
          if(this.myPlayer.state == 'through') this.progressNum = 4
        }

        // after you got inspected 
        if(this.progressNum == 4){
          this.players = doc.data().players
          this.showModal = true
          this.modalStatus = 10
          this.progressNum = 5 

        }

        if(this.progressNum == 5){
          this.players = doc.data().players
          this.gameState = 'done'

          // if(this.waitingList.length == this.players.length -1)

        }

        // for the sheriff
        if(this.progressNum == 10){
          this.players = doc.data().players
          // do something to change the sheriff
          if(this.waitingList?.length == this.reorderedList.length ){
            this.progressNum = 11
          }
        } 


        if(this.progressNum == 11){
          // get the next sheriff and flip the shit
          const nextSheriff = this.players[this.globalList[this.currentRound]]
          console.log(`next sheriff is ${nextSheriff.name}`)
          this.myPlayer.isSheriff = false
          nextSheriff.isSheriff = true
          for(let i in this.players){
            let player = this.players[i]
            player.waiting =  false
            player.state = false
            player.bribingCost = 0
            player.latestSituation = false
            // player.didBoxOpen = false
          }


          const ref = db.collection('rooms')
          this.progressNum = 20
          ref.doc(`${this.roomCode}`).update({
            currentRound: this.currentRound+1,
            players: this.players
          })
        }
        

        if(this.progressNum == 20){
          this.progressNum = 1.5
        }

        

      
        
      
      })
    },



    updatingData(){
      console.log('updating')
      let updatingTarget = `players.${this.username}`
      console.log(this.username)
      const ref = db.collection('rooms')
      ref.doc(`${this.roomCode}`).update({
       [updatingTarget]: this.myPlayer,
       winner: 'nozo'
      })

    },

    updatingWholeData(){
      console.log('updating the whole')
      const ref = db.collection('rooms')
      ref.doc(`${this.roomCode}`).update({
       players: this.players
      })

    },
    
    pickKingAndQueen(){
      // pick apple
      let minimum =0 
      let appleKing =[]

      for(let i in this.players){
        let player = this.players[i]
        if(player.securedItems['apple'].length > 0){
          if(player.securedItems['apple'].length == minimum){
            appleKing.push(player.name)
          }

          if(player.securedItems['apple'].length > minimum){
            minimum = player.securedItems['apple'].length
            appleKing = []
            appleKing.push(player.name)
          }
        }
      }


      // pick queen
      let appleQueen =[]
      if(appleKing.length == 1){
        minimum =0 
        

        for(let i in this.players){
          let player = this.players[i]
          if(!appleKing.includes(player.name)){
            if(player.securedItems['apple'].length > 0){

              if(player.securedItems['apple'].length == minimum){
                appleQueen.push(player.name)
              }
  
              if(player.securedItems['apple'].length > minimum){
                minimum = player.securedItems['apple'].length
                appleQueen = [player.name]
              }
            }
          }
        }

      }

      console.log(appleKing)

      for(let i in appleKing){
        this.players[appleKing[i]].balance += 20
      }

      for(let i in appleQueen){
        this.players[appleQueen[i]].balance += 15
      }

      // pick chesse
      minimum =0 
      let cheeseKing =[]

      for(let i in this.players){
        let player = this.players[i]
        if(player.securedItems['cheese'].length > 0){
          if(player.securedItems['cheese'].length == minimum){
            cheeseKing.push(player.name)
          }

          if(player.securedItems['cheese'].length > minimum){
            minimum = player.securedItems['cheese'].length
            cheeseKing = [player.name]
          }
        }
      }


      // pick queen
      let cheeseQueen =[]
      if(cheeseKing.length == 1){
        minimum =0 
        

        for(let i in this.players){
          let player = this.players[i]
          if(!cheeseKing.includes(player.name)){
            if(player.securedItems['cheese'].length > 0){

              if(player.securedItems['cheese'].length == minimum){
                cheeseQueen.push(player.name)
              }
  
              if(player.securedItems['cheese'].length > minimum){
                minimum = player.securedItems['cheese'].length
                cheeseQueen = [player.name]
              }
            }
          }
        }

      }

      for(let i in cheeseKing){
        this.players[cheeseKing[i]].balance += 15
      }

      for(let i in cheeseQueen){
        this.players[cheeseQueen[i]].balance += 10
      }

      // pick bread
      minimum =0 
      let breadKing =[]

      for(let i in this.players){
        let player = this.players[i]
        if(player.securedItems['bread'].length > 0){
          if(player.securedItems['bread'].length == minimum){
            breadKing.push(player.name)
          }

          if(player.securedItems['bread'].length > minimum){
            minimum = player.securedItems['bread'].length
            breadKing = [player.name]
          }
        }
      }


      // pick queen
      let breadQueen =[]
      if(breadKing.length == 1){
        minimum =0 
        

        for(let i in this.players){
          let player = this.players[i]
          if(!breadKing.includes(player.name)){
            if(player.securedItems['bread'].length > 0){

              if(player.securedItems['bread'].length == minimum){
                breadQueen.push(player.name)
              }
  
              if(player.securedItems['bread'].length > minimum){
                minimum = player.securedItems['bread'].length
                breadQueen = [player.name]
              }
            }
          }
        }

      }

      for(let i in breadKing){
        this.players[breadKing[i]].balance += 15
      }

      for(let i in breadQueen){
        this.players[breadQueen[i]].balance += 10
      }

      // pick chicken
      minimum =0 
      let chickenKing =[]

      for(let i in this.players){
        let player = this.players[i]
        if(player.securedItems['chicken'].length > 0){
          if(player.securedItems['chicken'].length == minimum){
            chickenKing.push(player.name)
          }

          if(player.securedItems['chicken'].length > minimum){
            minimum = player.securedItems['chicken'].length
            chickenKing = [player.name]
          }
        }
      }


      // pick queen
      let chickenQueen =[]
      if(chickenKing.length == 1){
        minimum =0 
        

        for(let i in this.players){
          let player = this.players[i]
          if(!chickenKing.includes(player.name)){
            if(player.securedItems['chicken'].length > 0){

              if(player.securedItems['chicken'].length == minimum){
                chickenQueen.push(player.name)
              }
  
              if(player.securedItems['chicken'].length > minimum){
                minimum = player.securedItems['chicken'].length
                chickenQueen = [player.name]
              }
            }
          }
        }

      }

      for(let i in chickenKing){
        this.players[chickenKing[i]].balance += 10
      }

      for(let i in chickenQueen){
        this.players[chickenQueen[i]].balance += 5
      }

      return {
        appleKing,
        appleQueen,
        cheeseKing,
        cheeseQueen,
        breadKing,
        breadQueen,
        chickenKing,
        chickenQueen,
      }
  

    },

    finishGame(){

      
      
      // pick king and quenn for all the items
      let kingsAndQueens = this.pickKingAndQueen()


      // return the for the illegal shit
      let cost = 0
      for(let i in this.players){
        cost = 0
        let player = this.players[i]
        for(let j in player.securedItems['illegal']){
          let item = player.securedItems['illegal'][j]
          player.balance += item.reward
          cost+= item.reward
        }
        player.illegalReward = cost
      }

      let winner 
      let point = 0 
      for(let i in this.players){
        let player = this.players[i]
        if(player.balance > point){
          winner = player.name
          point = player.balance
        }
      }



      // you gotta update the whole thing
      console.log('updating the whole')
      const ref = db.collection('rooms')
      ref.doc(`${this.roomCode}`).update({
        kingsAndQueens,
        players: this.players,
        winner,

      })
    },





    getImgUrl(item) {
      return require('../public/pics/'+item+ '.svg')
    },
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
    async getDelayAnimation(){
      await this.sleep(500)
      return 'open'
    },

    closeModal(){
      this.showModal= false

      if(this.showingSummary){
        this.modalStatus = 20
        this.showModal= true
      }
      if(this.showingNewSheriff){
        this.showingNewSheriff = false
        this.modalStatus = 15
        this.showModal = true
      }

      
    },


    autoSubmit(){
      let min = Math.ceil(5);
      let max = Math.floor(0);
      let random = Math.floor(Math.random() * (max - min) + min);
      
      let count = 0
      while(count <= random){
        this.myPlayer.hands[count].loading = true
        count++
      }

      min = Math.ceil(4);
      max = Math.floor(0);
      random = Math.floor(Math.random() * (max - min) + min);
      switch(random){
        case 0:
          this.declaredItem = 'apple'
          break;

        case 1:
          this.declaredItem = 'cheese'
          break;

        case 2:
          this.declaredItem = 'bread'
          break;


        case 3:
          this.declaredItem = 'chicken'
          break;
      }

      
      this.gameState = 'waiting'
      this.myPlayer.waiting = true
      this.myPlayer.declaredItem =  this.declaredItem
      this.myPlayer.declaredNum= this.loadingNum
      this.myPlayer.state= 'being judged'

      this.updatingData()
      

      

    },


  },
  mounted(){
    console.clear()

    AOS.init()

    this.setup()

    this.generateRandomUsername()
  },

  watch:{
    roomCode(){
      if(!this.developing || !this.roomCode || this.isHost) return

      console.log(this.roomCode)
      if(this.roomCode >= 1000){
        console.log('oh yeah')
        this.joinARoom()

      }
    },
    currentRound(){
      if(!this.currentRound) return
      if(this.currentRound == 0 || this.currentRound == 1) return

      if(this.currentRound > this.finalRound){
        // this.finishGame()
        this.showModal = true
        this.showingSummary = true
        return 
      }

      this.gameState = 'selecting'
      this.bribingCost = 0
      if(!this.showModal) this.modalStatus = 15
      this.showModal = true
      this.showingNewSheriff = true
      


      this.progressNum = 20
    }
  },

  computed:{
    myPlayer(){
      if(this.gameStatus == 'playing'){
        // console.log(this.players)
        return this.players[this.username]
      }
      return undefined

    },
    trashNum(){
      let count = 0
      
      for(let i in this.myPlayer.hands){
        
        if(this.myPlayer.hands[i].trashing){
          count++
        } 
      }

      return count
    },

    loadingNum(){
      let count = 0
      
      for(let i in this.myPlayer.hands){
        
        if(this.myPlayer.hands[i].loading){
          count++
        } 
      }

      return count
    },

    latestData(){
      return this.detailData.slice(-1)[0]
    },

    waitingList(){
      // let count =0 
      let list = []
      for(let i in this.players){
        if(this.players[i].isSheriff){
          list.push(this.players[i].name)
        }else{
          if(this.players[i].state == 'through' ){
            list.push(this.players[i].name)
          }
        }
      }

      return list
      
    },

    reorderedList(){
      let list = []
      for(let i in this.players){
        list.push(this.players[i])
      }

      list.sort((a,b) => a.index - b.index);

      return list
    },

    finalRound(){
      if(this.currentRound == 0 || !this.currentRound) return 
      if(!this.reorderedList) return
      if(this.developing) return 2
      return this.reorderedList.length * 2
    },

    currentSheriff(){
      if(!this.players) return
      for(let i in this.players){
        if(this.players[i].isSheriff)
        return this.players[i].name
      }

      return undefined


    },

    isFinalRound(){
      if(this.currentRound == this.finalRound){
        return true
      }else{
        return false
      }
    }



    
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  /* margin-top: 60px; */
}

body{
  background-color: #155263
}


/* ------------------------------------------------- */
/* -------------------------------------------------------- */

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: 0; */
  /* height: 667px; */
  z-index: 98;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal {
  color: black;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  
  width: 75%;
  max-width: 400px;
  background-color: #f2f2f2;
  border-radius: 16px;
  
  padding: 25px;
}

.modal h1 {
  color: #222;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 15px;
}
 
.modal p {
  color: #666;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 15px;
}

.modal strong{
  content:"handsome";
  white-space: pre;
}

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: .4s;
}
@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

input[type=number], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.modal  .create {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 10px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal  .join {
  width: 100%;
  background-color: #6495ed;
  color: white;
  padding: 14px 20px;
  margin: 5px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal  .cancel {
  width: 100%;
  background-color: firebrick;
  color: white;
  padding: 14px 20px;
  margin: 20px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.tab-button {
  width: 25%;
  background-color:  #363945;
  color: white;
  padding: 10px 5px;
  margin: 10px 3%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.undo-button{
  float:right;
  margin-right:15px;
  width: auto;
  background-color: grey;
  color: white;
  padding: 4px 5px;
  /* margin: 5px 0; */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 80px;
  height: 80px;

  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;

  margin: 30px auto;

  
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* ------------------------------------------------- */


.wrapper{
  /* position:relative; */
  width: 90vw;
  /* height: 70vh; */
  margin: 10px auto 0;
  /* display:flex; */
  /* background-color: black; */
}

.card-display{
  display: flex;
  flex-flow: row wrap;
  /* align-content: space-between; */
  justify-content: space-between;
  /* background-color: white; */
  /* position: absolute; */
  /* bottom: 0; */
  
}

.line-break {
  width: 100%;
}

.card{
  position: relative;
  margin: 0.5em auto;
  transition: all 0.3s ease-in;
  
  /* margin: 100px; */
  /* margin-top:100px; */
}

.large-card{
  width: 10em;
  aspect-ratio : 2.5/ 3.5;
  border-radius: 0.5em;
  font-size: 125%;

  /* background-color: white; */
}

.small-card{
  width: 28%;
  aspect-ratio : 2.5/ 3.5;
  border-radius: 0.5em;
  font-size: 90%;
}

.legal{
  padding: 10%;
  position: relative;
  background: linear-gradient(to right, DarkGreen, ForestGreen);
  padding: 1%;
}

.illegal{
  padding: 10%;
  position: relative;
  background: linear-gradient(to right, Darkred, crimson);
  padding: 1%;
}

.card .container{
  position: absolute;
  background-color: LightSlateGray;
  width: 85%;
  z-index: 3;
  aspect-ratio : 2.5/ 3.5;
  margin: auto auto;
  top: 50%; 
  right: 50%;
  transform: translate(50%,-50%);
  border-radius: 5%;
}

.card .badge{
  aspect-ratio : 1/ 1;
  width: 25%;
  line-height: auto;
  border-radius: 50%;
  text-align: center;
}

.reward{
  float:right;
  background-color: GoldenRod;
  border: 2px solid Orange;
  color: black;

  margin-right: -5%;
  margin-top: -5%;
}

.penalty{
  position: absolute;
  bottom: 27.5%;
  left: -5%;

  background-color: firebrick;
  border: 2px solid crimson;
  color: white;
}

.card img{
  position: absolute;
  width: 50%;
  height: auto;

  top: 50%; 
  right: 50%;
  transform: translate(50%,-82.5%);
  
}

.card .name{
  position: absolute;
  bottom: 4%;
  right: 0%;
  font-size: 85%;

  right: 50%;
  transform: translateX(50%);
  background-color: DarkOrchid;
  padding: 5% 10%;
  border-radius: 5%;
  /* color:blue; */
}

/* controller-------------------------------------------- */
.controller{
  /* position: relative; */
}
.button-wrapper{
  width: 90vw; 
  margin: 10px auto;
  text-align: center;
  justify-content: center;
  display: flex; 
}

.button-wrapper button{
  padding: 10px;
  border-radius: 5px;
  color: white;
  border:none;
}

.button1 {
  background-color: seagreen;
}

.back {
  background-color: crimson;
  /* margin-right: 20px; */
}
.controller .radio{
  display: flex;
  justify-content: center;
}

.controller .radio img{
  padding: 10px;
  width: 40px;
  height: auto;
  filter: invert(99%) sepia(6%) saturate(2%) hue-rotate(264deg) brightness(104%) contrast(100%);
}




/* loader ---------------- */
.sheriff-table{

  color: black;
  font-weight: bold;
  /* position: absolute; */

  width: 90vw;

  /* top: 25%;
  left: 50%;
  transform: translate(-50%, -50%); */
}

.sheriff-table table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  border-spacing: 80px;
}

.sheriff-table table img{
  padding: 5px;
  width: 22px;
  height: auto;
}

.sheriff-table .icon{
  margin: -10px 0px;

}

.sheriff-table td, th {
  border: 1px solid #dddddd;
  text-align: left;
  /* padding: 1px; */
  text-align: center;
  padding: 15px auto;
  /* border-spacing: 100px; */
}

.sheriff-table tr {
  
  padding: 15px;
  background-color: #FF9A3C; 
  /* padding: 10px; */
  
}

.sheriff-table tr:nth-child(even) {
  background-color: #FF6F3C;
}

.sheriff-table table td{
  padding: 18px 10px 18px 10px;
}

.sheriff-table .loader{
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  width: 30px;
  height: 30px;
  /* aspect-ratio: 1/1; */
  /* width: 10px; */

  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;

  margin: auto auto;

}

.button {
  
  border: none;
  color: white;
  padding: 8px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
}

.opneningCards{
  width: 80vw;
  margin: auto auto;
  background-color: lightgrey;
  border-radius: 10px;
  padding:10px 10px 20px 10px;
  margin-top: 20px;
}
.opneningCards div{
  display: flex;
  /* background-color: red; */
}

.opneningCards img{
  margin-top:25px;
  width: 40px;
  height: auto;
  /* opacity: 0; */
  transition-timing-function: linear;
  transition: all 1.5s ease;
  /* background-color: red; */
}

.open {
	opacity: 1;
}

/* players-info ------------------------------------------------------ */
.players-info{
  color: black;
  font-weight: bold;
  position: absolute;

  bottom: 30px;
  width: 90%;
  /* height: 30%; */
  left: 50%;
  transform: translateX(-50%); 

  /* background-color: #FF9A3C; */
}

.players-info img{
  padding: 5px;
  width: 22px;
  height: auto;
}



.players-info table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  font-size: 90%;
}

.players-info td, th {
  border: 1px solid #dddddd;
  text-align: left;
  /* padding: 1px; */
  text-align: center;
  padding: 5px auto;
}

.players-info tr {
  background-color: #FF9A3C; 
  
}

.players-info tr:nth-child(even) {
  background-color: #FF6F3C;
}


.summary img{
  width: 20px;
  height: auto;
}

.lying img{
  width: 30px;
  height: auto;
  vertical-align:top;

}
</style>
