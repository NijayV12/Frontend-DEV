package com.cucumber.demo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LearningPage {
    private WebDriver driver;
    private WebDriverWait wait;

    public LearningPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public void markCourseAsCompleted(String courseName) throws InterruptedException {
        By markCompletedBtnLocator = By.xpath("//div[contains(., '" + courseName + "')]//button[contains(text(), 'Mark Completed')]");
        WebElement markCompletedBtn = wait.until(ExpectedConditions.elementToBeClickable(markCompletedBtnLocator));
        markCompletedBtn.click();
        Thread.sleep(1000);
    }

    public WebElement getCourseStatusElement(String courseName, String status) {
        By statusLabelLocator = By.xpath("//div[contains(., '" + courseName + "')]//span[contains(text(), '" + status + "')]");
        return wait.until(ExpectedConditions.visibilityOfElementLocated(statusLabelLocator));
    }
}
