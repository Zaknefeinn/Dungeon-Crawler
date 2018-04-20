import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Square from './square';
import './main.css'
import data from './data'
class App extends Component{
    constructor(props){
        super(props)
        this.state = ({
            availTile:data.levelOneAvailable,
            activeTile:data.levelOneStart,
            refresh:false,
            currentLevel:0,
            loading:false,
            healTile:[],
            weaponTile:[],
            enemyTile:[],
            level:data,
            tile:[],
            gameOver:false,
            gameOverMsg:'',
            hide:true,
            canMove:true,
            weaponList:[{weapon:'Stick', atk:7},{weapon:'Knife', atk: 12},{weapon:'Short Sword', atk:17},{weapon:'Long Sword', atk:23},{weapon:'Spear', atk:28},{weapon:'Halberd', atk:33}, {weapon:'Scythe', atk:38}],
            enemyList:[ 
                {name:'Blob', minDmg:7,maxDmg:10, hp:30, xp:15, img:'<img class="pic enemy-img" src="https://orig00.deviantart.net/3d1c/f/2014/070/f/3/enemy_slime_by_madgharr-d76f2c5.gif">'},
                {name:'Pumpkin', minDmg:14,maxDmg:20, hp:60, xp:30,img:'<img class="pic enemy-img" src="https://www.gamedevmarket.net/file/df40ac67288c750b6c22fc915450925737e9dbfb.gif">'},
                {name:'Knight', minDmg:21,maxDmg:30, hp:120, xp:45, img:'<img class="pic enemy-img" src="https://4.bp.blogspot.com/-fGjfqs8638c/VUpYrnFEcrI/AAAAAAAACdg/8HfDfRH0PLY/s1600/flame_lancer_entity_000_idle.gif">'}
            ],
            bossList:[
                {name:'Boss', atk: 45, hp: 240, img:'<img class="pic boss-img" src="https://s-media-cache-ak0.pinimg.com/originals/45/dc/86/45dc86f84906fcf2e90cae87f54758fd.gif">'}
            ],
            stats:{
                health:100,
                weapon: 'Stick',
                attack: 7,
                level: 0,
                nextLevel: 60,
            }
        })
        this.handleMove = this.handleMove.bind(this)
    }
    
    componentWillMount(){
        //Create Grid
        this.squares()
        //Generate Set of Random Grid ID's
        // this.generateRandomTiles()
                this.generateRandomTiles()
    }

    componentDidMount(){
        //Locate Player

        // if(!this.state.loading){
        this.playerOne()
        // //Show heals/weapons/enemies/ect
        this.showTiles();
        this.generateRoom();
        this.handleVision(this.state.level.levelOneStart)
        // this.setState({refresh:false})
        // }
    }
    componentDidUpdate(){
        //Relocate Player
        if(!this.state.gameOver){
            this.playerOne()
            if(this.state.loading){
                this.generateRandomTiles();
            }
            if(this.state.refresh){
                this.showTiles();
                this.generateRoom();
                if(this.state.currentLevel === 1){
                this.handleVision(this.state.level.levelTwoStart)
                } else {
                  this.handleVision(this.state.level.levelThreeStart)  
                }
            }
        }
    }
    shouldComponentUpdate(nextProps,nextState){
        let state = this.state

            if(state.activeTile !== nextState.activeTile){
                console.log('hit1')
               return true 
            }  else {
            return false
            }
    }       
    generateRandomTiles(){
        let ranTiles = []
        for(let i=0; i<17; i++){
            const ran = Math.floor(Math.random() * (this.state.availTile.length))
            ranTiles.push(ran)
        }
        let tileId=[];
        ranTiles.forEach(x=>{
        tileId.push(this.state.availTile[x])
        })
        //Generate Heals
        this.setState({healTile: tileId.slice(0,5)})
        // //Generate Weapons
        this.setState({weaponTile: tileId.slice(5,7)})
        this.setState({enemyTile: tileId.slice(7,17)})
        const enemy = tileId.slice(7,17);
        let enemyArray = [];
        const enemyStats = this.state.enemyList[this.state.currentLevel]
        enemy.forEach(x => {
        enemyArray.push({enemy:enemyStats.name, location: x, hp:enemyStats.hp, atk: this.enemyDamage(enemyStats.minDmg,enemyStats.maxDmg), xp:enemyStats.xp, img:enemyStats.img})
        })
        this.setState({enemyTile:enemyArray})

        if(this.state.loading){
        //Show heals/weapons/enemies/ect
        // console.log(this.state.healTile)
        // this.setState({refresh:true})
        this.setState({loading:false})
        }
    }

