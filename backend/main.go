package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

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
		rows, err := conn.Query(context.Background(), "SELECT * FROM users") // Query the users table
		if err != nil {
			return c.Status(500).SendString("Error retrieving data")
		}
		defer rows.Close()

		var results []struct {
			UserID    uuid.UUID `json:"user_id"`    // Change to uuid.UUID
			FirstName string    `json:"first_name"` // Adjust based on your actual column names
			LastName  string    `json:"last_name"`  // Adjust based on your actual column names
			Email     string    `json:"email"`      // Adjust based on your actual column names
			Password  string    `json:"password"`   // Adjust based on your actual column names
		}

		for rows.Next() {
			var userID uuid.UUID
			var firstName, lastName, email, password string
			if err := rows.Scan(&userID, &firstName, &lastName, &email, &password); err != nil {
				return c.Status(500).SendString("Error scanning row: " + err.Error()) // Log the actual error
			}
			results = append(results, struct {
				UserID    uuid.UUID `json:"user_id"`
				FirstName string    `json:"first_name"`
				LastName  string    `json:"last_name"`
				Email     string    `json:"email"`
				Password  string    `json:"password"`
			}{UserID: userID, FirstName: firstName, LastName: lastName, Email: email, Password: password})
		}

		return c.JSON(results) // Return the results as JSON
	})

	// Start the server
	log.Fatal(app.Listen(":3000"))
}