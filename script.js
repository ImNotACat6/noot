
// Check user OS theme preference
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