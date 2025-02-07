// package main

// import (
// 	"context"
// 	"log"
// 	"os"

// 	"github.com/gofiber/fiber/v2"
// 	"github.com/gofiber/fiber/v2/middleware/cors"
// 	"github.com/google/uuid"
// 	"github.com/jackc/pgx/v5"
// 	"github.com/joho/godotenv"
// 	"golang.org/x/crypto/bcrypt"
// )

// func main() {
// 	// Load environment variables from .env file
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	// Get the database connection string from environment variables
// 	connStr := os.Getenv("DATABASE_URL")
// 	if connStr == "" {
// 		log.Fatal("DATABASE_URL is not set in the .env file")
// 	}

// 	// Connect to the PostgreSQL database
// 	conn, err := pgx.Connect(context.Background(), connStr)
// 	if err != nil {
// 		log.Fatalf("Unable to connect to database: %v\n", err)
// 	}
// 	defer conn.Close(context.Background())

// 	// Create a new Fiber app
// 	app := fiber.New()

// 	 // Enable CORS for all origins
//     app.Use(cors.New(cors.Config{
//         AllowOrigins: "*", // Allow all origins (for development purposes)
//         AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
//         AllowHeaders: "Origin, Content-Type, Accept",
//     }))

// 	// GET request to retrieve data from the users table
// 	// http://localhost:3000/users
// 	app.Get("/users", func(c *fiber.Ctx) error {
// 		rows, err := conn.Query(context.Background(), "SELECT user_id, first_name, last_name, email FROM users") // Exclude password
// 		if err != nil {
// 			log.Println("Error retrieving data:", err) // Log the error
// 			return c.Status(500).SendString("Error retrieving data")
// 		}
// 		defer rows.Close()

// 		var results []struct {
// 			UserID    uuid.UUID `json:"user_id"`
// 			FirstName string    `json:"first_name"`
// 			LastName  string    `json:"last_name"`
// 			Email     string    `json:"email"`
// 		}

// 		for rows.Next() {
// 			var userID uuid.UUID
// 			var firstName, lastName, email string
// 			if err := rows.Scan(&userID, &firstName, &lastName, &email); err != nil {
// 				log.Println("Error scanning row:", err) // Log the error
// 				return c.Status(500).SendString("Error scanning row")
// 			}
// 			results = append(results, struct {
// 				UserID    uuid.UUID `json:"user_id"`
// 				FirstName string    `json:"first_name"`
// 				LastName  string    `json:"last_name"`
// 				Email     string    `json:"email"`
// 			}{UserID: userID, FirstName: firstName, LastName: lastName, Email: email})
// 		}

// 		return c.JSON(results) // Return the results as JSON
// 	})

// 	// User struct to represent the user data
// 	type User struct {
// 	    FirstName string `json:"first_name"`
// 	    LastName  string `json:"last_name"`
// 	    Email     string `json:"email"`
// 	    Password  string `json:"password"`
// 	}

// 	// POST request to register a new user
// 	//http://localhost:3000/register
//     app.Post("/register", func(c *fiber.Ctx) error {
//     var user User
//     // Parse the request body into the user struct
//     if err := c.BodyParser(&user); err != nil {
//         return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
//     }

//     // Hash the password
//     hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
//     if err != nil {
//         return c.Status(500).JSON(fiber.Map{"error": "Error hashing password"})
//     }

//     // Insert the user into the database
//     _, err = conn.Exec(context.Background(), "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
//         user.FirstName, user.LastName, user.Email, hashedPassword)
//     if err != nil {
//         // Log the actual error message for debugging
//         log.Println("Error saving user to database:", err) // Log the error
//         return c.Status(500).JSON(fiber.Map{"error": "Error saving user to database"})
//     }

//     // Return a JSON response on successful registration
//     return c.Status(201).JSON(fiber.Map{"message": "User  registered successfully"})
// })

// // PUT request to update user information only updates
// //http://localhost:3000/users/id
// app.Put("/users/:id", func(c *fiber.Ctx) error {
//     id := c.Params("id") // Get the user ID from the URL parameters
//     var user struct {
//         FirstName string `json:"first_name"`
//         LastName  string `json:"last_name"`
//         Email     string `json:"email"`
//     }

