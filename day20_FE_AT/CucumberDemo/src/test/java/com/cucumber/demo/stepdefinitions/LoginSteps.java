package com.cucumber.demo.stepdefinitions;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;

public class LoginSteps {

    WebDriver driver;
    WebDriverWait wait;

    @Given("User opens the login page")
    public void user_opens_the_login_page() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("https://www.facebook.com/");
    }

    @When("user enters the username {string}")
    public void user_enters_the_username(String user) {
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@name='email' or @placeholder='Email address or mobile number' or @placeholder='Email or phone']"))
        );
        emailInput.sendKeys(user);
    }

    @When("user enters the password {string}")
    public void user_enters_the_password(String pass) {
        WebElement passInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@name='pass' or @placeholder='Password']"))
        );
        passInput.sendKeys(pass);
    }

    @Then("click the Login Button")
    public void click_the_login_button() {
        WebElement loginBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[@name='login'] | //div[@role='button' and contains(., 'Log in')] | //button[contains(., 'Log in')] | //span[contains(text(), 'Log in')]"))
        );
        loginBtn.click();
        driver.quit();
    }
}