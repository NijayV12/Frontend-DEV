# CorpTech Employee Automation Test Suite

This directory contains the end-to-end (E2E) automation test suite for the CorpTech Employee Management Portal, built using **Java**, **Selenium WebDriver**, and **JUnit 4**.

---

## 🛠️ Prerequisites

To run these automation tests locally, ensure you have the following configured:

1. **Chrome Browser**: Installed on the host machine.
2. **ChromeDriver**: A compatible version of `chromedriver.exe` placed at:
   `D:\chromedriver.exe`  
   *(This path is specified in the test code to bypass Windows Application Control/AppLocker policies that block execution from the user profile cache).*
3. **Local Dev Server**: The CorpTech React portal must be running on:
   `http://localhost:5173`

---

## 🚀 Running the Tests

Execute the following commands from this directory (`D:\TR\EmployeeAutomation`):

### Run All Tests
Runs all unit and E2E test cases in the project:
```powershell
mvn test
```

### Run Specific Test Classes
* **Run Portal E2E Tests**:
  ```powershell
  mvn test -Dtest=AdvanceTestingTest
  ```
* **Run Browser Setup Verification Test**:
  ```powershell
  mvn test -Dtest=LaunchBrowserTest
  ```

---

## 📂 Test Cases Reference

### 1. `LaunchBrowserTest`
* **Goal**: Simple sanity check to launch Chrome, navigate to Google, maximize window, verify the page title, and close.

### 2. `AdvanceTestingTest`
Contains 5 comprehensive E2E scenarios validating core portal modules:
* **`test1AdminLogin`**: Automates login as system administrator (`admin@corptech.com` / `admin123`) and asserts successful authentication by verifying the welcome metadata.
* **`test2EmployeeDirectorySearchAndFilter`**: 
  * Extracts the first employee name from the roster list, performs a search, and verifies only that record is displayed.
  * Filters the directory by the `"Engineering"` department and asserts all visible records match.
* **`test3EmployeeFormValidationAndSubmission`**:
  * **Negative test**: Inputs invalid data (name length, invalid email format) and asserts that the UI displays form validation error messages.
  * **Positive test**: Submits a valid record (`"EndToEnd Test Analyst"`) and asserts that the modal closes successfully.
* **`test4NavigationAndAccessControl`**: Simulates clicking sidebar links to load "Pay Analytics" and "Permissions" sections, checking active tab statuses.
* **`test5AnnouncementsBoard`**: Navigates to the Announcements tab, posts a new notice bulletin, checks that it is correctly displayed in the feed, and deletes it to restore clean state.
