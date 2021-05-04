import React from "react";
import ListAmigos from "../components/ListAmigos"

class TestComponent extends React.Component {
	
	render() {
		return (
			<>
				<div className="App-header"></div>
				<div id="menuBt"></div>
				<ListAmigos />
				<div id="bottomMenu"></div>
			</>
		)
	}
}
export default TestComponent