package com.cucumber.demo.stepdefinitions;

import java.time.Duration;
import java.util.logging.Level;
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

import com.cucumber.demo.pages.PortalLoginPage;
import com.cucumber.demo.pages.PortalDashboardPage;
import com.cucumber.demo.pages.HelpdeskPage;
import com.cucumber.demo.pages.LearningPage;

public class EmployeeWorkspaceSteps {

    private WebDriver driver;
    private WebDriverWait wait;
    
    private PortalLoginPage loginPage;
    private PortalDashboardPage dashboardPage;
    private HelpdeskPage helpdeskPage;
    private LearningPage learningPage;

    @Given("the employee is logged in and on the employee dashboard")
    public void the_employee_is_logged_in_and_on_the_employee_dashboard() {
        System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--incognito");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        
        LoggingPreferences logPrefs = new LoggingPreferences();
        logPrefs.enable(LogType.BROWSER, Level.ALL);
        options.setCapability("goog:loggingPrefs", logPrefs);

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        
        // Initialize page objects
        loginPage = new PortalLoginPage(driver, wait);
        dashboardPage = new PortalDashboardPage(driver, wait);
        helpdeskPage = new HelpdeskPage(driver, wait);
        learningPage = new LearningPage(driver, wait);
        
        driver.get("http://localhost:5173");
        
        loginPage.login("employee@corptech.com", "employee123");
    }

    @When("the employee navigates to the IT\\/HR Helpdesk tab")
    public void the_employee_navigates_to_the_it_hr_helpdesk_tab() throws InterruptedException {
        dashboardPage.navigateToHelpdesk();
    }

    @When("the employee submits a support ticket with title {string} and description {string}")
    public void the_employee_submits_a_support_ticket_with_title_and_description(String title, String description) throws InterruptedException {
        helpdeskPage.submitTicket(title, description);
    }

    @Then("the new support ticket {string} should be listed under active tickets")
    public void the_new_support_ticket_should_be_listed_under_active_tickets(String title) {
        try {
            WebElement ticketTitle = helpdeskPage.getTicketElement(title);
            assertTrue("Newly created ticket should be displayed in the list", ticketTitle.isDisplayed());
        } catch (Exception e) {
            try {
                WebElement container = helpdeskPage.getActiveTicketsContainer();
                System.out.println("DEBUG - ACTIVE TICKETS CONTAINER TEXT:\n" + container.getText());
            } catch (Exception ex) {
                System.out.println("DEBUG - Could not locate active tickets container: " + ex.getMessage());
            }
            
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
        dashboardPage.navigateToLearning();
    }

    @When("the employee marks the in-progress course {string} as completed")
    public void the_employee_marks_the_in_progress_course_as_completed(String courseName) throws InterruptedException {
        learningPage.markCourseAsCompleted(courseName);
    }

    @Then("the course {string} status should show as {string}")
    public void the_course_status_should_show_as(String courseName, String status) {
        WebElement statusLabel = learningPage.getCourseStatusElement(courseName, status);
        assertTrue("Course status should be displayed as Completed", statusLabel.isDisplayed());
        driver.quit();
    }
}
