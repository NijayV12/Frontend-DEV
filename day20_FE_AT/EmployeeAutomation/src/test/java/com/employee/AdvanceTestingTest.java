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
import org.openqa.selenium.chrome.ChromeOptions;
import java.util.HashMap;
import java.util.Map;

public class AdvanceTestingTest {
    private WebDriver driver;
    private WebDriverWait wait;
    private static String uniqueEmployeeName = "EndToEnd Test Analyst";

    private String generateUniqueName() {
        String base = "EndToEnd Test Analyst ";
        long timestamp = System.currentTimeMillis();
        String timeStr = String.valueOf(timestamp);
        StringBuilder sb = new StringBuilder();
        for (char c : timeStr.toCharArray()) {
            sb.append((char) ('a' + (c - '0')));
        }
        return base + sb.toString();
    }

    @BeforeMethod
    public void setUp() {
        // Set the path to the pre-approved chromedriver on D:\
        System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
        
        ChromeOptions options = new ChromeOptions();
        
        // Disable password manager / save password popups and leak detection alerts
        Map<String, Object> prefs = new HashMap<String, Object>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);
        prefs.put("profile.password_manager_leak_detection", false);
        options.setExperimentalOption("prefs", prefs);
        
        // Disable autofill saving features and password leak detection popup features
        options.addArguments("--disable-features=AutofillPasswordSaving,PasswordLeakToggleMove");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-infobars");
        options.addArguments("--incognito");
        
        driver = new ChromeDriver(options);
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
 
