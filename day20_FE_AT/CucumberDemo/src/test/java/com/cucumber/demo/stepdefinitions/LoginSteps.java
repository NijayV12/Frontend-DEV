package com.cucumber.demo.stepdefinitions;

import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.cucumber.demo.pages.FacebookLoginPage;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;

public class LoginSteps {

    WebDriver driver;
    WebDriverWait wait;
    FacebookLoginPage loginPage;

    @Given("User opens the login page")
    public void user_opens_the_login_page() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        loginPage = new FacebookLoginPage(driver, wait);
        driver.get("https://www.facebook.com/");
    }

    @When("user enters the username {string}")
    public void user_enters_the_username(String user) {
        loginPage.enterUsername(user);
    }

    @When("user enters the password {string}")
    public void user_enters_the_password(String pass) {
        loginPage.enterPassword(pass);
    }

    @Then("click the Login Button")
    public void click_the_login_button() {
        loginPage.clickLogin();
        driver.quit();
    }
}