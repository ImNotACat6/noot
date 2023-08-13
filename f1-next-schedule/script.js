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

    if (bool) {
        //titleText.className = "wrapped-text";
    }

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
function dateToDay(date) {
    return date.toLocaleDateString("en-US", {weekday: "short"})
}
function dateToTime(date) {
    return date.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})
}
function datesToDates(date1, date2) {
    const part1 = date1.toLocaleDateString("en-US", {month: "short", day: "numeric"})
    const part2 = date2.toLocaleDateString("en-US", {day: "numeric"})
    return part1+"-"+part2;
}

// Generate table
async function updateTable() {

    // Get API data
    const race = await getSchedule();
    console.log(race);

    // Convert element data
    var ele = []
    if (race.Sprint) {
        ele[0] = ["Practice 1", strToDate(race.FirstPractice)]
        ele[1] = ["Qualifying", strToDate(race.Qualifying)]
        ele[2] = ["Sprint Shootout", strToDate(race.SecondPractice)]
        ele[3] = ["Sprint", strToDate(race.Sprint)]
        ele[4] = ["Race", strToDate(race)]
    } else {
        ele[0] = ["Practice 1", strToDate(race.FirstPractice)]
        ele[1] = ["Practice 2", strToDate(race.SecondPractice)]
        ele[2] = ["Practice 3", strToDate(race.ThirdPractice)]
        ele[3] = ["Qualifying", strToDate(race.Qualifying)]
        ele[4] = ["Race", strToDate(race)]
    }

    // Create table
    const table = document.createElement("table");
    const tableBody = document.createElement("tbody");


    // Create header row
    const row0 = document.createElement("tr");

    // Country
    const country = document.createElement("td");
    country.appendChild(title(race.Circuit.Location.country, true));
    row0.appendChild(country);

    const empty = document.createElement("td")
    empty.appendChild(document.createTextNode(""))
    row0.appendChild(empty)

    // Date
    const dates = document.createElement("td")
    dates.appendChild(title(datesToDates(ele[0][1], ele[4][1])))
    row0.appendChild(dates)

    tableBody.appendChild(row0);


    // Create events
    for (let i = 0; i < 5; i++) {
        // Create row
        const row = document.createElement("tr");

        // Name of event
        const name = document.createElement("td")
        name.appendChild(body(ele[i][0]))
        row.appendChild(name)

        // Day of event
        const day = document.createElement("td")
        day.appendChild(body(dateToDay(ele[i][1])))
        row.appendChild(day)

        // Time of event
        const time = document.createElement("td")
        time.appendChild(body(dateToTime(ele[i][1])))
        row.appendChild(time)

        tableBody.appendChild(row);
    }


    table.appendChild(tableBody);
    document.body.appendChild(table);

    //setTimeout(Time, 1000);
}
updateTable();