    showTiles(){
        if(!this.state.loading){
            const specialTiles = document.querySelectorAll('.heal,.weapon,.enemy,.portal');
            specialTiles.forEach(x=>{
                document.getElementById(x.id).classList.remove('heal','weapon','enemy','portal')
                document.getElementById(x.id).innerHTML = '';
            })
        function tempLoop(temp, type){
            temp.forEach(x => {
                if(type === 'heal'){
                    document.getElementById(x).classList.add(type)
                    document.getElementById(x).innerHTML = '<img class="pic heal-img" src="https://i.imgur.com/S260f.png">'
                }
                if(type==='enemy'){
                    document.getElementById(x.location).classList.add(type)
                    // document.getElementById(x.location).innerHTML = '<img class="pic enemy-img" src="https://www.gamedevmarket.net/file/df40ac67288c750b6c22fc915450925737e9dbfb.gif">'
                    // console.log(x)
                    document.getElementById(x.location).innerHTML = x.img
                    // console.log(this.state.enemyList)
                }
                if(type==='weapon'){
                    document.getElementById(x).classList.add(type)
                    document.getElementById(x).innerHTML = '<img class="pic weapon-img" src="https://orig00.deviantart.net/2c11/f/2015/073/4/2/pixel_sword_by_m42ngc1976-d8ln5sx.png">'
                }
            })
        }
        // console.log(this.state.healTile)
        tempLoop(this.state.healTile, 'heal')
        tempLoop(this.state.weaponTile, 'weapon')
        tempLoop(this.state.enemyTile, 'enemy')
        let currentPortal;
        if(this.state.currentLevel === 0){
            currentPortal = this.state.level.levelOnePortal
            document.getElementById(currentPortal).classList.add('portal')
            document.getElementById(currentPortal).innerHTML = '<img class="pic portal-img" src="http://78.media.tumblr.com/717edfa6ef51ae0b594fc4c6e064633c/tumblr_mm55e88N8H1rnir1do1_500.gif">'
        } else if (this.state.currentLevel === 1){
            currentPortal = this.state.level.levelTwoPortal
            document.getElementById(currentPortal).classList.add('portal')
            document.getElementById(currentPortal).innerHTML = '<img class="pic portal-img" src="http://78.media.tumblr.com/717edfa6ef51ae0b594fc4c6e064633c/tumblr_mm55e88N8H1rnir1do1_500.gif">'
        } else {
            document.getElementById(this.state.level.levelThreeBoss).classList.add('boss')
            document.getElementById(this.state.level.levelThreeBoss).innerHTML = this.state.bossList[0].img
        }

        this.setState({refresh:false})
        }
    }
    
    playerOne(){
        const hero = document.querySelector('.hero')
        if(this.state.refresh && hero !== null){

        hero.classList.remove('hero')
        hero.innerHTML=''
        hero.removeAttribute('tabIndex')
        }
        const active = document.getElementById(this.state.activeTile)
        if(active.classList.contains('heal')){
            this.heal()
            active.classList.remove('heal')
        }
        if(active.classList.contains('weapon')){
            this.weapon()
            active.classList.remove('weapon')
        }
        if(active.classList.contains('portal')){
            this.nextLevel()
        //     this.setState({refresh:true})
        }
        active.classList.add('hero');
        active.innerHTML = '<img class="pic hero-img" src="https://static.apkthing.com/uploads/posts/2015-05/thumbs/1432649998_the-pixel-hero523.png">'
        active.tabIndex="1";
        active.focus()
        // var ts = new Date().getTime();
        
        active.addEventListener('keydown',e=> this.handleMove(e,this.state.canMove));
    }
    
