const state = {
  allTheCoins: [],
  specificCoin: [],
  columCounter: 1,
  switchCounter: 1
};

function main() {
  getAllCoins();
  state.allTheCoins.forEach(coin => {
    rendCoin(coin.name, coin.symbol, coin.id);
    
  });
}
main();

//call all the coins
function getAllCoins() {
  $.ajax({
    type: "GET",
    url: "https://api.coingecko.com/api/v3/coins/list",
    async: false,
    success: function(response) {
      for (let i = 0; i < 100; i++) {
        state.allTheCoins.push(response[i]);
      }
    }
  });
}

// rend all the coins
function rendCoin(coinName, symbol, id) {
  if (state.columCounter < 4) {
    $(`#col-${state.columCounter}`).append(` <div class="coin" >
    <h2>${symbol}</h2>
    <p>${coinName}</p>
    <button id="col-btn-${id}" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample-${id}" aria-expanded="false" aria-controls="collapseExample">
    More info
  </button>
</p>
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="customSwitch${state.switchCounter}" >
  <label class="custom-control-label" for="customSwitch${state.switchCounter}"></label>
</div>
<div class="collapse" id="collapseExample-${id}">
  <div id="col-div-${id}" class="card card-body">
  </div>
</div>
    </div>
    `);
  } else {
    state.columCounter = 1;
    $(`#col-${state.columCounter}`).append(`<div class="coin" >
        <h2>${symbol}</h2>
        <p>${coinName}</p>
        <button id="col-btn-${id}" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample-${id}" aria-expanded="false" aria-controls="collapseExample">
        More info
      </button>
    </p>
    <div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="customSwitch${state.switchCounter}">
  <label class="custom-control-label" for="customSwitch${state.switchCounter}"></label>
</div>
    <div class="collapse" id="collapseExample-${id}">
      <div id="col-div-${id} class="card card-body">    
      </div>
    </div>

        </div>
        `);
        
  }
  state.columCounter++;
  state.switchCounter++;
 // $(`#col-btn-${id}`).on(`click`,getSpecificCoin(id));
}

function getSpecificCoin(id) {
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${id}`,
    success: function(response) {
      state.specificCoin.push(response);
      $(`#col-div-${id}`).append(`
        <img src="${response.image.small}">
<p>Value in shekels is:&#36;${response.market_data.current_price.ils}</p>
<p>Value in usd is: &#8362; ${response.market_data.current_price.usd} :</p>
<p>Value in euro is: &euro; ${response.market_data.current_price.eur} :</p>
        `);
    }
  });
}
