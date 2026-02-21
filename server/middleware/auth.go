package middleware

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"donation-app/server/database"
	"donation-app/server/models"
	"donation-app/server/utils"
)

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return utils.Error(c, fiber.StatusUnauthorized, "Yetkisiz erişim")
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return utils.Error(c, fiber.StatusUnauthorized, "Geçersiz yetki başlığı")
		}

		token, err := utils.ValidateToken(parts[1])
		if err != nil || !token.Valid {
			return utils.Error(c, fiber.StatusUnauthorized, "Oturum süresi doldu")
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return utils.Error(c, fiber.StatusUnauthorized, "Geçersiz oturum")
		}

		userID, ok := claims["sub"].(string)
		if !ok {
			return utils.Error(c, fiber.StatusUnauthorized, "Geçersiz oturum")
		}

		objectID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			return utils.Error(c, fiber.StatusUnauthorized, "Geçersiz kullanıcı")
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var user models.User
		if err := database.Collection("users").FindOne(ctx, bson.M{"_id": objectID}).Decode(&user); err != nil {
			return utils.Error(c, fiber.StatusUnauthorized, "Kullanıcı bulunamadı")
		}

		c.Locals("user", user)
		return c.Next()
	}
}
