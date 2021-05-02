const {defineFeature, loadFeature} = require("jest-cucumber");
const feature = loadFeature("./features/register-form.feature");
const puppeteer = require("puppeteer");
let browser = null;
let page =null;
defineFeature(feature, test => {

	function wait(time) {
		return new Promise(function (resolve) {
		  setTimeout(resolve, time);
		});
	  }
	
	
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

			//Lanzamos puppeteer
			browser= await puppeteer.launch({
				headless:false, ignoreDefaultArgs: ["--disable-extensions"],defaultViewPort:null
			});
			//abrimos una nueva pagina
			page=await browser.newPage();
			await page.goto("http://localhost:3000", {waitUntil: "load", timeout: 0})
		});
		
		when("I fill the data in the form and press submit", async () => {
			//Capturamos el popup
			const newPagePromise = new Promise((x) =>  browser.once(("targetcreated"), (target) => x(target.page())));	
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
		
		});
		
		then("A welcome message should be shown in the screen", async () => {
			await expect(page).toMatch('Welcome',{waitUntil: "load", timeout:0});
		});
	});
	/*
	test("The user is already registered in the site", ({given, when, then}) => {
		
		given("An already registered user", () => {
		});
		
		when("I fill the data in the form and press submit", async () => {
			
		});
		
		then("An error message should be shown in the screen", async () => {
		});
	});*/
});