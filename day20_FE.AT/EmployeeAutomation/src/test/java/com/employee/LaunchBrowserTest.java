package com.employee;

import org.testng.annotations.Test;
import static org.testng.Assert.assertTrue;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LaunchBrowserTest {

    @Test
    public void testLaunchBrowser() {
        // Set the path to the pre-approved chromedriver on D:\
        System.setProperty("webdriver.chrome.driver", "D:\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        
        try {
            // Launch browser and navigate to Google
            driver.get("https://www.google.com");
            driver.manage().window().maximize();
            
            // Print and verify the title
            String title = driver.getTitle();
            System.out.println("Browser launched successfully. Page title is: " + title);
            assertTrue(title.toLowerCase().contains("google"), "Expected page title to contain 'Google'");
        } finally {
            // Close browser session
            driver.quit();
        }
    }
}
