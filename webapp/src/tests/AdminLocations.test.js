import { getByDisplayValue, render, screen } from "@testing-library/react"
import ReactDOM from "react-dom"
import { act } from "react-dom/test-utils"
import AdminLocations from "../components/AdminLocations"
import TestComponent from "./TestComponent"
import App from "../App";


test("location list is present", async () => {

	render(<><TestComponent /><AdminLocations /></>);
	const linkElement = screen.getByText("Historial de ubicaciones, presione uno para eliminar");
	expect(linkElement).toBeInTheDocument();

})