    handleMove(e,canMove){
        const bindThis = this;
        if (!canMove) return false;
        // if(e.repeat){return}
        // canMove = false;
        this.setState({canMove:false})
        setTimeout(function() { bindThis.setState({canMove:true}); }, 150);
        const key = e.keyCode;
        let newTile;
        const activeTile = this.state.activeTile;
        let tempY = parseInt(activeTile.slice(0,2),10);
        let tempX = parseInt(activeTile.slice(-2),10);
        // if((tempX >= 0 && tempX < 100) && (tempY >= 0 && tempY < 68)){
        //Right Arrow
        if(key === 39){
            if(tempX !== 99){
                tempX = (tempX + 1)
            }
            if(tempX < 10){
                tempX = '0' + tempX
            }
            newTile = activeTile.substring(0,3) + tempX
            this.move(activeTile,newTile, tempX)
        } 
        //Left Arrow
        else if(key === 37){
            if(tempX !== 0){
                tempX = (tempX - 1)
            }
            if(tempX < 10){
                tempX = '0' + tempX
            }
            newTile = activeTile.substring(0,3) + tempX
            this.move(activeTile,newTile, tempX)
        } 
        //Up Arrow
        else if(key === 38){
            if(tempY !== 0){
                tempY = (tempY - 1)
            }
            if(tempY < 10){
                tempY = '0' + tempY
            }
            newTile = (tempY + activeTile.substring(2,5));
            this.move(activeTile,newTile, tempY)
        } 
        //Down Arrow
        else if(key === 40){
            if(tempY !== 67){
                tempY = (tempY + 1)
            }
            if(tempY < 10){
                tempY = '0' + tempY
            }
            newTile = (tempY + activeTile.substring(2,5));
            this.move(activeTile,newTile, tempY)
        } else {
            return
        // }
        }
    }
    move(activeTile, newTile, axis){
        const tempNew = document.getElementById(newTile);
        const tempActive = document.getElementById(activeTile);
        let push = true
            if(!tempNew.classList.contains('wall') && !tempNew.classList.contains('enemy') && !tempNew.classList.contains('boss')){
                tempActive.classList.remove('hero')
                tempActive.innerHTML=''
                tempActive.removeAttribute('tabIndex')
                this.handleVision(tempNew.id)
            } else if(tempNew.classList.contains('enemy') || tempNew.classList.contains('boss')){
                this.fight(tempNew.id)
                push=false
            }else {
                push=false
            }

        if(push){
            this.setState({activeTile: newTile})
        }
    }
    
