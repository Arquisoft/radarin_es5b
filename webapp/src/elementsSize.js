
class MenuManager {
	constructor() {
		this.mobileMode = false
		this.menuVisible = true;
	}
	
	updateWindowSize() {
		let newMode = window.innerWidth < 1026
		if (this.mobileMode !== newMode) {
			this.mobileMode = newMode
			this.updateMenuBtsEnabled()
			
			if (this.menuVisible === newMode)
				this.toogleMenu()
			
			else
				document.getElementById("mapBlock").style.display = ""
		}
	}
	
	toogleMenu() {
		let menu = document.getElementById("Menu")
		let map = document.getElementById("mapBlock")
		
		if (menu != null) {
			this.menuVisible = ! this.menuVisible
			menu.style.display = this.menuVisible ? "" : "none"
			this.updateMenuBtsEnabled()
			
			if (this.mobileMode)
				map.style.display = this.menuVisible ? "none" : ""
			
			updateSize()
		}
	}
	
	updateMenuBtsEnabled() {
		let disabled = this.mobileMode && this.menuVisible
		for (let child of document.getElementById("bottomMenu").children)
			child.children[0].disabled = disabled
	}
}
var menuManager = new MenuManager()

function updateSize() {
	let map = document.getElementById("mapBlock")
	let headerBounding = document.getElementsByClassName("App-header")[0].getBoundingClientRect()	
	
	if (map != null) {
		menuManager.updateWindowSize()
		
		let windowWidth = window.innerWidth
		let windowHeight = window.innerHeight
		
		let bottomMenuBounding = document.getElementById("bottomMenu").getBoundingClientRect()
		let friendsMenu = document.getElementById("Menu")
		let controls = document.getElementById("controls")
		
		let mapHeight = windowHeight - headerBounding.height - bottomMenuBounding.height - 22
		map.style.height = mapHeight + "px"
		map.style.width = (windowWidth - friendsMenu.getBoundingClientRect().width - 20) + "px"
		
		if (controls != null)
			document.getElementById("mapContainer").style.height = (mapHeight - controls.getBoundingClientRect().height) + "px"
		
		friendsMenu.style.height = (windowHeight - headerBounding.height - bottomMenuBounding.height - 10) + "px"
	}
	
	let menu = document.getElementById("menuBt")
	menu.style.top = (headerBounding.height - menu.getBoundingClientRect().height - 20) + "px"
}

function updateMarkers() {
	for (let marker of document.getElementsByClassName("marker"))
		marker.parentNode.parentNode.parentNode.style.padding = "0.5em 1em"
}

window.onresize = updateSize

var toExport = {
	updateSize,
	updateMarkers,
	toogleMenu: menuManager.toogleMenu.bind(menuManager)
}
export default toExport