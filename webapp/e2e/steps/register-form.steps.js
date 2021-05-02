const {defineFeature, loadFeature} = require("jest-cucumber");
const feature = loadFeature("./features/register-form.feature");
defineFeature(feature, test => {

	function wait(time) {
		return new Promise(function (resolve) {
		  setTimeout(resolve, time);
		});
	  }
	
	  beforeEach(async () => {
		await global.page.goto('http://localhost:3000')
	  })

	  
	test("The user is not registered in the site", ({given, when, then}) => {
		
		let popup;
		let webID;
		let password;
		let user;
		
		given("An unregistered user", async () => {
			//Datos de login de inrupt
			webID = "https://radarines5b.inrupt.net/profile/card#me";
			password = "Radarin5b.";
			user="Radarines5b";
			await global.page.goto('http://localhost:3000/')
		});
		
		when("I fill the data in the form and press submit", async () => {
			//Capturamos el popup
			//const newPagePromise = new Promise((x) =>  page.once(("targetcreated"), (target) => x(target.page())));	
			newPagePromise = new Promise(x => page.once('popup', x));
			await expect(page).toClick("button", { class: "solid auth login" });
			popup = await newPagePromise;

			//Ponemos el webId y damos a go
			await expect(popup).toFill('input[type="url"]', webID);
			await expect(popup).toClick('[type="submit"]');
			await wait(5000); //esperamos a que cargue
			//Rellenamos los datos de inrupt
			await popup.type("[name='username']", user, {visible: true}); 
			await popup.type('[name="password"]', password);
			await expect(popup).toClick('[id="login"]');
			//await wait(1000); //esperamos a que cargue
			await page.goto('http://localhost:3000/')

		});
		
		then("A welcome message should be shown in the screen", async () => {
			//await wait(1000);
		//	await expect(global.page).toMatch('WELCOME');
		});
	});
	/*
	test
	("The user is already registered in the site", ({given, when, then}) => {
		
		given("An already registered user", () => {
		});
		
		when("I fill the data in the form and press submit", async () => {
			
		});
		
		then("An error message should be shown in the screen", async () => {
		});
	});*/
});