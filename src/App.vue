<template>
  <head></head>

  <div>
    <div class="merchantView">
      <div class="wrapper">
  
  
        <div style="margin: 20px"></div>
        <!-- <span>{{myPlayer.cards}}</span> -->
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
    
          <div class="controller">

            <div >
              <strong style="margin: 2em">{{gameState}}</strong><br>
              <div class="button-wrapper">
                <div><button @click="goNext()" class="button1" v-if="gameState== 'selecting'">Ready</button></div>
                <div><button @click="submit()" class="button1" v-if="gameState== 'loading'">Submit</button></div>
                <div><button @click="goback()" class="back" v-if="gameState== 'declaring'" >go back</button></div>
              </div>
      
              <div class="declratng" v-if="gameState == 'declaring'">
                <h3>I'm taking {{loadingNum}} of ... </h3>
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
                <strong>{{myPlayer.declaredNum}} {{myPlayer.declaredItem}}</strong>
                <br>
                offring a bribe for the sheriff?
              </div>
            </div>

          </div>
        </div>
        
        <div v-else>
          <div class="sheriff-table">
            <table v-if="players">
              <tr>
                <th><img src="../public/pics/usrer.png" alt=""></th>
                <th><img src="../public/pics/box-svgrepo-com.svg" alt=""></th>
                <th>OK</th>
                <th>open</th>
                <th>accept</th>
              </tr>
              <template  v-for="(player,i) in players" :key="i">
                <tr v-if="player.name !== myPlayer.name">
                  <td>{{player.name}} <span v-if="player?.isSheriff"></span></td>
                  <td>
                    <div v-if="!player.waiting" class="loader"></div>
                    <div v-else>{{player.declaredNum}} {{player.declaredItem}}</div>
                  </td>
                  <td>o</td>
                  <td>x</td>
                  <td><img src="../public/pics/shush.png" alt=""></td>
                </tr>
              </template>
              
            </table>
          </div>
        </div>
  
        
        
  
        
      </div>
  
      <div class="players-info" v-if="players">
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
          <template  v-for="(player,i) in players" :key="i">
            <tr>
              <td><span :style="[player.name == username ? 'color:darkgreen' : '']">{{player.name}}</span> <span v-if="player.isSheriff"><i class="fa fa-star-o" style="color:yellow"></i></span></td>
              <td>{{player.securedItems?.apple.length}}</td>
              <td>{{player.securedItems?.cheese.length}}</td>
              <td>{{player.securedItems?.bread.length}}</td>
              <td>{{player.securedItems?.chicken.length}}</td>
              <td>{{player.securedItems?.illeagl.length}}</td>
              <td>{{player.balance}}</td>
            </tr>
          </template>
          
        </table>
      </div>

      <div style="position:absolute; bottom:10px; left: 20px;">
        {{roomCode}}: gamestatus: {{gameStatus}}
      </div>

    </div>



    <div>
      <!-- {{players}} -->
      <br>
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
                
                <!-- <hr> -->
                <!-- <span @click="showModal = false; readyToPlay = true ">{{}}</span> -->
                <!-- <template v-for="(player,index) in players" :key="index" style="text-align:left">
                  <span :style="username==player ? 'color:red' : ''">{{index+1}}. {{player?.role}}</span><br>

                </template> -->

                
            </form>
          </div>

          <div v-if="modalStatus == 4 && hasRevealed" style="color:black">
            <form onsubmit="event.preventDefault()">
              <span v-if="myPlayer.role !== 'handsomeprince'">You "{{myPlayer?.name}}" are playing as <strong style="color:red; font-size:250%"><br>{{myPlayer?.role}}</strong><br> </span>
              <span v-else>You "{{myPlayer?.name}}" are playing as <strong style="color:red; font-size:250%"><br>handsome <br> prince</strong><br> </span>

              <strong>Team</strong><br>
              <span>{{rules[myPlayer?.role]?.team}}</span><br><br>

              <strong>Description</strong><br>
              <span>{{rules[myPlayer?.role]?.description}}</span><br><br>

              <strong>Win Condtion</strong><br>
              <span>{{rules[myPlayer?.role]?.winCondition}}</span><br>

              <hr>
              <button @click="showModal = false; readyToPlay = true " class="okButton">OK</button>


                <hr>
                
            </form>
          </div>

          


        </div>
    </div>

  </transition>


