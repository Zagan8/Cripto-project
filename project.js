const state = {
  allTheCoins: [],
  specificCoin: [],
  activeCoins: [],
  tempCoins: [],
  CACHE: []
};

async function main() {
  state.allTheCoins = await getAllCoins();
  $(`#search-btn`).on(`click`, search);

  state.allTheCoins.forEach(coin => {
    rendCoin(coin.name, coin.symbol, coin.id);
  });
  graphsVisability();
  saveModal();
  graphBtn();
  $(`#home-tab`).on(`click`, () => {
    if (!$("#profile-tab.nav-link.active")) {
      state.allTheCoins.forEach(coin => {
        rendCoin(coin.name, coin.symbol, coin.id);
      });
    }
    state.activeCoins.forEach(coin => {
      const exSwitch = $(`#customSwitch-${coin.id}`);
      exSwitch[0].checked = true;
    });
  });
}

main();

//call all the coins
function getAllCoins() {
  //$(`#load-modal`).modal(`show`);
  const promise = new Promise(resolve => {
    $.ajax({
      type: "GET",
      url: "https://api.coingecko.com/api/v3/coins/list",
      success: resolve
    });
  });
  $(`#container`).html("");
  return promise;
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

  const date = new Date(Date.now());
  const coinCache = id;
  const cache = state.CACHE.find(coin => {
    return coin.coin.id === coinCache;
  });
  const cacheIndex = state.CACHE.findIndex(coin => {
    return coin === cache;
  });
  if (!cache || cache.date < new Date(Date.now()) - 120000) {
    if (cacheIndex >= 0) {
      state.CACHE.splice(cacheIndex, 1);
    }
    $.ajax({
      type: "GET",
      url: `https://api.coingecko.com/api/v3/coins/${id}`,
      success: function(response) {
        state.specificCoin.push(response);
        state.CACHE.push({ coin: response, date: date });
        $(`#col-div-${id}`).html(`
        <img src="${response.image.small}">
<p>Value in shekels is:&#8362;${response.market_data.current_price.ils}</p>
<p>Value in usd is: &#36;${response.market_data.current_price.usd} </p>
<p>Value in euro is: &euro; ${response.market_data.current_price.eur} </p>
        `);
      }
    });
  } else if (cache.date >= new Date(Date.now()) - 120000) {
    $(`#col-div-${id}`).html(`
  <img src="${cache.coin.image.small}">
<p>Value in shekels is:&#8362;${cache.coin.market_data.current_price.ils}</p>
<p>Value in usd is: &#36;${cache.coin.market_data.current_price.usd} </p>
<p>Value in euro is: &euro; ${cache.coin.market_data.current_price.eur} </p>
`);
  }
}
function search() {
  $(`#container`).html(``);
  let inputVal = $(`#searchInput`).val();

  const searchResult = state.allTheCoins.find(coin => {
    return coin.symbol === inputVal;
  });
  if (searchResult) {
    rendCoin(searchResult.name, searchResult.symbol, searchResult.id);
  } else {
    $(`#search`).html(
      `<p style="color:red;" >There not such a coin please try again</p>`
    );
  }
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
    graphsVisability();
    showSaveBtn();
    state.tempCoins = state.activeCoins.map(tempCoin => (tempCoin = tempCoin));
  } else if (!$witch[0].checked) {
    const switchIndex = state.activeCoins.findIndex(activeCoin => {
      return activeCoin.id + "" === $witch[0].id.slice(13, 100) + "";
    });
    state.activeCoins.splice(switchIndex, 1);
    graphsVisability();
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

    state.activeCoins = state.tempCoins;

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
  } else {
    $(`#save-btn`).css("visibility", "hidden");
  }
}

function graphBtn() {
  $(`#profile-tab`).on(`click`, () => {
    if (state.activeCoins.length === 0) {
      $(`#profile`).html(``);
    }
    graph();
    async function graph() {
      const dataArray = [];
      const dataBase = await getDataGraph();

      dataBase.forEach(data => {
        dataArray.push(data);
      });
      const dataCanvas = setInterval(() => {
        dataBase.forEach(async data => {
          const dataBase = await callApi();

          data.dataPoints.splice(0, 1);
          data.dataPoints.push({
            x: new Date(Date.now()),
            y: dataBase[data.name].USD
          });
          data.yValueFormatString = `$ ${dataBase[data.name].USD}`;
        });
      }, 2500);

      var options = {
        exportEnabled: true,
        animationEnabled: false,
        title: {
          text: "Coin value live"
        },

        axisX: {
          title: "time"
        },
        axisY: {
          title: "Coin price",
          titleFontColor: "#4F81BC",
          lineColor: "#4F81BC",
          labelFontColor: "#4F81BC",
          tickColor: "#4F81BC",
          includeZero: false
        },
        toolTip: {
          shared: true
        },
        legend: {
          cursor: "pointer",
          itemclick: toggleDataSeries
        },
        data: dataArray
      };
      const canvas = setInterval(() => {
        startCanvas(options);
      }, 2500);

      function toggleDataSeries(e) {
        if (
          typeof e.dataSeries.visible === "undefined" ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }

      $(`#home-tab`).on(`click`, () => {
        stopCanvas(canvas);
        stopCanvas(dataCanvas);
      });
      $(`#profile`).html(
        `<div id="chartContainer" style="height: 300px; width: 100%;"></div>`
      );
    }
  });
}
function apiGraphs() {
  const symbols = [];
  state.activeCoins.forEach(coin => {
    symbols.push(coin.symbol);
  });
  const promise = new Promise(resolve => {
    $.ajax({
      type: "GET",
      url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols},&tsyms=USD`,
      success: function(response) {
        resolve(response);
      }
    });
  });
  return promise;
}
async function callApi() {
  const callBack = await apiGraphs();
  return callBack;
}
async function getDataGraph() {
  const database = await callApi();

  const graphs = [];
  const amountOfGraphs = Object.keys(database);
  amountOfGraphs.forEach(graph => {
    const graphObj = {
      type: "spline",
      name: `${graph}`,
      showInLegend: true,
      xValueFormatString: "MMM YYYY HH:mm:ss",
      yValueFormatString: `$ ${database[graph].USD}`,
      dataPoints: [
        { x: new Date(Date.now() - 16000), y: database[graph].USD },
        { x: new Date(Date.now() - 14000), y: database[graph].USD },
        { x: new Date(Date.now() - 12000), y: database[graph].USD },
        { x: new Date(Date.now() - 10000), y: database[graph].USD },
        { x: new Date(Date.now() - 8000), y: database[graph].USD },
        { x: new Date(Date.now() - 6000), y: database[graph].USD },
        { x: new Date(Date.now() - 4000), y: database[graph].USD },
        { x: new Date(Date.now() - 2000), y: database[graph].USD },
        { x: new Date(Date.now()), y: database[graph].USD }
      ]
    };
    graphs.push(graphObj);
  });

  return graphs;
}
function startCanvas(options) {
  $("#chartContainer").CanvasJSChart(options);
}
function stopCanvas(canvas) {
  clearInterval(canvas);
}
function graphsVisability() {
  if (state.activeCoins.length === 0) {
    $(`#profile-tab`).css("visibility", "hidden");
  } else {
    $(`#profile-tab`).css("visibility", "visible");
  }
}
