const state = {
    allTheCoins:[],
    columCounter:1,
    switchCounter:1,
}

function main(){
getAllCoins();
state.allTheCoins.forEach((coin)=>{
rendCoin(coin.name,coin.symbol);
})
};
main();


//call all the coins
function getAllCoins(){
    $.ajax({
        type: "GET",
        url: "https://api.coingecko.com/api/v3/coins/list",
        async : false,
        success: function (response) {
            for(let i=0;i<100;i++){
                state.allTheCoins.push(response[i]);
            }
            
        }
    });
}

// rend all the coins
function rendCoin(coinName,symbol){
    if(state.columCounter<4){
    $(`#col-${state.columCounter}`).append(` <div class="coin" >
    <h2>${symbol}</h2>
    <p>${coinName}</p>
    <button id="moreInfo" >More info</button>
    <!-- Default checked -->
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="customSwitch${state.switchCounter}" >
  <label class="custom-control-label" for="customSwitch${state.switchCounter}"></label>
</div>
    </div>
    `);
    }else{
        state.columCounter= 1;
        $(`#col-${state.columCounter}`).append(`<div class="coin" >
        <h2>${symbol}</h2>
        <p>${coinName}</p>
        <button id="moreInfo" >More info</button>
        <!-- Default checked -->
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="customSwitch${state.switchCounter}">
  <label class="custom-control-label" for="customSwitch${state.switchCounter}"></label>
</div>
        </div>
        `); 
    }
    state.columCounter++
    state.switchCounter++
}