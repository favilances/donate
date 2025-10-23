package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"donation-app/server/database"
	"donation-app/server/routes"
)

func main() {
	_ = godotenv.Load()

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI tanımlanmalı")
	}

	databaseName := os.Getenv("MONGO_DB")
	if databaseName == "" {
		databaseName = "donation_app"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := database.Connect(ctx, mongoURI, databaseName); err != nil {
		log.Fatalf("MongoDB bağlantı hatası: %v", err)
	}

	app := fiber.New()
	app.Use(recover.New())
	app.Use(logger.New())

	allowedOrigin := os.Getenv("FRONTEND_URL")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:5173"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigin,
		AllowCredentials: true,
		AllowHeaders:     "Content-Type, Authorization",
		AllowMethods:     "GET,POST,PUT,OPTIONS",
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	api := app.Group("/api")
	routes.RegisterAuthRoutes(api.Group("/auth"))
	routes.RegisterUserRoutes(api.Group("/users"))
	routes.RegisterDonationRoutes(api)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on :%s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Sunucu başlatılamadı: %v", err)
	}
}
