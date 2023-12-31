// Dynamic theming based on OS preferences
function light() {
	document.documentElement.setAttribute('theme', 'light');
}

function dark() {
	document.documentElement.setAttribute('theme', 'dark');
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	dark();
} else {
	light();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
	if (event.matches) {
		dark();
	} else {
		light();
	}
});


// API request for race data
var race
async function getSchedule() {
    const request = await fetch("https://ergast.com/api/f1/current/next.json");
    const response = await request.json();
    
    const race = response.MRData.RaceTable.Races[0];
    
    return race;
};

// Create text objects
function title(string, bool) {
    const titleSpan = document.createElement("span");
    titleSpan.className = "title-text";
    
    const titleText = document.createTextNode(string);
    titleSpan.appendChild(titleText);

    return titleSpan;
}
function body(string) {
    const bodyText = document.createTextNode(string)
    return bodyText;
}

// Format dates
function strToDate(event) {
    const date = new Date(event.date+" "+event.time);
    return date;
}
function dateToDay(date, string) {
    var x = date.toLocaleDateString("en-US", {weekday: string})
    if (string == "narrow" && date.toLocaleDateString("en-US", {weekday: "short"}) == "Sun") {
        x = "Su"
    }
    return x
}
function dateToTime(date) {
    return date.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"})
}
function datesToDates(date1, date2) {
    const month = date1.toLocaleDateString("en-US", {month: "short"})
    const part1 = date1.toLocaleDateString("en-US", {day: "numeric"})
    const part2 = date2.toLocaleDateString("en-US", {day: "numeric"})
    return [month, " "+part1 + "-", part2];
}


// Generate table
async function drawTable() {

    // Get API data
    const race = await getSchedule();

    // Convert element data
    var ele = []

    if (race.Sprint) {
        ele[0] = ["Practice 1", "FP1", strToDate(race.FirstPractice)]
        ele[1] = ["Qualifying", "Quali", strToDate(race.Qualifying)]
        ele[2] = ["Sprint Shootout", "Shootout", strToDate(race.SecondPractice)]
        ele[3] = ["Sprint", "Sprint", strToDate(race.Sprint)]
        ele[4] = ["Race", "Race", strToDate(race)]
    } else {
        ele[0] = ["Practice 1", "FP1", strToDate(race.FirstPractice)]
        ele[1] = ["Practice 2", "FP2", strToDate(race.SecondPractice)]
        ele[2] = ["Practice 3", "FP3", strToDate(race.ThirdPractice)]
        ele[3] = ["Qualifying", "Quali", strToDate(race.Qualifying)]
        ele[4] = ["Race", "Race", strToDate(race)]
    }

    

    // Create table
    const table = document.createElement("table");
    table.id = "widget-table"
    const tableBody = document.createElement("tbody");

    // Header country
    const country = document.createElement("th");
    country.appendChild(title(race.Circuit.Location.country, true));
    table.appendChild(country);

    // Header dates
    const dates = document.createElement("th")
    const datesStrings = datesToDates(ele[0][2], ele[4][2])

    const month = title(datesStrings[0])
    month.className = "month"
    dates.appendChild(month)

    dates.appendChild(title(datesStrings[1]))
    dates.appendChild(title(datesStrings[2]))
    dates.className = "title-right"
    table.appendChild(dates)


    


    // Create events
    for (let i = 0; i < 5; i++) {
        // Create row
        const row = document.createElement("tr");

        // Name of event
        const nameContainer = document.createElement("td")

        const name = document.createElement("span")
        name.appendChild(body(ele[i][0]))
        name.className = "LG_body"
        nameContainer.appendChild(name)

        const SM_name = document.createElement("span")
        SM_name.appendChild(body(ele[i][1]))
        SM_name.className = "SM_body"
        nameContainer.appendChild(SM_name)

        row.appendChild(nameContainer)

        // Day and time container
        const dayAndTime = document.createElement("td")

        // Day of event
        const day = document.createElement("span")
        day.appendChild(body(dateToDay(ele[i][2], "short")))
        day.className = "day"
        dayAndTime.appendChild(day)

        const SM_day = document.createElement("span")
        SM_day.appendChild(body(dateToDay(ele[i][2], "narrow")))
        SM_day.className = "SM_day"
        dayAndTime.appendChild(SM_day)

        // Time of event
        const time = document.createElement("span")
        time.appendChild(body(dateToTime(ele[i][2])))
        time.className = "body-right"
        dayAndTime.appendChild(time)

        row.appendChild(dayAndTime)

        tableBody.appendChild(row);
    }


    table.appendChild(tableBody);
    document.body.appendChild(table);

    //setTimeout(Time, 1000);
    return table;
}
const table = drawTable();