    handleVision(newTile){
        // console.log(currentTile)
        let tempY = parseInt(newTile.slice(0,2),10);
        let tempX = parseInt(newTile.slice(-2),10);
        let roomX = [];
        let roomY = [];
        let area = [];
        for(var n=0; n< 7; n++){
            let y = tempY + n;
            if(y < 10){
                y = '0' + y;
            }
            roomY.push(y)
        }
        for( n=0; n< 7; n++){
            let y = tempY - n;
            if(y < 10){
                y = '0' + y;
            }
            roomY.push(y)
        }
        for(var i=0; i< 7; i++){
            let x = tempX + i;
            if(x < 10){
                x = '0' + x
            }
            roomX.push(x)
        }
        for( i=0; i< 7; i++){
            let x = tempX - i;
            if(x < 10){
                x = '0' + x
            }
            roomX.push(x)
        }
        roomY.forEach(y => {
            roomX.forEach(x => {
                area.push(`${y}x${x}`)
            })
        })
        // console.log(area)
        area.forEach(x=>{
            // console.log(x)
            const square = document.getElementById(x);
            var yAxis = parseInt(x.slice(0,2),10)
            // console.log(square)
            if(x.length === 5 && yAxis < 67){
            square.classList.remove('dark')
            }
        })
    }
    generateRoom(){
        // console.log(document.getElementsByClassName('floor'))
        //RESET ROOMS
        const floor = document.querySelectorAll('.floor');
        floor.forEach(x=>{
            document.getElementById(x.id).classList.remove('floor')
            document.getElementById(x.id).classList.add('wall')
            document.getElementById(x.id).classList.add('dark')
        })
        const wall = document.querySelectorAll('.wall');
        wall.forEach(x=>{
            document.getElementById(x.id).classList.add('dark')
        })
        // console.log(floor)
        let startPoint;
        if(this.state.currentLevel === 0){
             startPoint = this.state.level.levelOne;
        } else if(this.state.currentLevel === 1){
             startPoint = this.state.level.levelTwo; 
        } else {
            startPoint = this.state.level.levelThree;
        }
        startPoint.forEach(room=>{
            const tempY = parseInt(room.id.slice(0,2),10);
            const tempX = parseInt(room.id.slice(-2),10);
            let roomX = [];
            let roomY = [];
            let area = [];
            for(var n=0; n< room.height; n++){
                let y = tempY + n;
                if(y < 10){
                    y = '0' + y;
                }
                roomY.push(y)
            }
            for(var i=0; i< room.width; i++){
                let x = tempX + i;
                if(x < 10){
                    x = '0' + x
                }
                roomX.push(x)
            }
            roomY.forEach(y => {
                roomX.forEach(x => {
                    area.push(`${y}x${x}`)
                })
            })
            area.forEach(x => {
                document.getElementById(x).classList.remove('wall')
                document.getElementById(x).classList.add('floor')
            })
            room.door.forEach(x => {
                document.getElementById(x).classList.remove('wall')
                document.getElementById(x).classList.add('floor')
            })
        })
    }
    heal(){
        const health = this.state.stats.health + 20
        this.setState(prevState => ({
            stats: {
                ...prevState.stats,
                health
            }
        }))
    }
    weapon(){
        const weaponList = this.state.weaponList;
        const index = weaponList.findIndex(i => {
            return i.weapon === this.state.stats.weapon
        }
            )
        const newWeapon = weaponList[index+1]
        const attack = this.state.stats.attack + newWeapon.atk
        this.setState(prevState => ({
            stats: {
                ...prevState.stats,
                weapon: newWeapon.weapon,
            }
        }))
        this.setState(prevState => ({
            stats: {
                ...prevState.stats,
                attack,
            }
        }))
    }
    fight(id){
        const playerStats = this.state.stats;
        let playerHealth;
        if(document.getElementById(id).classList.contains('boss')){
            const boss = this.state.bossList;
            //Boss dies this turn
            if(boss[0].hp < playerStats.attack){
                document.getElementById(id).classList.remove('boss')
                document.getElementById(id).innerHTML = ''
                this.gameOver('win')
            }
            if(playerStats.health < boss[0].atk){
                this.gameOver('dead')
            }
            boss[0].hp = boss[0].hp - playerStats.attack;
            playerHealth = playerStats.health - boss[0].atk;
                this.setState(prevState => ({
                    stats: {
                        ...prevState.stats,
                        health:playerHealth
                    }
                }))
                this.setState({bossList: boss})
        } else {
            const enemyList = this.state.enemyTile;
            const enemy = enemyList.find(e => {
                return e.location === id
            })
            const index = enemyList.findIndex(i => {
                return i.location === enemy.location
            })
            //Enemy dies this turn
            if(enemy.hp < playerStats.attack){
                document.getElementById(enemy.location).classList.remove('enemy')
                document.getElementById(enemy.location).innerHTML = ''
                const nextLevel = playerStats.nextLevel - enemy.xp
                this.setState(prevState => ({
                    stats: {
                        ...prevState.stats,
                        nextLevel
                    }
                }))
                enemyList.splice(index,1)
                if(nextLevel <= 0){
                    this.levelUp(playerStats)
                }
            //Enemy Lives
            } else {
            if(playerStats.health < enemy.atk){
                this.gameOver('dead')
            }
            enemy.hp = enemy.hp - playerStats.attack;
                playerHealth = playerStats.health - enemy.atk;
                this.setState(prevState => ({
                    stats: {
                        ...prevState.stats,
                        health:playerHealth
                    }
                }))
            }
        this.setState({enemyTile:enemyList})
        }
    }
    enemyDamage(min, max){
        return Math.floor(Math.random() * ( max - min ) + min)
    }
    levelUp(player){
        this.setState(prevState => ({
            stats:{
                ...prevState.stats,
                health: player.health + 20,
                attack: player.attack + 12,
                level: player.level + 1,
                nextLevel: (60*(player.level+2))
            }
        }))
    }
    nextLevel(){
        if(this.state.currentLevel === 0){
            this.setState({
                availTile:data.levelTwoAvailable,
                activeTile:data.levelTwoStart,
                currentLevel:1
            })
        } else {
            this.setState({
                availTile:data.levelThreeAvailable,
                activeTile:data.levelThreeStart,
                currentLevel:2
            })
        }
        // this.generateRandomTiles()
        this.setState({refresh:true})
        this.setState({loading:true})
        // this.forceUpdate()
        // this.generateRoom();
        // this.showTiles()
    }
    
