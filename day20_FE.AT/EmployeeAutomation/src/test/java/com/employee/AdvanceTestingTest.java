package com.employee;

import java.time.Duration;
import java.util.List;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.JavascriptExecutor;

public class AdvanceTestingTest {
    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
    public void setUp() {
        // Set the path to the pre-approved chromedriver on D:\
        System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        // Set dynamic wait timeout to 15 seconds for robust frontend rendering
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    /**
     * Helper method to perform login logic before running test actions
     */
    private void performLogin() {
        driver.get("http://localhost:5173");
        
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email-input"))
        );
        WebElement passwordInput = driver.findElement(By.id("password-input"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        emailInput.sendKeys("admin@corptech.com");
        passwordInput.sendKeys("admin123");
        submitButton.click();

        // Wait for dashboard shell to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("portal-shell")));
    }

    /**
     * Helper method to perform standard employee login logic
     */
    private void performEmployeeLogin() {
        driver.get("http://localhost:5173");
        
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email-input"))
        );
        WebElement passwordInput = driver.findElement(By.id("password-input"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        emailInput.sendKeys("employee@corptech.com");
        passwordInput.sendKeys("employee123");
        submitButton.click();

        // Wait for dashboard shell to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("portal-shell")));
    }

    @DataProvider(name = "loginCredentials")
    public Object[][] getLoginCredentials() {
        return new Object[][] {
            { "admin@corptech.com", "admin123", "Nijay V" },
            { "employee@corptech.com", "employee123", "Priya" }
        };
    }

    @Test(dataProvider = "loginCredentials", priority = 0)
    public void testMultiUserLogin(String email, String password, String expectedName) throws InterruptedException {
        driver.get("http://localhost:5173");
        
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email-input"))
        );
        WebElement passwordInput = driver.findElement(By.id("password-input"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        emailInput.sendKeys(email);
        passwordInput.sendKeys(password);
        submitButton.click();

        // Wait for dashboard shell to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("portal-shell")));

        // Verify profile details dynamically
        if (email.contains("admin")) {
            WebElement adminMetaName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.className("admin-name"))
            );
            assertTrue("Admin portal should display admin name", adminMetaName.getText().contains(expectedName));
        } else {
            WebElement welcomeText = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.className("welcome-text"))
            );
            String actualWelcome = welcomeText.getText();
            System.out.println("Actual welcome text: " + actualWelcome);
            assertTrue("Employee portal should display welcome message. Expected to contain: " + expectedName + ", actual was: " + actualWelcome, actualWelcome.toUpperCase().contains(expectedName.toUpperCase()));
        }
    }

