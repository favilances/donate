package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
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

	app.Use(limiter.New(limiter.Config{
		Max:        30,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{"message": "Çok fazla istek. Lütfen bekleyin."})
		},
	}))

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

	go func() {
		log.Printf("Server running on :%s", port)
		if err := app.Listen(":" + port); err != nil {
			log.Fatalf("Sunucu başlatılamadı: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Server shutting down...")
	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Fatalf("Sunucu kapatılamadı: %v", err)
	}

	if err := database.Disconnect(ctx); err != nil {
		log.Printf("MongoDB bağlantısı kapatılamadı: %v", err)
	}

	log.Println("Server stopped gracefully")
}
