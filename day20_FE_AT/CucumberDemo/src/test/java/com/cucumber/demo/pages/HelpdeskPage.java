package com.cucumber.demo.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class HelpdeskPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By titleInputLocator = By.xpath("//input[@placeholder='Summarize the issue...']");
    private By descTextareaLocator = By.xpath("//textarea[@placeholder='Describe the issue in detail...']");
    private By submitBtnLocator = By.xpath("//button[text()='Submit Ticket']");
    private By activeTicketsContainerLocator = By.xpath("//div[./h3[contains(., 'Active Support Tickets')]]");

    public HelpdeskPage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    public void submitTicket(String title, String description) throws InterruptedException {
        WebElement titleInput = wait.until(ExpectedConditions.visibilityOfElementLocated(titleInputLocator));
        WebElement descTextarea = driver.findElement(descTextareaLocator);
        WebElement submitBtn = driver.findElement(submitBtnLocator);

        titleInput.click();
        titleInput.clear();
        titleInput.sendKeys(title);
        
        descTextarea.click();
        descTextarea.clear();
        descTextarea.sendKeys(description);
        
        System.out.println("DEBUG - Title input value: " + titleInput.getAttribute("value"));
        System.out.println("DEBUG - Desc textarea value: " + descTextarea.getAttribute("value"));
        
        Thread.sleep(500);
        submitBtn.click();
        Thread.sleep(2000); // Allow local array update
    }

    public WebElement getTicketElement(String title) {
        By ticketLocator = By.xpath("//strong[contains(text(), '" + title + "')]");
        return wait.until(ExpectedConditions.visibilityOfElementLocated(ticketLocator));
    }

    public WebElement getActiveTicketsContainer() {
        return driver.findElement(activeTicketsContainerLocator);
    }
}