    @Test(priority = 1)
    public void test1AdminLogin() {
        performLogin();
        
        WebElement adminMetaName = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("admin-name"))
        );
        String displayedName = adminMetaName.getText();
        System.out.println("Login verification: Admin logged in as " + displayedName);
        assertTrue("Logged in user should be 'Nijay V'", displayedName.contains("Nijay V"));
    }

    @Test(priority = 2)
    public void test2EmployeeDirectorySearchAndFilter() throws InterruptedException {
        performLogin();

        // Retrieve the first employee's name dynamically from the directory table
        WebElement firstEmpNameElement = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("emp-name"))
        );
        String targetEmployeeName = firstEmpNameElement.getText();
        System.out.println("Dynamic test target employee name: " + targetEmployeeName);

        // Locate Search input element
        WebElement searchInput = driver.findElement(By.className("search-input"));

        // Perform search query for the dynamic target employee
        searchInput.sendKeys(targetEmployeeName);
        Thread.sleep(1000); // Wait for filtering animation/logic to run

        // Verify filtered table results contain the searched employee
        WebElement tbody = driver.findElement(By.cssSelector("table tbody"));
        List<WebElement> rows = tbody.findElements(By.tagName("tr"));
        assertTrue("Table should display at least 1 filtered row", rows.size() >= 1);
        
        String firstRowText = rows.get(0).getText();
        assertTrue("Filtered row should match search keyword", firstRowText.contains(targetEmployeeName));

        // Clear Search query using the clear button
        WebElement clearSearchBtn = driver.findElement(By.className("search-clear"));
        clearSearchBtn.click();
        Thread.sleep(1000);

        // Filter directory list by Department selection dropdown
        WebElement departmentSelect = driver.findElement(By.className("select-input"));
        Select selectDept = new Select(departmentSelect);
        
        // Select "Engineering" from filter dropdown (reliable default fallback department)
        selectDept.selectByVisibleText("Engineering");
        Thread.sleep(1000);

        // Verify list is filtered to Engineering members
        tbody = driver.findElement(By.cssSelector("table tbody"));
        rows = tbody.findElements(By.tagName("tr"));
        for (WebElement row : rows) {
            String rowText = row.getText();
            assertTrue("Row should only display Engineering members", rowText.contains("Engineering"));
        }
    }

    @Test(priority = 3)
    public void test3EmployeeFormValidationAndSubmission() throws InterruptedException {
        performLogin();

        // 1. Open the "Add Employee" form modal
        WebElement addEmployeeBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Add Employee')]"))
        );
        addEmployeeBtn.click();

        // Wait for modal to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("modal-card")));

        // 2. Perform field validations by entering invalid values
        WebElement nameInput = driver.findElement(By.id("name"));
        WebElement emailInput = driver.findElement(By.id("email"));
        WebElement roleSelect = driver.findElement(By.id("role"));
        WebElement salaryInput = driver.findElement(By.id("salary"));
        WebElement saveButton = driver.findElement(By.cssSelector("form button[type='submit']"));

        // Too short name and invalid email format
        nameInput.sendKeys("T");
        emailInput.sendKeys("invalid-email-format");
        saveButton.click();
        Thread.sleep(1000);

        // Assert validation messages are visible in the form
        List<WebElement> errors = driver.findElements(By.className("error-text"));
        assertTrue("Validation messages should be shown", errors.size() >= 2);
        
        String combinedErrorsText = "";
        for (WebElement err : errors) {
            combinedErrorsText += err.getText() + " ";
        }
        assertTrue("Should validate name length", combinedErrorsText.contains("Name must be at least 2 characters."));
        assertTrue("Should validate email format", combinedErrorsText.contains("Please enter a valid email address."));

        // 3. Clear errors and submit with valid data
        nameInput.sendKeys(Keys.CONTROL + "a");
        nameInput.sendKeys(Keys.BACK_SPACE);
        // Valid name containing only letters and spaces (must avoid digits like "E2E")
        nameInput.sendKeys("EndToEnd Test Analyst");

        emailInput.sendKeys(Keys.CONTROL + "a");
        emailInput.sendKeys(Keys.BACK_SPACE);
        emailInput.sendKeys("e2e.analyst@corptech.com");

        Select roleSel = new Select(roleSelect);
        roleSel.selectByVisibleText("QA Engineer");

        salaryInput.sendKeys(Keys.CONTROL + "a");
        salaryInput.sendKeys(Keys.BACK_SPACE);
        salaryInput.sendKeys("95000");

        // Submit the form
        saveButton.click();

        // Wait for the modal card to disappear
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal-card")));
        System.out.println("E2E Employee creation and form validation test passed successfully!");
    }

    @Test(priority = 4)
    public void test4NavigationAndAccessControl() {
        performLogin();

        // Navigate to the "Pay Analytics" dashboard section
        WebElement payAnalyticsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Pay Analytics')]"))
        );
        payAnalyticsNav.click();

        // Verify Pay Analytics workspace is active
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("stats-card")));
        assertTrue("Analytics tab should be active", driver.findElement(By.xpath("//a[contains(., 'Pay Analytics')]")).getAttribute("class").contains("active"));

        // Navigate to the "Permissions" section
        WebElement permissionsNav = driver.findElement(By.xpath("//a[contains(., 'Permissions')]"));
        permissionsNav.click();

        // Verify Access Control module renders correctly
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Access Control')]")));
        assertTrue("Permissions tab should be active", driver.findElement(By.xpath("//a[contains(., 'Permissions')]")).getAttribute("class").contains("active"));
    }

    @Test(priority = 5)
    public void test5AnnouncementsBoard() throws InterruptedException {
        performLogin();

        // 1. Navigate to the Announcements Board tab
        WebElement announcementsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Announcements')]"))
        );
        announcementsNav.click();

        // Wait for Announcements page structure
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("announce-title")));

        // 2. Draft and publish a new corporate notice
        WebElement titleInput = driver.findElement(By.id("announce-title"));
        WebElement categorySelect = driver.findElement(By.id("announce-category"));
        WebElement contentArea = driver.findElement(By.id("announce-content"));
        WebElement publishBtn = driver.findElement(By.cssSelector("form button[type='submit']"));

        titleInput.sendKeys("System Downtime Simulation");
        Select catSel = new Select(categorySelect);
        catSel.selectByVisibleText("IT & Security");
        contentArea.sendKeys("There will be a scheduled backup simulation at 11:00 PM tonight. Expect database latency.");

        publishBtn.click();
        Thread.sleep(1000);

        // 3. Verify the published notice is visible in the active bulletins feed
        WebElement boardContent = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//strong[contains(text(), 'System Downtime Simulation')]"))
        );
        assertTrue("Published announcement should be displayed", boardContent.isDisplayed());

        // 4. Delete the published bulletin to leave a clean state
        WebElement deleteBtn = driver.findElement(By.cssSelector("button[title='Delete Bulletin']"));
        deleteBtn.click();
        Thread.sleep(1000);

        // Verify it was removed
        List<WebElement> matchingCards = driver.findElements(By.xpath("//strong[contains(text(), 'System Downtime Simulation')]"));
        assertEquals("Announcement should have been deleted", 0, matchingCards.size());
    }

    @Test(priority = 6)
    public void test6AttendanceCalendarNavigationAndVerification() throws InterruptedException {
        performEmployeeLogin();

        // 1. Navigate to the Attendance Calendar tab
        WebElement attendanceNav = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Attendance Calendar')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", attendanceNav);

        // 2. Wait for the calendar header to contain "Attendance"
        boolean titleIsCorrect = wait.until(
            ExpectedConditions.textToBePresentInElementLocated(By.className("dashboard-title"), "Attendance")
        );
        assertTrue("Calendar page title should contain 'Attendance'", titleIsCorrect);

        // 3. Verify that the grid renders day cells
        List<WebElement> dayCells = driver.findElements(By.className("calendar-day-cell"));
        assertTrue("Calendar should render day cells", dayCells.size() > 0);
        System.out.println("Attendance Calendar verified. Total day cells loaded: " + dayCells.size());

        // 4. Verify that shifts or holiday status is displayed in the calendar cells
        boolean foundShiftOrStatus = false;
        for (WebElement cell : dayCells) {
            String text = cell.getText();
            if (text.contains("Shift") || text.contains("Off") || text.contains("Holiday") || text.contains("Leave")) {
                foundShiftOrStatus = true;
                break;
            }
        }
        assertTrue("Calendar day cells should contain shift schedule or off-duty statuses", foundShiftOrStatus);
    }

    @Test(priority = 7)
    public void test7PerformanceEvaluationUpdateAndSync() throws InterruptedException {
        // 1. Log in as Admin
        performLogin();

        // 2. Locate and search for employee Priya to open the details view
        WebElement searchInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("search-input"))
        );
        searchInput.sendKeys("Priya");
        Thread.sleep(1000);

        WebElement priyaNameLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(@class, 'emp-name') and contains(text(), 'Priya')]"))
        );
        priyaNameLink.click();

        // 3. Switch to the Performance section in the drawer modal
        WebElement performanceTab = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Performance')]"))
        );
        performanceTab.click();

        // 4. Click the Edit Review button
        WebElement editReviewBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.className("edit-eval-btn"))
        );
        editReviewBtn.click();

        // 5. Update rating input, OKR progress, and feedback comments
        WebElement ratingInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("edit-rating-input"))
        );
        ratingInput.clear();
        ratingInput.sendKeys("4.7");

        WebElement okrInput = driver.findElement(By.id("edit-okr-input"));
        // Use keyboard actions to set the range slider value to 85%
        okrInput.sendKeys(Keys.HOME); // Reset slider to 0
        for (int i = 0; i < 85; i++) {
            okrInput.sendKeys(Keys.ARROW_RIGHT);
        }

        WebElement feedbackTextarea = driver.findElement(By.id("edit-feedback-textarea"));
        feedbackTextarea.clear();
        feedbackTextarea.sendKeys("Outstanding performance and leadership on testing infrastructure migration.");

        // 6. Click Save Review
        WebElement saveReviewBtn = driver.findElement(By.className("save-eval-btn"));
        saveReviewBtn.click();
        Thread.sleep(1000);

        // Verify local changes are saved on Admin panel
        WebElement ratingDisplay = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("eval-rating-display"))
        );
        assertTrue("Rating should update to 4.7", ratingDisplay.getText().contains("4.7"));

        // Close the drawer modal
        WebElement closeDrawerBtn = driver.findElement(By.className("drawer-close-btn"));
        closeDrawerBtn.click();
        Thread.sleep(1000);

        // 7. Log out from Admin session
        WebElement logoutBtn = driver.findElement(By.xpath("//button[contains(text(), 'Log Out')]"));
        logoutBtn.click();
        Thread.sleep(1000);

        // 8. Log in as employee Priya
        performEmployeeLogin();

        // 9. Navigate to Performance & Goals tab
        WebElement employeePerformanceTab = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Performance & Goals')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", employeePerformanceTab);

        // 10. Verify that the updated values display correctly in Priya's dashboard
        WebElement scoreText = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//strong[contains(., '4.7')]"))
        );
        assertTrue("Updated score 4.7 should show on Employee dashboard", scoreText.isDisplayed());

        WebElement okrProgressText = driver.findElement(By.xpath("//strong[contains(., '85%')]"));
        assertTrue("Updated OKR 85% should show on Employee dashboard", okrProgressText.isDisplayed());

        WebElement supervisorComments = driver.findElement(By.xpath("//blockquote[contains(., 'Outstanding performance')]"));
        assertTrue("Updated manager feedback comment should show on Employee dashboard", supervisorComments.isDisplayed());
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
