const autoCompleteConfig ={
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            <h1>${movie.Title} (${movie.Year})</h1> 
            `;
    },
    inputValue (movie) {
        return movie.Title;
    },
    async fetchData (searchTerm) {
        const response = await axios.get("https://www.omdbapi.com/" , {
            params: {
                apikey:"ac3b36e0",
                s: searchTerm
            }
        });
       
       if (response.data.Error){
           console.log(`${searchTerm} not found!`);
           return [];
       }
        console.log("Done Successfully");
        return response.data.Search;
       }
}

createAutoComplete({
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        selectedMovie(movie, document.querySelector("#left-summary"), "left");
    },
    root: document.querySelector("#left-autocomplete"),
    
});

createAutoComplete({
    ...autoCompleteConfig,
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        selectedMovie(movie, document.querySelector("#right-summary"), "right");
    },
    root: document.querySelector("#right-autocomplete"),
    
});

let rightMovie;
let leftMovie;
const selectedMovie = async (movie, targetSummary, side) => {
    const followupResponse = await axios.get("https://www.omdbapi.com/" , {
     params: {
         apikey:"ac3b36e0",
         i: movie.imdbID
     }
 });
    targetSummary.innerHTML = movieTemplate(followupResponse.data);
    if (side === "left"){
        leftMovie = followupResponse.data;
    }
    else {
        rightMovie = followupResponse.data;
    }
    if (rightMovie && leftMovie){
        runComparison();
    }
};

 const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification");
    const rightSideStats = document.querySelectorAll("#right-summary .notification");

    leftSideStats.forEach((leftStat,index) => {
        const rightStat = rightSideStats[index];
        console.log(leftStat,rightStat);

        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        if (rightSideValue > leftSideValue){
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        }
        else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    })
}

const movieTemplate = (movieDetail) => {

    // const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/, ""));
    const runtime = parseInt(movieDetail.Runtime.match(/\d+/));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
    const awards = movieDetail.Awards.split(" ").reduce ((prev,str) => {
        const value = parseInt(str);
        if(isNaN(value)){
            return prev;
        }
        else {
            return prev + value;
        }
    }, 0);
    
    // console.log(awards,runtime,metascore,imdbRating,imdbVotes);

    return `
    <article class= "media">
      <figure class= "media-left">
       <p class= "image">
        <img src="${movieDetail.Poster}"/>
       </p>
      </figure>
      <div class = "media-content">
        <div class= "content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${runtime}" class="notification is-primary">
        <p class="title">${movieDetail.Runtime}</p>
        <p class="subtitle">Runtime</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};



