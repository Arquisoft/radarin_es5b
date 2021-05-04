
class MenuManager {
	constructor() {
		this.mobileMode = false
		this.menuVisible = true;
	}
	
	updateWindowSize() {
		let newMode = window.outerWidth < 1026
		if (this.mobileMode !== newMode) {
			this.mobileMode = newMode
			
			if (this.menuVisible === newMode)
				this.toogleMenu()
			
			else {
				let map = document.getElementById("mapBlock")
				if (map != null)
					map.style.display = "inline-block"
			}
		}
	}
	
	toogleMenu() {
		let menu = document.getElementById("Menu")
		let map = document.getElementById("mapBlock")
		
		if (menu != null) {
			this.menuVisible = ! this.menuVisible
			menu.style.display = this.menuVisible ? "inline-block" : "none"
			
			if (this.mobileMode)
				map.style.display = this.menuVisible ? "none" : "inline-block"
			
			updateSize()
		}
	}
}
var menuManager = new MenuManager()

function updateSize() {
	
	let map = document.getElementById("mapBlock")
	let headerBounding = document.getElementsByClassName("App-header")[0].getBoundingClientRect()	
	
	if (map != null) {
		let windowWidth = window.outerWidth
		let windowHeight = window.innerHeight
		
		let bottomMenuBounding = document.getElementById("bottomMenu").getBoundingClientRect()
		map.style.height = (windowHeight - headerBounding.height - bottomMenuBounding.height - 22) + "px"
		
		let friendsMenu = document.getElementById("Menu")
		map.style.width = (windowWidth - friendsMenu.getBoundingClientRect().width - 50) + "px"
		
		friendsMenu.style.height = (windowHeight - headerBounding.height - bottomMenuBounding.height - 50) + "px"
	}
	
	let menu = document.getElementById("menuBt")
	menu.style.top = (headerBounding.height - menu.getBoundingClientRect().height - 20) + "px"
}

function updateMarkers() {
	for (let marker of document.getElementsByClassName("marker"))
		marker.parentNode.parentNode.parentNode.style.padding = "0.5em 1em"
}

window.onresize = () => {
	menuManager.updateWindowSize()
	updateSize()
}

var toExport = {
	updateSize,
	updateMarkers,
	toogleMenu: menuManager.toogleMenu.bind(menuManager)
}
export default toExport