</template>

<script>
import {cards} from './const/cards.js'
import db from './firebase.js';


var randomWords = require('random-words');
import { copyText } from 'vue3-clipboard'

export default {
  name: 'App',
  data(){
    return{
      cards,
      players : {
        playerOne: {hands: undefined}
      },
      roomCode: undefined,
      gameState: 'selecting',

      tempName: 'playerOne',
      removeableIndex: [],

      // developing: true,
      developing: false,

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
      gotInitialData: false,
      // roomCode

      
    }
  },
  methods:{
    setup(){
      this.modalStatus++


      // console.log(this.hands)

    },
    getSixCards(){
      // let list = []
      // let count =0 
      // while(count  < 6){

      //   count++
      // }
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
      // let limit = this.trashNum
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
      }

      if(confirm(`Are you sure you want change ${this.trashNum} cards?`) == true){
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



    // ------------------------------------
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

      // sending the data for the first time
      this.detailData =[{gameStatus: 'ready'}]
      const ref = db.collection('rooms')
      ref.doc(`${this.roomCode}`).update({
        gameStatus: 'playing',
        players: this.players,
        detailData: JSON.stringify( this.detailData),
        officialLog: '',
      })

      console.log('done closing room ----------------')

    },
    multiAssignRoles(){
      console.clear()

      // initalizing the obj
      let count = 0
      this.players = {}
      this.chatList = {}
      while(count < this.members.length){
        this.players[this.members[count]] = {
          name: this.members[count], 
          isSheriff: false,
          securedItems: {apple: [],cheese: [],bread: [], chicken: [],illeagl: []},
          caughtCount: 0,
          catchCount: 0,
          hands: this.getSixCards(),
          balance: 10,
          waiting: false,
          state: false,
        }

        if(count == 0){
          this.players[this.members[count]].isSheriff = true
        } 
          
        
        count++
      }

      console.log(this.players)
      
      return 

    


      
    },

    ReciveTheData(){
      console.log(this.roomCode)
      
      db.collection("rooms").doc(`${this.roomCode}`)
      .onSnapshot((doc) => {

        this.gameStatus = doc.data().gameStatus
        this.members = JSON.parse(doc.data()?.members)
        
        if(!this.members.includes(this.username)){
          this.joinARoom()
          return 
        }

        if(this.gameStatus == 'playing'){
          
          

          this.gameStatus = 'playing'
          this.modalStatus++
          this.showModal = false
          this.detailData = JSON.parse(doc.data().detailData)
          if(!this.gotInitialData){
            this.players = doc.data().players
            this.gotInitialData = true
          }

          if(this.myPlayer.isSheriff){
            this.players = doc.data().players
          }

          console.log(`getting new data`)  


          
            
            
            
            
          

        }
        
      }
      )
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

  },
  mounted(){
    console.clear()

    this.setup()

    this.generateRandomUsername()

    // this.players
    // console.log(this.cards)

    // this.gameState= 'selecting'

    // if(this.developing) this.skipping()
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
      if(this.onlineStatus !== 'ready') return
      // let count =0 
      let list = []
      for(let i in this.players){
        if(!this.players[i].waiting){
          list.push(this.players[i].name)
        }
      }

      return list
      
    },
    // removeValFromIndex(){
    //   let array
      

    //   // array.sort(function(a,b){ return b - a; });
    //   return array
    // }
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
  margin: 1em auto 0;
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
  width: 50px;
  height: auto;
  filter: invert(99%) sepia(6%) saturate(2%) hue-rotate(264deg) brightness(104%) contrast(100%);
}




/* loader ---------------- */
.sheriff-table{

  color: black;
  font-weight: bold;
  position: absolute;

  width: 90%;

  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sheriff-table table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  border-spacing: 100px;
}

.sheriff-table table img{
  padding: 5px;
  width: 25px;
  height: auto;
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
  padding: 20px;
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



/* players-info ------------------------------------------------------------------------ */
.players-info{
  color: black;
  font-weight: bold;
  position: absolute;

  bottom: 45px;
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



</style>
