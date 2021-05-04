import { render, screen } from "@testing-library/react"
import ReactDOM from "react-dom"
import { act } from "react-dom/test-utils"

import Mapa from "../components/Mapa"


let container

beforeEach(() => {
	container = document.createElement("div")
	document.body.appendChild(container)
})

afterEach(() => {
	document.body.removeChild(container)
	container = null
})

test("map is present", () => {
	act(() => {
		ReactDOM.render(<Mapa />, container)
	})
	
	const linkElement = container.querySelector(".map")
	expect(linkElement).toBeInTheDocument()
})


/*test("principal text", () => {
	act(() => {
		ReactDOM.render(<Principal />, container)
	})
	
	const linkElement = container.getByText("Amigos:")
	expect(linkElement).toBeInTheDocument()
})*/