    squares(){
        const squares = [];
        let number;
        for (let i = 0; i < 6800; i++) {
            if(i < 1000){
                number = `0${(i / 100).toFixed(2).replace('.', 'x')}`
            } else {
                number = `${(i / 100).toFixed(2).replace('.', 'x')}`
            }
                squares.push(<Square id={number} key={number}/>);  
        }
        this.setState({ tile : squares })
        return squares;
    }
    gameOver(condition){
        if(condition === 'win'){
            this.setState({gameOverMsg:'You win!'})
        } else {
            this.setState({gameOverMsg:'You died.'})
        }
        this.setState({gameOver:true})
    }
    show(){
        if(this.state.hide){
        const dark = document.querySelectorAll('.dark');
        dark.forEach(x=>{
            document.getElementById(x.id).classList.remove('dark')
        })
        this.setState({hide:false})
        } else {
            const cells = document.querySelectorAll('.square')
            cells.forEach(x=>{
                document.getElementById(x.id).classList.add('dark')
            })
            const hero = document.querySelector('.hero')
            this.handleVision(hero.id)
            this.setState({hide:true})
        }
        
    }
    
    render(){
                console.log('hit')

        if(this.state.gameOver){
            return (
            <div>
                <h1>React RogueLike</h1>
                <div className="stat-container">
                    <div className="stat">Health: {this.state.stats.health}</div>
                    <div className="stat">Attack: {this.state.stats.attack} - {this.state.stats.weapon}</div> 
                    <div className="stat">Level: {this.state.stats.level}</div> 
                    <div className="stat">Next Level: {this.state.stats.nextLevel} xp</div> 
                    <div className="stat">Dungeon Level: {this.state.currentLevel}</div>
                    <div className="stat"><button onClick={e=>this.show()}>Show Map</button></div>
                </div>
                <div className="container">
                <div className="announcement">
                    <h1>Game Over</h1>
                </div>
                <div className="prompt">
                    <h2>{this.state.gameOverMsg}</h2>
                    <button onClick={e=> window.location.reload()}>Retry?</button>
                </div>
                </div>
            </div>
            )
        } else {
        return(
            <div>
                <h1>React RogueLike</h1>
                <div className="stat-container">
                    <div className="stat">Health: {this.state.stats.health}</div>
                    <div className="stat">Attack: {this.state.stats.attack} - {this.state.stats.weapon}</div> 
                    <div className="stat">Level: {this.state.stats.level}</div> 
                    <div className="stat">Next Level: {this.state.stats.nextLevel} xp</div> 
                    <div className="stat">Dungeon Level: {this.state.currentLevel}</div>
                    <div className="stat"><button onClick={e=>this.show()}>Show Map</button></div>
                </div>
                <div className="container" onClick={e=>document.getElementById(this.state.activeTile).focus()}>
                {this.state.tile}
                </div>
            </div>
        )
        }
    }
    
}

ReactDOM.render(<App />, document.querySelector('.root'));