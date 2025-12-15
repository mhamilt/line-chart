let symbol = "MSFT"
let result = new Array(5);

function alphaVantageQuery(symbol)
{
    cleardata();

    let wibble = "5M5AQ6D0IR1C36LG";
    let financialsUrl = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbol}&apikey=${wibble}`
    let ttmUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${wibble}`
    
    
    const financialsRequest = new XMLHttpRequest();
    financialsRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(financialsRequest.responseText)
            
            console.log(response);
            for (let i = 1; i < 6; i++) {
                result[i] = response.annualReports[i].costOfRevenue/1000000;
                document.getElementById(`m${i}`).innerText = result[i];
            }
            
            result  = result.reverse();
            let chartQuery = `?${result[0]}`
            for (let i = 1; i < 6; i++) {
                chartQuery +=`&${result[i]}`
            }
            
            console.log(result);
            document.getElementById(`revenue-chart`).src = `./chartjs/${chartQuery}`
            
        }
    };
    
    financialsRequest.open("GET", financialsUrl, true);
    
    
    const ttmRequest = new XMLHttpRequest();
    
    ttmRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(ttmRequest.responseText)
            console.log(response);
            // console.log(response.RevenueTTM)
            result[0] = response.RevenueTTM/ 1000000;
            document.getElementById(`ttm`).innerText = result[0];
            document.getElementById("company-name").innerText = response.Name;
            document.getElementById("company-description").innerText =  response.Description;
            document.getElementById("exchange").innerText = response.Exchange;
            document.getElementById("sector").innerText =   response.Sector;
        }
    };
    
    ttmRequest.open("GET", ttmUrl, true);
    ttmRequest.send()
    
    setTimeout(()=>financialsRequest.send(), 1500);
    
    return result;
}

function cleardata()
{
    document.getElementById(`revenue-chart`).src = `./chartjs/?0&0&0&0&0&0`
    for (let i = 1; i < 6; i++) {                
        document.getElementById(`m${i}`).innerText = "";
    }
    document.getElementById(`ttm`).innerText =  ""
    document.getElementById("company-name").innerText =  ""
    document.getElementById("company-description").innerText = ""
    document.getElementById("exchange").innerText =  ""
    document.getElementById("sector").innerText =    ""
}
// AJAX query
// return result

addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        symbol = document.getElementById(`searchbar`).value.toUpperCase().replaceAll(" ",'')
        console.log(symbol)
        alphaVantageQuery(symbol)
    }
});