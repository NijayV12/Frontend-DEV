package com.cucumber.demo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PortalDashboardPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By helpdeskTabLocator = By.xpath("//a[contains(., 'IT/HR Helpdesk')]");
    private By learningTabLocator = By.xpath("//a[contains(., 'Learning & Compliance') and contains(@class, 'nav-item')]");

    public PortalDashboardPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public void navigateToHelpdesk() throws InterruptedException {
        WebElement helpdeskTab = wait.until(ExpectedConditions.elementToBeClickable(helpdeskTabLocator));
        helpdeskTab.click();
        Thread.sleep(1000); // Allow view to transition
    }

    public void navigateToLearning() throws InterruptedException {
        WebElement learningTab = wait.until(ExpectedConditions.elementToBeClickable(learningTabLocator));
        learningTab.click();
        Thread.sleep(1000); // Allow transition
    }
}
