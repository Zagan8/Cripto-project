const state = {
  allTheCoins: [],
  specificCoin: [],
  indexCounter: 0,
  activeCoins: [],
  tempCoins: []
};

function main() {
  getAllCoins();
  $(`#search`).on(`click`, search);
  state.allTheCoins.forEach(coin => {
    rendCoin(coin.name, coin.symbol, coin.id);
  });
  saveModal();
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
  $(`#container`).append(` <div class="col-sm-4" >
    <h2>${symbol}</h2>
    <p>${coinName}</p>
    <button  id="col-btn-${id}" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample-${id}" aria-expanded="false" aria-controls="collapseExample">
    More info
  </button>
</p>
<div class="custom-control custom-switch">
  <input  type="checkbox" class="custom-control-input" id="customSwitch-${id}" >
  <label class="custom-control-label" for="customSwitch-${id}"></label>
</div>
<div class="collapse" id="collapseExample-${id}">
  <div id="col-div-${id}" class="card card-body">
  </div>
</div>
    </div>
    `);

  state.indexCounter++;
  $(`#col-btn-${id}`).on(`click`, () => {
    getSpecificCoin(id);
  });
  $(`#customSwitch-${id}`).on(`click`, () => {
    activation(id);
  });
}

function getSpecificCoin(id) {
  $(`#col-div-${id}`).html(`<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>`);
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${id}`,
    success: function(response) {
      state.specificCoin.push(response);
      $(`#col-div-${id}`).html(`
        <img src="${response.image.small}">
<p>Value in shekels is:&#8362;${response.market_data.current_price.ils}</p>
<p>Value in usd is: &#36;${response.market_data.current_price.usd} </p>
<p>Value in euro is: &euro; ${response.market_data.current_price.eur} </p>
        `);
    }
  });
}
function search() {
  $(`#container`).html(``);
  let inputVal = $(`#searchInput`).val();
  $.ajax({
    type: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${inputVal}`,
    error: function() {
      $(`#container`).html(
        `<p style="color:red;" >There not such a coin please try again</p>`
      );
    },
    success: function(response) {
      rendCoin(response.name, response.symbol, response.id);
    }
  });
}
function activation(id) {
  const $witch = $(`#customSwitch-${id}`);
  if ($witch[0].checked && state.activeCoins.length <= 5) {
    const chosenOne = state.allTheCoins.find(coin => {
      return coin.id === id;
    });

    if (state.activeCoins.length === 5) {
      rendModal();
      
      $(`#myModal`).modal(`show`);
    }
    
    state.activeCoins.push(chosenOne);
    showSaveBtn();
    state.tempCoins = state.activeCoins.map(tempCoin => (tempCoin = tempCoin));
  } else if (!$witch[0].checked) {
    const switchIndex = state.activeCoins.findIndex(activeCoin => {
      return activeCoin.id + "" === $witch[0].id.slice(13, 100) + "";
    });
    state.activeCoins.splice(switchIndex, 1);
    showSaveBtn();
  } else {
  }
}
function rendModal() {
  state.activeCoins.forEach(coin => {
    $(`.modal-body`).append(`
<div class="col-sm-1" ><p class="symbolModal" >${coin.symbol}</p>
<div  class="custom-control custom-switch" class="modal-switch">
  <input  type="checkbox" class="custom-control-input" id="customSwitch-${coin.symbol}" checked >
  <label class="custom-control-label" for="customSwitch-${coin.symbol}"></label>
</div>
</div>
`);

    $(`#customSwitch-${coin.symbol}`).on(`click`, () => {
      const $witch = $(`#customSwitch-${coin.symbol}`);
      const exSwitch = $(`#customSwitch-${coin.id}`);
      if ($witch[0].checked) {
        exSwitch[0].checked = true;
        const chosenOne = state.allTheCoins.find(coinz => {
          return coinz.id === coin.id;
        });
        state.activeCoins.push(chosenOne);
        showSaveBtn();
      } else {
        exSwitch[0].checked = false;
        const switchIndex = state.activeCoins.findIndex(activeCoin => {
          return activeCoin.id + "" === $witch[0].id.slice(13, 100) + "";
        });
        state.activeCoins.splice(switchIndex, 1);
        showSaveBtn();
      }
    });
  });

  $(`#close-btn`).on(`click`, () => {
    state.tempCoins.forEach(tempCoin => {
      const $coin = $(`#customSwitch-${tempCoin.id}`);
      $coin[0].checked = true;
    });
    console.log(state.tempCoins);
    state.activeCoins = state.tempCoins;
    console.log(state.activeCoins);
    const exSwitch = $(`#customSwitch-${state.activeCoins[5].id}`);
    exSwitch[0].checked = false;
    setTimeout(() => {
      state.activeCoins.splice(5, 1);
      $(`.modal-body`).html("");
    }),
      500;
  });
}

function saveModal() {
  $(`#save-btn`).on(`click`, () => {
    if (state.activeCoins.length < 6) {
      $("#myModal").modal("hide");
      $(`.modal-body`).html("");
      setTimeout(() => {
        $('[data-toggle="popover"]').popover("hide");
      }),
        100;
    } else {
    }
  });
}
function showSaveBtn() {
  if (state.activeCoins.length < 6) {
    $(`#save-btn`).css("visibility", "visible");
  }else{
    $(`#save-btn`).css("visibility", "hidden");
  }
}