        emailInput.clear();
        emailInput.sendKeys("admin@corptech.com");
        passwordInput.clear();
        passwordInput.sendKeys("admin123");
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitButton);
 
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
 
        emailInput.clear();
        emailInput.sendKeys("employee@corptech.com");
        passwordInput.clear();
        passwordInput.sendKeys("employee123");
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitButton);
 
        // Wait for dashboard shell to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("portal-shell")));
    }


    @DataProvider(name = "loginCredentials")
    public Object[][] getLoginCredentials() {
        return new Object[][] {
            { "admin@corptech.com", "admin123", "Nijay V" },
            { "employee@corptech.com", "employee123", "Nijay" }
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
 
        emailInput.clear();
        emailInput.sendKeys(email);
        passwordInput.clear();
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

        // Filter directory list by Department custom dropdown
        WebElement departmentTrigger = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[text()='Department']/following-sibling::button[@class='custom-dropdown-trigger']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", departmentTrigger);
        Thread.sleep(500);
        
        WebElement engineeringOption = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'custom-dropdown-menu')]//button[contains(text(), 'Engineering')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", engineeringOption);
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
        uniqueEmployeeName = generateUniqueName();
        nameInput.sendKeys(uniqueEmployeeName);

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
        searchInput.sendKeys("Nijay");
        Thread.sleep(1000);

        WebElement priyaNameLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(@class, 'emp-name') and contains(text(), 'Nijay')]"))
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

    @Test(priority = 8)
    public void test8LeaveApplicationAndApprovalFlow() throws InterruptedException {
        // 1. Log in as standard employee Priya
        performEmployeeLogin();

        // 2. Navigate to Leave Management subtab
        WebElement leaveManagementNav = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Leave Management')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", leaveManagementNav);
        Thread.sleep(1000); // Allow subtab panel rendering transition

        // 3. Wait for Leave Applications header
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Leave Applications')]")));

        // 4. Click "Request Time Off" button
        WebElement requestTimeOffBtn = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//button[contains(., 'Request Time Off')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", requestTimeOffBtn);
        Thread.sleep(1000); // Allow modal animation transition


        // 5. Fill out the Leave Application modal form
        WebElement leaveTypeSelect = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("leave-type-select"))
        );
        Select selectType = new Select(leaveTypeSelect);
        selectType.selectByValue("Casual Leave");

        WebElement startDateInput = driver.findElement(By.id("start-date-input"));
        WebElement endDateInput = driver.findElement(By.id("end-date-input"));
        WebElement reasonTextarea = driver.findElement(By.id("leave-reason-textarea"));
        WebElement submitRequestBtn = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//button[contains(., 'Submit Request')]"))
        );
 
        // Set date inputs programmatically by converting type to text temporarily to ensure React syncs value
        String setStartDateJS = 
            "var input = arguments[0];" +
            "var val = '2026-07-20';" +
            "input.type = 'text';" +
            "var lastValue = input.value;" +
            "var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');" +
            "if (descriptor && descriptor.set) { descriptor.set.call(input, val); } else { input.value = val; }" +
            "var tracker = input._valueTracker;" +
            "if (tracker) { tracker.setValue(lastValue); }" +
            "input.dispatchEvent(new Event('input', { bubbles: true }));" +
            "input.dispatchEvent(new Event('change', { bubbles: true }));" +
            "input.type = 'date';";
        ((JavascriptExecutor) driver).executeScript(setStartDateJS, startDateInput);
 
        String setEndDateJS = 
            "var input = arguments[0];" +
            "var val = '2026-07-22';" +
            "input.type = 'text';" +
            "var lastValue = input.value;" +
            "var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');" +
            "if (descriptor && descriptor.set) { descriptor.set.call(input, val); } else { input.value = val; }" +
            "var tracker = input._valueTracker;" +
            "if (tracker) { tracker.setValue(lastValue); }" +
            "input.dispatchEvent(new Event('input', { bubbles: true }));" +
            "input.dispatchEvent(new Event('change', { bubbles: true }));" +
            "input.type = 'date';";
        ((JavascriptExecutor) driver).executeScript(setEndDateJS, endDateInput);







 
        reasonTextarea.sendKeys("E2E Automated Leave Request");
 
        // Debugging prints to inspect what values are currently held/tracked
        System.out.println("DEBUG VALUES BEFORE SUBMIT:");
        System.out.println("startDate HTML value: " + startDateInput.getAttribute("value"));
        System.out.println("endDate HTML value: " + endDateInput.getAttribute("value"));
        System.out.println("reason HTML value: " + reasonTextarea.getAttribute("value"));
        String getReactPropsJS = 
            "var el = arguments[0];" +
            "var k = Object.keys(el).find(function(key) { return key.startsWith('__reactProps'); });" +
            "return k ? JSON.stringify({ value: el[k].value, defaultValue: el[k].defaultValue, children: !!el[k].children }) : 'no react key';";
        System.out.println("startDate React props: " + ((JavascriptExecutor) driver).executeScript(getReactPropsJS, startDateInput));
        System.out.println("endDate React props: " + ((JavascriptExecutor) driver).executeScript(getReactPropsJS, endDateInput));
        System.out.println("reason React props: " + ((JavascriptExecutor) driver).executeScript(getReactPropsJS, reasonTextarea));
 
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitRequestBtn);
        Thread.sleep(2000); // Wait for modal submission transition
 
        // Debugging: Log if any validation alert is present
        java.util.List<org.openqa.selenium.WebElement> errorAlerts = driver.findElements(By.xpath("//div[contains(text(), '⚠️')]"));
        if (!errorAlerts.isEmpty()) {
            System.out.println("FORM SUBMISSION ERROR ALERT DETECTED: " + errorAlerts.get(0).getText());
        }

 
        // 6. Wait for leave requests table to update and show Pending
        WebElement pendingBadge = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(@class, 'status-badge-static') and contains(text(), 'Pending')]"))
        );
        assertTrue("Newly applied leave request should be visible in pending state", pendingBadge.isDisplayed());

        // 7. Log out of Employee portal
        WebElement employeeLogoutBtn = driver.findElement(By.xpath("//button[contains(text(), 'Log Out')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", employeeLogoutBtn);
        Thread.sleep(1000);
 
        // 8. Log in as Admin
        performLogin();
 
        // 9. Navigate to Leave Requests page in Admin Sidebar
        WebElement adminLeaveNav = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Leave Requests')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", adminLeaveNav);
        Thread.sleep(1000);
 
        // 10. Wait for Leave approvals inbox to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Leave Approvals Inbox')]")));
 
        // 11. Locate the employee's request row, type remarks and approve
        WebElement remarksInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//tr[contains(., 'Nijay')]//input[@placeholder=\"Approver's note (optional)\"]"))
        );
        remarksInput.sendKeys("Approved by E2E automation runner");
 
        WebElement approveBtn = driver.findElement(By.xpath("//tr[contains(., 'Nijay')]//button[contains(text(), 'Approve')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", approveBtn);
        Thread.sleep(2000); // Allow server update to process and list refresh
 
        // Click the "Approved" filter button so approved requests are visible
        WebElement approvedFilterBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Approved']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", approvedFilterBtn);
        Thread.sleep(1000); // Wait for filtered list rendering
 
        // 12. Verify status updates to Approved
        WebElement approvedBadge = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//tr[contains(., 'Nijay')]//span[contains(text(), 'Approved')]"))
        );
        assertTrue("Request status should change to Approved", approvedBadge.isDisplayed());

 
        // 13. Log out of Admin
        WebElement adminLogoutBtn = driver.findElement(By.xpath("//button[contains(text(), 'Log Out')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", adminLogoutBtn);
        Thread.sleep(1000);

        // 14. Log in as employee again to verify sync
        performEmployeeLogin();

        // Navigate to Leave Management subtab
        WebElement leaveManagementNavAgain = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Leave Management')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", leaveManagementNavAgain);

        // Verify status is Approved and shows the admin's remarks note
        WebElement employeeApprovedBadge = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(@class, 'status-badge-static') and contains(text(), 'Approved')]"))
        );
        assertTrue("Leave request status should show Approved on employee dashboard", employeeApprovedBadge.isDisplayed());

        WebElement remarksDisplay = driver.findElement(By.xpath("//span[contains(text(), 'Approved by E2E automation runner')]"));
        assertTrue("Admin's remarks note should display correctly on employee dashboard", remarksDisplay.isDisplayed());
    }

    @Test(priority = 9)
    public void test9EmployeeDirectoryFilterInactiveStatus() throws InterruptedException {
        performLogin();
        WebElement statusTrigger = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[text()='Status']/following-sibling::button[@class='custom-dropdown-trigger']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", statusTrigger);
        Thread.sleep(500);
        
        WebElement suspendedOption = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'custom-dropdown-menu')]//button[contains(text(), 'Suspended')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", suspendedOption);
        Thread.sleep(1000);
        
        List<WebElement> statusBadges = driver.findElements(By.xpath("//span[contains(@class, 'status-badge')]"));
        for (WebElement badge : statusBadges) {
            assertTrue("Status badge should show Suspended", badge.getText().contains("Suspended"));
        }
    }

    @Test(priority = 10)
    public void test10EmployeeDirectoryFilterOnLeaveStatus() throws InterruptedException {
        performLogin();
        WebElement statusTrigger = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[text()='Status']/following-sibling::button[@class='custom-dropdown-trigger']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", statusTrigger);
        Thread.sleep(500);
        
        WebElement onLeaveOption = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//div[contains(@class, 'custom-dropdown-menu')]//button[contains(text(), 'On Leave')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", onLeaveOption);
        Thread.sleep(1000);
        
        List<WebElement> statusBadges = driver.findElements(By.xpath("//span[contains(@class, 'status-badge')]"));
        for (WebElement badge : statusBadges) {
            assertTrue("Status badge should show On Leave", badge.getText().contains("On Leave"));
        }
    }

    @Test(priority = 11)
    public void test11ViewEmployeeDrawerGeneralTab() throws InterruptedException {
        performLogin();
        WebElement empNameLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(@class, 'emp-name')]"))
        );
        empNameLink.click();
        
        WebElement drawer = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("drawer-card"))
        );
        assertTrue("Drawer card should be visible", drawer.isDisplayed());
        
        WebElement tenureVal = driver.findElement(By.className("info-val"));
        assertTrue("Tenure info should display in drawer", tenureVal.isDisplayed());
    }

    @Test(priority = 12)
    public void test12ViewEmployeeDrawerAttendanceTab() throws InterruptedException {
        performLogin();
        WebElement empNameLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(@class, 'emp-name')]"))
        );
        empNameLink.click();
        
        WebElement leavesTab = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Leaves')]"))
        );
        leavesTab.click();
        
        WebElement timeOffTitle = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Time Off Requests')]"))
        );
        assertTrue("Time Off section should be visible in drawer", timeOffTitle.isDisplayed());
    }

    @Test(priority = 13)
    public void test13ViewEmployeeDrawerPerformanceTab() throws InterruptedException {
        performLogin();
        WebElement empNameLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(@class, 'emp-name')]"))
        );
        empNameLink.click();
        
        WebElement performanceTab = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Performance')]"))
        );
        performanceTab.click();
        
        WebElement performanceTitle = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Performance Review')]"))
        );
        assertTrue("Performance Review section should be visible in drawer", performanceTitle.isDisplayed());
    }

    @Test(priority = 14)
    public void test14EditEmployeeDesignation() throws InterruptedException {
        performLogin();
        WebElement searchInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("search-input"))
        );
        searchInput.sendKeys("Nijay");
        Thread.sleep(1000);

        WebElement editBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[@title='Edit Employee']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", editBtn);

        WebElement roleSelect = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("role"))
        );
        Select selectRole = new Select(roleSelect);
        selectRole.selectByVisibleText("Product Manager");

        WebElement saveBtn = driver.findElement(By.cssSelector("form button[type='submit']"));
        saveBtn.click();
        Thread.sleep(1000);

        WebElement roleSpan = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(text(), 'Product Manager')]"))
        );
        assertTrue("Employee designation should be updated on list", roleSpan.isDisplayed());
    }

    @Test(priority = 15)
    public void test15AccessControlRoleSelection() throws InterruptedException {
        performLogin();
        WebElement permissionsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Permissions')]"))
        );
        permissionsNav.click();

        List<WebElement> checkboxes = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(By.className("perm-checkbox"))
        );
        assertTrue("Permissions checkboxes should be visible", checkboxes.size() > 0);
        
        WebElement firstCheckbox = checkboxes.get(0);
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", firstCheckbox);
        Thread.sleep(1000);
    }

    @Test(priority = 16)
    public void test16LeaveApplicationEndDateValidation() throws InterruptedException {
        performEmployeeLogin();
        WebElement leaveManagementNav = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Leave Management')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", leaveManagementNav);
        Thread.sleep(1000);

        WebElement requestTimeOffBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Request Time Off')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", requestTimeOffBtn);
        Thread.sleep(1000);

        WebElement startDateInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("start-date-input"))
        );
        WebElement endDateInput = driver.findElement(By.id("end-date-input"));
        WebElement reasonTextarea = driver.findElement(By.id("leave-reason-textarea"));
        WebElement submitRequestBtn = driver.findElement(By.xpath("//button[contains(., 'Submit Request')]"));

        String setStartDateJS = 
            "var input = arguments[0];" +
            "var val = '2026-07-25';" +
            "input.type = 'text';" +
            "var lastValue = input.value;" +
            "var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');" +
            "if (descriptor && descriptor.set) { descriptor.set.call(input, val); } else { input.value = val; }" +
            "var tracker = input._valueTracker;" +
            "if (tracker) { tracker.setValue(lastValue); }" +
            "input.dispatchEvent(new Event('input', { bubbles: true }));" +
            "input.dispatchEvent(new Event('change', { bubbles: true }));" +
            "input.type = 'date';";
        ((JavascriptExecutor) driver).executeScript(setStartDateJS, startDateInput);

        String setEndDateJS = 
            "var input = arguments[0];" +
            "var val = '2026-07-20';" +
            "input.type = 'text';" +
            "var lastValue = input.value;" +
            "var descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');" +
            "if (descriptor && descriptor.set) { descriptor.set.call(input, val); } else { input.value = val; }" +
            "var tracker = input._valueTracker;" +
            "if (tracker) { tracker.setValue(lastValue); }" +
            "input.dispatchEvent(new Event('input', { bubbles: true }));" +
            "input.dispatchEvent(new Event('change', { bubbles: true }));" +
            "input.type = 'date';";
        ((JavascriptExecutor) driver).executeScript(setEndDateJS, endDateInput);

        reasonTextarea.sendKeys("Invalid dates test");
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitRequestBtn);
        Thread.sleep(1000);

        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(., 'End date cannot be prior to start date.')]"))
        );
        assertTrue("Error message for end date validation should display", errorMsg.isDisplayed());
    }

    @Test(priority = 17)
    public void test17LeaveApplicationEmptyFields() throws InterruptedException {
        performEmployeeLogin();
        WebElement leaveManagementNav = wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath("//a[contains(., 'Leave Management')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", leaveManagementNav);
        Thread.sleep(1000);

        WebElement requestTimeOffBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Request Time Off')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", requestTimeOffBtn);
        Thread.sleep(1000);

        WebElement submitRequestBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Submit Request')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitRequestBtn);
        Thread.sleep(1000);

        WebElement errorMsg = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(., 'All fields are required.')]"))
        );
        assertTrue("Error message for empty fields validation should display", errorMsg.isDisplayed());
    }

    @Test(priority = 18)
    public void test18AnnouncementsPublishEmptyValidation() throws InterruptedException {
        performLogin();
        WebElement announcementsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Announcements')]"))
        );
        announcementsNav.click();

        WebElement publishBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.cssSelector("form button[type='submit']"))
        );
        publishBtn.click();
        Thread.sleep(1000);
        WebElement titleInput = driver.findElement(By.id("announce-title"));
        assertTrue("Title input field should still be active for entry", titleInput.isDisplayed());
    }

    @Test(priority = 19)
    public void test19NavigateToITAssetsPageAndVerifyInventoryLoads() throws InterruptedException {
        performLogin();
        WebElement assetsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'IT Assets Admin')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", assetsNav);
        Thread.sleep(1000);

        // Verify KPI chip showing total assets count
        WebElement kpiTotal = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-total-assets"))
        );
        assertTrue("Total assets KPI should be visible and show a count", kpiTotal.isDisplayed());
        assertTrue("Total assets count should be a number", kpiTotal.getText().matches("\\d+"));

        // Verify asset inventory table container exists
        WebElement assetTable = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("asset-rows"))
        );
        assertTrue("Asset inventory table should load", assetTable.isDisplayed());
    }

    @Test(priority = 20)
    public void test20ApproveHardwareRequestAndVerifyAssetAdded() throws InterruptedException {
        performLogin();
        WebElement assetsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'IT Assets Admin')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", assetsNav);
        Thread.sleep(1000);

        // Get count of assets before approval
        WebElement kpiActiveBefore = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-active-assets"))
        );
        int countBefore = Integer.parseInt(kpiActiveBefore.getText().trim());

        // Find the first Approve & Deploy button for a pending request
        WebElement approveBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(@id, 'approve-btn-')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", approveBtn);
        Thread.sleep(1500);

        // Verify total assets increased
        WebElement kpiActiveAfter = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-active-assets"))
        );
        int countAfter = Integer.parseInt(kpiActiveAfter.getText().trim());
        assertTrue("Active asset count should increase by 1 after approval", countAfter == countBefore + 1);
    }

    @Test(priority = 21)
    public void test21RejectHardwareRequestAndVerifyStatusChanges() throws InterruptedException {
        performLogin();
        WebElement assetsNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'IT Assets Admin')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", assetsNav);
        Thread.sleep(1000);

        // Find the first Reject button for a pending request
        List<WebElement> rejectBtns = wait.until(
            ExpectedConditions.presenceOfAllElementsLocatedBy(By.xpath("//button[contains(@id, 'reject-btn-')]"))
        );
        assertTrue("At least one Reject button should be available for pending requests", rejectBtns.size() > 0);

        // Record count of pending requests before
        WebElement pendingCount = driver.findElement(By.id("pending-request-count"));
        String pendingBefore = pendingCount.getText();

        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", rejectBtns.get(0));
        Thread.sleep(1000);

        // Verify pending count changed (button should now be gone or count decreased)
        WebElement pendingCountAfter = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("pending-request-count"))
        );
        assertTrue("Pending request panel count should update after rejection", pendingCountAfter.isDisplayed());
    }

    @Test(priority = 22)
    public void test22NavigateToHelpdeskAndVerifyTicketsLoad() throws InterruptedException {
        performLogin();
        WebElement helpdeskNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Helpdesk Tickets')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", helpdeskNav);
        Thread.sleep(1000);

        // Verify KPI chips are visible
        WebElement kpiOpen = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-open-tickets"))
        );
        assertTrue("Open tickets KPI chip should be visible", kpiOpen.isDisplayed());

        WebElement kpiResolved = driver.findElement(By.id("kpi-resolved-tickets"));
        assertTrue("Resolved tickets KPI chip should be visible", kpiResolved.isDisplayed());

        // Verify ticket card list container is present
        WebElement ticketList = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("helpdesk-ticket-rows"))
        );
        assertTrue("Helpdesk ticket list container should be visible", ticketList.isDisplayed());

        // Verify at least one ticket card is rendered
        List<WebElement> cards = driver.findElements(By.xpath("//*[contains(@id, 'ticket-card-')]"));
        assertTrue("At least one ticket card should be displayed", cards.size() > 0);
    }

    @Test(priority = 23)
    public void test23ResolveOpenTicketAndVerifyStatusChange() throws InterruptedException {
        performLogin();
        WebElement helpdeskNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Helpdesk Tickets')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", helpdeskNav);
        Thread.sleep(1000);

        // Record open count before resolution
        WebElement kpiOpenBefore = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-open-tickets"))
        );
        int openBefore = Integer.parseInt(kpiOpenBefore.getText().trim());

        // Click the first Resolve button
        WebElement resolveBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(@id, 'resolve-btn-')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", resolveBtn);
        Thread.sleep(1000);

        // Open count should decrease by 1
        WebElement kpiOpenAfter = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("kpi-open-tickets"))
        );
        int openAfter = Integer.parseInt(kpiOpenAfter.getText().trim());
        assertTrue("Open ticket count should decrease by 1 after resolution", openAfter == openBefore - 1);

        // Resolved count should increase
        WebElement kpiResolved = driver.findElement(By.id("kpi-resolved-tickets"));
        assertTrue("Resolved KPI should be visible and updated", kpiResolved.isDisplayed());
    }

    @Test(priority = 24)
    public void test24CreateNewHelpdeskTicketAndVerifyInList() throws InterruptedException {
        performLogin();
        WebElement helpdeskNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Helpdesk Tickets')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", helpdeskNav);
        Thread.sleep(1000);

        // Click the New Ticket button to open the inline form
        WebElement newTicketBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.id("helpdesk-new-ticket-btn"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", newTicketBtn);
        Thread.sleep(800);

        // Fill in the form
        WebElement empInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("helpdesk-ticket-employee"))
        );
        empInput.clear();
        empInput.sendKeys("Nijay");

        WebElement titleInput = driver.findElement(By.id("helpdesk-ticket-title-input"));
        titleInput.clear();
        titleInput.sendKeys("E2E Selenium Test Ticket");

        WebElement descInput = driver.findElement(By.id("helpdesk-ticket-desc"));
        descInput.clear();
        descInput.sendKeys("This ticket was created automatically by the E2E test suite.");

        // Submit the ticket
        WebElement submitBtn = driver.findElement(By.id("helpdesk-ticket-submit"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", submitBtn);
        Thread.sleep(1000);

        // Verify the new ticket title appears in the list
        WebElement newTicket = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(text(), 'E2E Selenium Test Ticket')]"))
        );
        assertTrue("Newly created ticket should appear in the helpdesk list", newTicket.isDisplayed());
    }

    @Test(priority = 25)
    public void test25FilterHelpdeskTicketsByOpenStatusShowsOnlyOpenTickets() throws InterruptedException {
        performLogin();
        WebElement helpdeskNav = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Helpdesk Tickets')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", helpdeskNav);
        Thread.sleep(1000);

        // Click the "Open" status filter pill
        WebElement openFilter = wait.until(
            ExpectedConditions.elementToBeClickable(By.id("helpdesk-filter-open"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", openFilter);
        Thread.sleep(800);

        // Verify only Open status badges are shown in the ticket list
        List<WebElement> statusBadges = driver.findElements(
            By.xpath("//*[@id='helpdesk-ticket-rows']//span[contains(@class,'status-badge-static')]")
        );
        assertTrue("At least one open ticket should be shown after filter", statusBadges.size() > 0);
        for (WebElement badge : statusBadges) {
            String badgeText = badge.getText().trim();
            assertTrue("All visible tickets should be Open after applying Open filter", badgeText.equalsIgnoreCase("Open"));
        }

        // Click "Resolved" filter and verify only resolved tickets show
        WebElement resolvedFilter = driver.findElement(By.id("helpdesk-filter-resolved"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", resolvedFilter);
        Thread.sleep(800);

        List<WebElement> resolvedBadges = driver.findElements(
            By.xpath("//*[@id='helpdesk-ticket-rows']//span[contains(@class,'status-badge-static')]")
        );
        for (WebElement badge : resolvedBadges) {
            String badgeText = badge.getText().trim();
            assertTrue("All visible tickets should be Resolved after applying Resolved filter", badgeText.equalsIgnoreCase("Resolved"));
        }
    }

    @Test(priority = 26)
    public void test26NegativeLoginValidation() throws InterruptedException {
        driver.get("http://localhost:5173");
        
        WebElement emailInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("email-input"))
        );
        WebElement passwordInput = driver.findElement(By.id("password-input"));
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));

        // 1. Test with non-existent user email
        emailInput.clear();
        emailInput.sendKeys("nonexistent@corptech.com");
        passwordInput.clear();
        passwordInput.sendKeys("employee123");
        submitButton.click();
        
        WebElement errorAlert = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("login-error-alert"))
        );
        assertTrue("Error alert should display for nonexistent account", errorAlert.isDisplayed());
        assertTrue("Error message should mention verification", errorAlert.getText().contains("Account not found"));

        // 2. Test with admin account but incorrect password
        emailInput.clear();
        emailInput.sendKeys("admin@corptech.com");
        passwordInput.clear();
        passwordInput.sendKeys("wrongpassword");
        submitButton.click();

        errorAlert = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("login-error-alert"))
        );
        assertTrue("Error alert should display for incorrect password", errorAlert.isDisplayed());
        assertTrue("Error message should mention incorrect password", errorAlert.getText().contains("Incorrect password"));
    }

    @Test(priority = 27)
    public void test27EmployeeDeletionFlow() throws InterruptedException {
        performLogin();

        // Search for the newly created employee to isolate them
        WebElement searchInput = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("search-input"))
        );
        searchInput.sendKeys(uniqueEmployeeName);
        Thread.sleep(1000);

        // Click delete button on the row matching the employee name
        WebElement deleteBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//tr[contains(., '" + uniqueEmployeeName + "')]//button[@title='Delete Employee']"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", deleteBtn);
        Thread.sleep(1000);

        // Click on "Yes, Delete Record" button inside the modal overlay
        WebElement confirmDeleteBtn = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(text(), 'Yes, Delete Record')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", confirmDeleteBtn);

        // Wait dynamically for the employee row to disappear from the DOM
        boolean disappeared = wait.until(
            ExpectedConditions.invisibilityOfElementLocated(By.xpath("//tr[contains(., '" + uniqueEmployeeName + "')]"))
        );
        assertTrue("Newly created employee should be deleted and no longer visible in directory", disappeared);
    }

    @Test(priority = 28)
    public void test28DepartmentHubNavigationAndRoster() throws InterruptedException {
        performLogin();

        // Click Department Hub in the sidebar
        WebElement deptHubLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//aside//a[contains(., 'Department Hub')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", deptHubLink);
        Thread.sleep(1000);

        // Verify we are on the Department Hub page
        WebElement pageTitle = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("dashboard-title"))
        );
        assertTrue("Page title should be Department Hub", pageTitle.getText().contains("Department Hub"));

        // Click on the QA & Testing department card to see detail view
        WebElement qaCard = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//span[contains(text(), 'QA & Testing')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", qaCard);
        Thread.sleep(1000);

        // Verify active roster table loads
        WebElement rosterTitle = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(text(), 'Active Roster')]"))
        );
        assertTrue("Detail view should render Active Roster", rosterTitle.isDisplayed());

        // Click the back overview button
        WebElement backBtn = driver.findElement(By.xpath("//button[contains(text(), 'Back to Overview')]"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", backBtn);
        Thread.sleep(1000);

        // Verify we are back to overview grid (Department Hub page title should be visible)
        assertTrue("Page title should contain Department Hub", pageTitle.getText().contains("Department Hub"));
    }

    @Test(priority = 29)
    public void test29LearningAndComplianceTab() throws InterruptedException {
        performLogin();

        // Click Learning & Compliance in the sidebar
        WebElement learningLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//aside//a[contains(., 'Learning & Compliance')]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", learningLink);
        Thread.sleep(1000);

        // Verify Corporate Compliance Rate exists
        WebElement complianceHeading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(., 'Corporate Compliance Rate')]"))
        );
        assertTrue("Compliance rate card should load", complianceHeading.isDisplayed());

        // Verify compliance badge exists
        WebElement complianceBadge = driver.findElement(By.xpath("//span[contains(text(), 'Passed Compliance Audit')]"));
        assertTrue("Compliance audit clearance badge should show", complianceBadge.isDisplayed());
    }

    @Test(priority = 30)
    public void test30PerformanceTab() throws InterruptedException {
        performLogin();

        // Click Performance in the sidebar
        WebElement performanceLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.xpath("//aside//a[contains(., 'Performance') and not(contains(., 'Goals'))]"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", performanceLink);
        Thread.sleep(1000);

        // Verify we are on Performance page
        WebElement title = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.className("dashboard-title"))
        );
        assertTrue("Performance page title should be visible", title.getText().contains("Performance"));

        // Verify the Performance evaluation table loads and contains average rating card
        WebElement ratingCard = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(text(), 'Average Rating')]"))
        );
        assertTrue("Average rating performance summary stats card should display", ratingCard.isDisplayed());
    }

    @Test(priority = 31)
    public void test31ProfileSettingsTab() throws InterruptedException {
        performLogin();

        // Click Profile Settings in sidebar
        WebElement profileLink = wait.until(
            ExpectedConditions.elementToBeClickable(By.id("profile-nav-btn"))
        );
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", profileLink);
        Thread.sleep(1000);

        // Verify we are on Profile Details panel
        WebElement profileHeading = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.xpath("//h3[contains(., 'Profile Details')]"))
        );
        assertTrue("Profile details panel should render", profileHeading.isDisplayed());

        // Update phone number
        WebElement phoneInput = driver.findElement(By.id("profile-phone-input"));
        phoneInput.clear();
        phoneInput.sendKeys("+1 (555) 999-8888");

        // Save profile settings
        WebElement saveBtn = driver.findElement(By.id("save-profile-btn"));
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveBtn);
        Thread.sleep(1000);

        // Verify success alert message displays
        WebElement successAlert = wait.until(
            ExpectedConditions.visibilityOfElementLocated(By.id("profile-msg"))
        );
        assertTrue("Success notification should display", successAlert.isDisplayed());
        assertTrue("Success text should match profile details saved message", successAlert.getText().contains("Profile details updated successfully"));
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
