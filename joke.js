const joke_Api = "https://v2.jokeapi.dev/joke/";
// categories Any, Misc, Programming, Dark, Pun, Spooky, Christmas, Miscellaneous, Coding, Development, Halloween
var btn = document.querySelectorAll(".btn");

var img_bl = document.querySelector("#funImg2_btm_lt>img");
var img_br = document.querySelector("#funImg1>img");
let flag = false;

document.addEventListener('DOMContentLoaded', () => {
    img_bl.style.bottom = "0%";
    img_br.style.right = "1%";
    img_br.style.bottom = "1%";
})

// TIMEOUT ERROR HANDLING
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 1000);

async function getJoke(ctg = "programming") {
    document.querySelector("#loader").style.display = "block";
    await fetch(joke_Api + ctg).then(async function (res) {
        if (res.ok) {
            flag = true;
            var jokeApi = res;
            clearTimeout(timeout);          //removed tmeout as status is 200.
            var apiData = await jokeApi.json();
            if (flag) {
                document.querySelector("#middleImg").style.top = "0%";
                document.querySelector("#middleImg").style.display = "block";
                document.querySelector("#middleImg").style.opacity = "1";
                // document.querySelector("#middleImg").style.scale = "1";
                // document.querySelector("#middleImg1").style.right = "calc(width*50)";
            }
            console.log(apiData);
            let responseDiv = document.querySelector("#response");
            responseDiv.style.opacity = "1";
            let jokeType = apiData.type;
            if (jokeType == "single") {
                document.querySelector("#single>p").innerText = apiData.joke;
                document.querySelector("#twoPart").style.display = "none";
                document.querySelector("#single").style.display = "block";
            }
            else if (jokeType == "twopart") {
                document.querySelector("#single").style.display = "none";
                document.querySelector("#twoPart").style.display = "flex";
                document.querySelector("#setup").innerText = apiData.setup;
                document.querySelector("#delivery").innerText = apiData.delivery;
            }
            document.querySelector("#loader").style.display = "none";
            document.querySelector("#alert").style.opacity = "0";
            document.querySelector("#response").style.opacity = "1";
        }
        else if (!res.ok) {
            throw new Error(`Server Error Occures : ${res.status} ${res.statusText}`);
        }
    }).catch((error) => {
        if (!navigator.onLine) {
            alert("📡 No Internet Connection");
            document.querySelector("#loader").style.display = "none";
        }
        // TIMEOUT ERROR
        else if (error.name === 'AbortError') {
            alert("Server is taking too much time, try again later");
        }
        // SYNTAX OR JSON PARSE ERROR
        else if (error instanceof SyntaxError) {
            alert("📛 JSON Parse or Syntax Error: ", error.message);
        }
        // CORS ERROR
        else if (error instanceof TypeError) {
            alert("🚫 CORS or network block occured, ", error.message);
        }
        else {
            alert("unexpected error occured: ", error.message);
        }
    });

}

btn.forEach(function (elem) {
    elem.addEventListener("click", (elem2) => {
        document.querySelector("#alert").style.opacity = "0";
        // console.log(elem2.target);
        if (elem2.target.id == "dark" || elem2.target.id == "miscellaneous" || elem2.target.id == "misc") {
            document.querySelector("#response").style.opacity = "0";
            document.querySelector("#alert").style.opacity = "1";
            document.querySelector("#alert").style.zIndex = "40";
            document.querySelector("#middleImg").style.display = "none";
            let yesDiv = document.querySelector("#yes");
            let noDiv = document.querySelector("#no");
            console.log("yes: ", yesDiv, "no: ", noDiv);

            yesDiv.addEventListener("click", () => {
                getJoke(elem2.target.id);
            })
            noDiv.addEventListener("click", () => {
                elem2.target.disabled = true;
                document.querySelector("#noDiv").style.opacity = "1";
                yesDiv.style.display = "none";
            })
        }
        else {
            getJoke(elem2.target.id);
        }
    })
})

