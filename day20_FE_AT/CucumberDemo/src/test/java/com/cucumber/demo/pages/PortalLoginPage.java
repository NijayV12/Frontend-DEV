package com.cucumber.demo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalLoginPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By emailInputLocator = By.id("email-input");
    private By passwordInputLocator = By.id("password-input");
    private By submitBtnLocator = By.cssSelector("button[type='submit']");
    private By welcomeTextLocator = By.className("welcome-text");

    public PortalLoginPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public void login(String email, String password) {
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInputLocator));
        WebElement passwordInput = driver.findElement(passwordInputLocator);
        WebElement submitBtn = driver.findElement(submitBtnLocator);

        emailInput.clear();
        emailInput.sendKeys(email);
        passwordInput.clear();
        passwordInput.sendKeys(password);
        
        submitBtn.click();
        
        // Wait for dashboard welcome text to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeTextLocator));
    }
}
