package com.cucumber.demo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FacebookLoginPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By emailInputLocator = By.xpath("//input[@name='email' or @placeholder='Email address or mobile number' or @placeholder='Email or phone']");
    private By passwordInputLocator = By.xpath("//input[@name='pass' or @placeholder='Password']");
    private By loginBtnLocator = By.xpath("//button[@name='login'] | //div[@role='button' and contains(., 'Log in')] | //button[contains(., 'Log in')] | //span[contains(text(), 'Log in')]");

    public FacebookLoginPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public void enterUsername(String user) {
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(emailInputLocator));
        emailInput.clear();
        emailInput.sendKeys(user);
    }

    public void enterPassword(String pass) {
        WebElement passInput = wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInputLocator));
        passInput.clear();
        passInput.sendKeys(pass);
    }

    public void clickLogin() {
        WebElement loginBtn = wait.until(ExpectedConditions.elementToBeClickable(loginBtnLocator));
        loginBtn.click();
    }
}
