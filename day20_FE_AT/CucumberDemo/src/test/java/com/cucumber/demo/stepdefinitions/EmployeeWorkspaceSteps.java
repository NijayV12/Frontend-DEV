package com.cucumber.demo.stepdefinitions;

import java.time.Duration;
import java.util.logging.Level;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import static org.junit.Assert.assertTrue;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class EmployeeWorkspaceSteps {

    private WebDriver driver;
    private WebDriverWait wait;

    @Given("the employee is logged in and on the employee dashboard")
    public void the_employee_is_logged_in_and_on_the_employee_dashboard() {
        System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--incognito");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        
        // Enable browser log capturing
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        options.setCapability("goog:loggingPrefs", logPrefs);

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        
        driver.get("http://localhost:5173");
        
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email-input"))
        );
        WebElement passwordInput = driver.findElement(By.id("password-input"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        emailInput.clear();
        emailInput.sendKeys("employee@corptech.com");
        passwordInput.clear();
        passwordInput.sendKeys("employee123");
        
        submitButton.click();

        // Wait for dashboard welcome text to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("welcome-text")));
    }

    @When("the employee navigates to the IT\\/HR Helpdesk tab")
    public void the_employee_navigates_to_the_it_hr_helpdesk_tab() throws InterruptedException {
        WebElement helpdeskTab = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'IT/HR Helpdesk')]"))
        );
        helpdeskTab.click();
        Thread.sleep(1000); // Allow view to transition
    }

    @When("the employee submits a support ticket with title {string} and description {string}")
    public void the_employee_submits_a_support_ticket_with_title_and_description(String title, String description) throws InterruptedException {
        WebElement titleInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='Summarize the issue...']"))
        );
        WebElement descTextarea = driver.findElement(By.xpath("//textarea[@placeholder='Describe the issue in detail...']"));
        WebElement submitBtn = driver.findElement(By.xpath("//button[text()='Submit Ticket']"));

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

    @Then("the new support ticket {string} should be listed under active tickets")
    public void the_new_support_ticket_should_be_listed_under_active_tickets(String title) {
        try {
            WebElement ticketTitle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.xpath("//strong[contains(text(), '" + title + "')]"))
            );
            assertTrue("Newly created ticket should be displayed in the list", ticketTitle.isDisplayed());
        } catch (Exception e) {
            // Print active tickets container text for diagnostics
            try {
                WebElement container = driver.findElement(By.xpath("//div[./h3[contains(., 'Active Support Tickets')]]"));
                System.out.println("DEBUG - ACTIVE TICKETS CONTAINER TEXT:\n" + container.getText());
            } catch (Exception ex) {
                System.out.println("DEBUG - Could not locate active tickets container: " + ex.getMessage());
            }
            
            // Print browser console logs
            try {
                LogEntries logEntries = driver.manage().logs().get(LogType.BROWSER);
                System.out.println("DEBUG - BROWSER CONSOLE LOGS:");
                for (LogEntry entry : logEntries) {
                    System.out.println(entry.getLevel() + ": " + entry.getMessage());
                }
            } catch (Exception ex) {
                System.out.println("DEBUG - Could not retrieve browser logs: " + ex.getMessage());
            }
            throw e;
        }
    }

    @When("the employee navigates to the Learning & Compliance tab")
    public void the_employee_navigates_to_the_learning_compliance_tab() throws InterruptedException {
        WebElement learningTab = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Learning & Compliance') and contains(@class, 'nav-item')]"))
        );
        learningTab.click();
        Thread.sleep(1000); // Allow transition
    }

    @When("the employee marks the in-progress course {string} as completed")
    public void the_employee_marks_the_in_progress_course_as_completed(String courseName) throws InterruptedException {
        WebElement markCompletedBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(., '" + courseName + "')]//button[contains(text(), 'Mark Completed')]"))
        );
        markCompletedBtn.click();
        Thread.sleep(1000);
    }

    @Then("the course {string} status should show as {string}")
    public void the_course_status_should_show_as(String courseName, String status) {
        WebElement statusLabel = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(., '" + courseName + "')]//span[contains(text(), '" + status + "')]"))
        );
        assertTrue("Course status should be displayed as Completed", statusLabel.isDisplayed());
        driver.quit();
    }
}