//     // Parse the request body into the user struct
//     if err := c.BodyParser(&user); err != nil {
//         return c.Status(400).SendString("Invalid input")
//     }

//     // Update the user's information in the database
//     _, err := conn.Exec(context.Background(), "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4",
//         user.FirstName, user.LastName, user.Email, id)
//     if err != nil {
//         return c.Status(500).SendString("Error updating user information in database")
//     }

//     return c.Status(200).SendString("User  information updated successfully")
// })

// // PUT request to update user password
// //http://localhost:3000/users/id/password
// app.Put("/users/:id/password", func(c *fiber.Ctx) error {
//     id := c.Params("id") // Get the user ID from the URL parameters
//     var requestBody struct {
//         NewPassword string `json:"new_password"`
//     }

//     // Parse the request body into the requestBody struct
//     if err := c.BodyParser(&requestBody); err != nil {
//         return c.Status(400).SendString("Invalid input")
//     }

//     // Hash the new password
//     hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestBody.NewPassword), bcrypt.DefaultCost)
//     if err != nil {
//         return c.Status(500).SendString("Error hashing password")
//     }

//     // Update the user's password in the database
//     _, err = conn.Exec(context.Background(), "UPDATE users SET password = $1 WHERE user_id = $2",
//         hashedPassword, id)
//     if err != nil {
//         return c.Status(500).SendString("Error updating password in database")
//     }

//     // Verify the password change
//     var storedPassword string
//     err = conn.QueryRow(context.Background(), "SELECT password FROM users WHERE user_id = $1", id).Scan(&storedPassword)
//     if err != nil {
//         return c.Status(500).SendString("Error retrieving updated password from database")
//     }

//     // Compare the new hashed password with the stored password
//     if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(requestBody.NewPassword)); err != nil {
//         return c.Status(500).SendString("Password change verification failed")
//     }

//     return c.Status(200).SendString("Password updated successfully")
// })

// 	// Start the server
// 	log.Fatal(app.Listen(":8000"))
// }

//***************WITH JWT TOKEN*****************

package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET")) // JWT secret key

var redisClient *redis.Client

func initRedis() {
    redisClient = redis.NewClient(&redis.Options{
        Addr:     "localhost:6379", // Redis server address
        Password: "", // No password set
        DB:       0,  // Use default DB
    })

    // Test the connection
    _, err := redisClient.Ping(context.Background()).Result()
    if err != nil {
        log.Fatalf("Could not connect to Redis: %v", err)
    }
}

