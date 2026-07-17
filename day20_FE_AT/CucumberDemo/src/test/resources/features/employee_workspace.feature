Feature: Employee Workspace Operations

  Scenario: Standard Employee submits a helpdesk ticket and completes a compliance course
    Given the employee is logged in and on the employee dashboard
    When the employee navigates to the IT/HR Helpdesk tab
    And the employee submits a support ticket with title "Laptop Battery Issue" and description "Battery drains in 30 minutes"
    Then the new support ticket "Laptop Battery Issue" should be listed under active tickets
    When the employee navigates to the Learning & Compliance tab
    And the employee marks the in-progress course "Code of Business Conduct" as completed
    Then the course "Code of Business Conduct" status should show as "Completed"
