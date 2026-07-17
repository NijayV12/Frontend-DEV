Feature: User Login

  Scenario: Successful login with valid credentials
    Given User opens the login page
    When user enters the username "testuser"
    And user enters the password "testpassword"
    Then click the Login Button