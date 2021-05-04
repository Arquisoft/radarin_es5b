import { render, screen } from "@testing-library/react"
import ReactDOM from "react-dom"
import { act } from "react-dom/test-utils"

import TestComponent from "./TestComponent"
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

test("map is present", async () => {
	act(() => {
		ReactDOM.render(<><TestComponent /><Mapa /></>, container)
	})
	
	const linkElement = container.querySelector("#mapBlock")
	expect(linkElement).toBeInTheDocument()
})


/*test("principal text", () => {
	act(() => {
		ReactDOM.render(<Principal />, container)
	})
	
	const linkElement = container.getByText("Amigos:")
	expect(linkElement).toBeInTheDocument()
})*/