func main() {

    initRedis()
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

	   // Enable CORS for all origins
    app.Use(cors.New(cors.Config{
        AllowOrigins: "*", // Allow all origins (for development purposes)
        AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
        AllowHeaders: "Origin, Content-Type, Accept, Authorization", // Allow Authorization header
    }))

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
		if err := c.BodyParser(&user); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
		}

		// Hash the password
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Error hashing password"})
		}

		// Insert the user into the database
		_, err = conn.Exec(context.Background(), "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
			user.FirstName, user.LastName, user.Email, hashedPassword)
		if err != nil {
			log.Println("Error saving user to database:", err)
			return c.Status(500).JSON(fiber.Map{"error": "Error saving user to database"})
		}

		return c.Status(201).JSON(fiber.Map{"message": "User  registered successfully"})
	})

	// POST request to login a user
	app.Post("/login", func(c *fiber.Ctx) error {
    var user User
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
    }

    // Retrieve the user from the database
    var storedPassword string
    err := conn.QueryRow(context.Background(), "SELECT password FROM users WHERE email = $1", user.Email).Scan(&storedPassword)
    if err != nil {
        if err == pgx.ErrNoRows {
            return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
        }
        return c.Status(500).JSON(fiber.Map{"error": "Error retrieving user from database"})
    }

    // Validate the password
    if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.Password)); err != nil {
        return c.Status(401).JSON(fiber.Map{"error": "Invalid email or password"})
    }

    // Generate JWT token
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "email": user.Email,
        "exp":   time.Now().Add(time.Hour * 1).Unix(), // Token expiration time
    })

    // Sign the token with the secret key
    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Could not generate token"})
    }

    // Store the token in Redis with an expiration time
    err = redisClient.Set(context.Background(), tokenString, user.Email, time.Hour).Err()
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Could not store token in Redis"})
    }

    return c.JSON(fiber.Map{"token": tokenString})
	})

	app.Post("/logout", func(c *fiber.Ctx) error {
    token := c.Get("Authorization")
    if token == "" {
        return c.Status(401).JSON(fiber.Map{"error": "No token provided"})
    }

    // Remove the token from Redis
    err := redisClient.Del(context.Background(), token).Err()
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Error logging out"})
    }

    return c.JSON(fiber.Map{"message": "Logged out successfully"})
	})

	// Middleware to protect routes
	app.Use(func(c *fiber.Ctx) error {
    token := c.Get("Authorization")
    if token == "" {
        return c.Status(401).JSON(fiber.Map{"error": "No token provided"})
    }

    // Remove "Bearer " from the token string
    token = token[len("Bearer "):]

    // Check if the token exists in Redis
    email, err := redisClient.Get(context.Background(), token).Result()
    if err == redis.Nil {
        return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
    } else if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Error checking token in Redis"})
    }

    // Set the user email in the context for further use
    c.Locals("email", email)
    return c.Next()
	})

    // PUT request to update user information
    app.Put("/users/:id", func(c *fiber.Ctx) error {
    id := c.Params("id") // Get the user ID from the URL parameters
    var user struct {
        FirstName      string `json:"first_name"`
        LastName       string `json:"last_name"`
        Email          string `json:"email"`
        CurrentPassword string `json:"current_password"` // Add current password
        NewPassword     string `json:"new_password"`     // Add new password
    }

    // Parse the request body into the user struct
    if err := c.BodyParser(&user); err != nil {
        return c.Status(400).SendString("Invalid input")
    }

    // Retrieve the stored password for the user
    var storedPassword string
    err := conn.QueryRow(context.Background(), "SELECT password FROM users WHERE user_id = $1", id).Scan(&storedPassword)
    if err != nil {
        return c.Status(404).SendString("User  not found")
    }

    // Verify the current password
    if err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(user.CurrentPassword)); err != nil {
        return c.Status(401).SendString("Current password is incorrect")
    }

    // Update the user's information in the database
    if user.NewPassword != "" {
        // Hash the new password if provided
        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.NewPassword), bcrypt.DefaultCost)
        if err != nil {
            return c.Status(500).SendString("Error hashing new password")
        }

        // Update the user's information including the new password
        _, err = conn.Exec(context.Background(), "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE user_id = $5",
            user.FirstName, user.LastName, user.Email, hashedPassword, id)
        if err != nil {
            return c.Status(500).SendString("Error updating user information in database")
        }
    } else {
        // Update the user's information without changing the password
        _, err = conn.Exec(context.Background(), "UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4",
            user.FirstName, user.LastName, user.Email, id)
        if err != nil {
            return c.Status(500).SendString("Error updating user information in database")
        }
    }

    return c.Status(200).SendString("User  information updated successfully")
})

	// GET request to retrieve user data
    app.Get("/protected", func(c *fiber.Ctx) error {
    email := c.Locals("email") // Get the email from context

    // Define a struct to hold user data, including UserID
    var user struct {
        UserID    uuid.UUID `json:"user_id"`   // Add user ID field
        FirstName string    `json:"first_name"`
        LastName  string    `json:"last_name"`
        Email     string    `json:"email"`
    }

    // Fetch user data from the database using the email
    err := conn.QueryRow(context.Background(), "SELECT user_id, first_name, last_name, email FROM users WHERE email = $1", email).Scan(&user.UserID, &user.FirstName, &user.LastName, &user.Email)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{"error": "Error retrieving user data"})
    }

    return c.JSON(user) // Return the user data as JSON
})

	// Start the server
	log.Fatal(app.Listen(":8000"))
}