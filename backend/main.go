package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// // User struct to represent the user data
// type User struct {
//     FirstName string `json:"first_name"`
//     LastName  string `json:"last_name"`
//     Email     string `json:"email"`
//     Password  string `json:"password"`
// }

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Get the database connection string from environment variables
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Fatal("DATABASE_URL is not set in the .env file")
	}

	// Connect to the PostgreSQL database
	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(context.Background())

	// Create a new Fiber app
	app := fiber.New()

	// GET request to retrieve data from the users table
	app.Get("/users", func(c *fiber.Ctx) error {
		rows, err := conn.Query(context.Background(), "SELECT user_id, first_name, last_name, email FROM users") // Exclude password
		if err != nil {
			log.Println("Error retrieving data:", err) // Log the error
			return c.Status(500).SendString("Error retrieving data")
		}
		defer rows.Close()

		var results []struct {
			UserID    uuid.UUID `json:"user_id"`
			FirstName string    `json:"first_name"`
			LastName  string    `json:"last_name"`
			Email     string    `json:"email"`
		}

		for rows.Next() {
			var userID uuid.UUID
			var firstName, lastName, email string
			if err := rows.Scan(&userID, &firstName, &lastName, &email); err != nil {
				log.Println("Error scanning row:", err) // Log the error
				return c.Status(500).SendString("Error scanning row")
			}
			results = append(results, struct {
				UserID    uuid.UUID `json:"user_id"`
				FirstName string    `json:"first_name"`
				LastName  string    `json:"last_name"`
				Email     string    `json:"email"`
			}{UserID: userID, FirstName: firstName, LastName: lastName, Email: email})
		}

		return c.JSON(results) // Return the results as JSON
	})

	// User struct to represent the user data
	type User struct {
	    FirstName string `json:"first_name"`
	    LastName  string `json:"last_name"`
	    Email     string `json:"email"`
	    Password  string `json:"password"`
	}


	// POST request to register a new user
    app.Post("/register", func(c *fiber.Ctx) error {
    var user User
    // Parse the request body into the user struct
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).SendString("Error hashing password")
    }

    // Insert the user into the database
    _, err = conn.Exec(context.Background(), "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
        user.FirstName, user.LastName, user.Email, hashedPassword)
    if err != nil {
        return c.Status(500).SendString("Error saving user to database")
    }

    return c.Status(201).SendString("User  registered successfully")
})


// PUT request to update user information only updates
app.Put("/users/:id", func(c *fiber.Ctx) error {
    id := c.Params("id") // Get the user ID from the URL parameters
    var user struct {
        FirstName string `json:"first_name"`
        LastName  string `json:"last_name"`
        Email     string `json:"email"`
    }

    // Parse the request body into the user struct
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    // Update the user's information in the database
    _, err := conn.Exec(context.Background(), "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4",
        user.FirstName, user.LastName, user.Email, id)
    if err != nil {
        return c.Status(500).SendString("Error updating user information in database")
    }

    return c.Status(200).SendString("User  information updated successfully")
})


// PUT request to update user password
app.Put("/users/:id/password", func(c *fiber.Ctx) error {
    id := c.Params("id") // Get the user ID from the URL parameters
    var requestBody struct {
        NewPassword string `json:"new_password"`
    }

    // Parse the request body into the requestBody struct
    if err := c.BodyParser(&requestBody); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    // Hash the new password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.NewPassword), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).SendString("Error hashing password")
    }

    // Update the user's password in the database
    _, err = conn.Exec(context.Background(), "UPDATE users SET password = $1 WHERE user_id = $2",
        hashedPassword, id)
    if err != nil {
        return c.Status(500).SendString("Error updating password in database")
    }

    return c.Status(200).SendString("Password updated successfully")
})


	// Start the server
	log.Fatal(app.Listen(":3000"))
}